import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { hashPassword, verifyPassword, DUMMY_PASSWORD_HASH } from './password.util';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async storeOAuthState(state: string, intent: string): Promise<void> {
    const redis = this.redisService.getClient();
    // 10 minutes expiration
    await redis.setex(`oauth:state:${state}`, 600, intent);
  }

  async consumeOAuthState(state: string): Promise<string | null> {
    const redis = this.redisService.getClient();
    const intent = await redis.get(`oauth:state:${state}`);
    if (intent) {
      await redis.del(`oauth:state:${state}`);
    }
    return intent;
  }

  private oauthProfileKey(userId: string): string {
    return `oauth:profile:${userId}`;
  }

  async storeOAuthProfile(
    userId: string,
    data: {
      username?: string;
      displayName?: string;
      avatarUrl?: string;
      location?: string;
      websiteUrl?: string;
    },
  ): Promise<void> {
    const filtered: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value) filtered[key] = value;
    }
    if (Object.keys(filtered).length === 0) return;

    const redis = this.redisService.getClient();
    // Transient snapshot, consumed during onboarding; expires after 24h otherwise.
    await redis.setex(this.oauthProfileKey(userId), 60 * 60 * 24, JSON.stringify(filtered));
  }

  async getOAuthProfile(
    userId: string,
  ): Promise<{
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    location?: string;
    websiteUrl?: string;
  } | null> {
    const redis = this.redisService.getClient();
    const raw = await redis.get(this.oauthProfileKey(userId));
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async processGitHubCallback(code: string, intent: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials not configured');
    }

    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      },
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('Failed to retrieve access token from GitHub');
    }

    // Get GitHub User Profile
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userRes.data;
    const providerAccountId = githubUser.id.toString();

    // Check if Identity exists
    const existingIdentity = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'github',
          providerAccountId,
        },
      },
      include: { user: true },
    });

    if (intent === 'new_login') {
      if (existingIdentity) {
        return { user: existingIdentity.user, isNewUser: false };
      }

      // Try fetching email if not available directly
      let email = githubUser.email;
      if (!email) {
        try {
          const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const primaryEmail = emailRes.data.find((e: any) => e.primary && e.verified);
          if (primaryEmail) email = primaryEmail.email;
        } catch (e) {
          // Ignore
        }
      }

      // Link to an existing account that already uses the same email (e.g.
      // created via Google). Avoid creating a duplicate User with a duplicate
      // email. GitHub's primary/verified email is used for this lookup.
      if (email) {
        const existingByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail) {
          await this.prisma.authIdentity.create({
            data: {
              userId: existingByEmail.id,
              provider: 'github',
              providerAccountId,
            },
          });
          return { user: existingByEmail, isNewUser: false };
        }
      }

      // Create new user and identity
      const newUser = await this.prisma.user.create({
        data: {
          email,
          authIdentities: {
            create: {
              provider: 'github',
              providerAccountId,
            },
          },
        },
      });

      await this.storeOAuthProfile(newUser.id, {
        username: githubUser.login,
        displayName: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
        location: githubUser.location,
        websiteUrl: githubUser.blog,
      });

      return { user: newUser, isNewUser: true };
    } else {
      // Intent is an existing user ID (Account Linking)
      const currentUserId = intent;

      if (existingIdentity) {
        if (existingIdentity.userId !== currentUserId) {
          throw new BadRequestException('This GitHub account is already linked to another user');
        }
        return { user: existingIdentity.user, isNewUser: false };
      }

      // Link identity to current user
      await this.prisma.authIdentity.create({
        data: {
          userId: currentUserId,
          provider: 'github',
          providerAccountId,
        },
      });

      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      return { user, isNewUser: false };
    }
  }

  async processGoogleCallback(code: string, intent: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.API_URL || 'http://localhost:3001'}/api/v1/auth/google/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('Failed to retrieve access token from Google');
    }

    // Get User Profile
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const googleUser = userRes.data;
    const providerAccountId = googleUser.id;
    const email = googleUser.email;

    // Check if Identity exists
    const existingIdentity = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId,
        },
      },
      include: { user: true },
    });

    if (intent === 'new_login') {
      if (existingIdentity) {
        return { user: existingIdentity.user, isNewUser: false };
      }

      // Google emails are always verified, so it is safe to link this identity
      // to an existing account that already uses the same email (e.g. created
      // via GitHub). Avoid creating a duplicate User with a duplicate email.
      if (email) {
        const existingByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail) {
          await this.prisma.authIdentity.create({
            data: {
              userId: existingByEmail.id,
              provider: 'google',
              providerAccountId,
            },
          });
          return { user: existingByEmail, isNewUser: false };
        }
      }

      const newUser = await this.prisma.user.create({
        data: {
          email,
          authIdentities: {
            create: {
              provider: 'google',
              providerAccountId,
            },
          },
        },
      });

      await this.storeOAuthProfile(newUser.id, {
        displayName: googleUser.name,
        avatarUrl: googleUser.picture,
      });

      return { user: newUser, isNewUser: true };
    } else {
      const currentUserId = intent;

      if (existingIdentity) {
        if (existingIdentity.userId !== currentUserId) {
          throw new BadRequestException('This Google account is already linked to another user');
        }
        return { user: existingIdentity.user, isNewUser: false };
      }

      await this.prisma.authIdentity.create({
        data: {
          userId: currentUserId,
          provider: 'google',
          providerAccountId,
        },
      });

      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      return { user, isNewUser: false };
    }
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        authIdentities: true,
        developerProfile: {
          include: {
            skills: { include: { skill: true } },
            learningGoals: { include: { learningGoal: true } },
          },
        },
      },
    });

    if (!user) return null;

    // Only new (not-yet-onboarded) users have a pending OAuth profile snapshot.
    const pendingProfile = user.developerProfile
      ? null
      : await this.getOAuthProfile(userId);

    // Never expose the password hash on any user-returning endpoint.
    const { passwordHash: _passwordHash, ...safeUser } = user;
    void _passwordHash;

    return { ...safeUser, pendingProfile };
  }

  /**
   * Authenticates an email/password sign-in. Returns the user on success or
   * null for an unknown email or incorrect password (indistinguishable to the
   * caller to prevent account enumeration).
   */
  async loginWithPassword(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    const user = await this.prisma.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' } },
    });

    if (!user || !user.passwordHash) {
      // Run the same KDF cost as a valid login so timing does not reveal
      // whether the email exists or has a password set.
      await verifyPassword(password, DUMMY_PASSWORD_HASH);
      return null;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    return user;
  }

  /**
   * Looks up the details of a pending invitation from its activation token so
   * the activation page can pre-fill the recipient's name, email, and role.
   * The token itself is the secret, so returning these fields is safe; an
   * invalid, revoked, or expired token yields a generic 401.
   */
  async getInvitationInfo(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const invite = await this.prisma.adminInvite.findFirst({
      where: { tokenHash },
      select: { id: true, email: true, name: true, role: true, status: true, expiresAt: true },
    });
    if (
      !invite ||
      invite.status !== 'PENDING' ||
      !invite.expiresAt ||
      invite.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired invitation');
    }

    return { name: invite.name, email: invite.email, role: invite.role };
  }

  /**
   * Redeems a single-use staff invitation token, creates the password-protected
   * account with the invited role, and marks the invitation accepted atomically.
   * The token lookup and the accepted transition happen inside one transaction
   * keyed on the token hash, so a token cannot be redeemed twice even under
   * concurrent requests.
   */
  async activateInvite(token: string, password: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const invite = await this.prisma.adminInvite.findFirst({
      where: { tokenHash },
    });
    if (
      !invite ||
      invite.status !== 'PENDING' ||
      !invite.expiresAt ||
      invite.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired invitation');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email: { equals: invite.email, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existingUser) {
      throw new BadRequestException('An account already exists for this email');
    }

    const passwordHash = await hashPassword(password);

    try {
      const user = await this.prisma.$transaction(async (tx) => {
        const claimed = await tx.adminInvite.updateMany({
          where: { id: invite.id, status: 'PENDING', tokenHash },
          data: { status: 'ACCEPTED', acceptedAt: new Date(), tokenHash: null },
        });
        if (claimed.count !== 1) {
          throw new UnauthorizedException('Invalid or expired invitation');
        }

        const created = await tx.user.create({
          data: {
            email: invite.email,
            role: invite.role,
            passwordHash,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            actorId: created.id,
            action: 'STAFF_ACCOUNT_ACTIVATED',
            entityType: 'User',
            entityId: created.id,
            metadata: { inviteId: invite.id, role: invite.role },
          },
        });

        return created;
      });

      return { user, isNewUser: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('An account already exists for this email');
      }
      throw error;
    }
  }

  /**
   * Applies a pending staff invitation for the given verified email during
   * sign-in. Only promotes plain USER accounts; never downgrades an existing
   * role. Acceptance is atomic: the invite is claimed only while still
   * PENDING and unexpired, and the role is granted only while the user is
   * still USER.
   */
  async applyPendingStaffInvite(userId: string, email?: string | null): Promise<void> {
    if (!email) return;
    const normalized = email.trim().toLowerCase();

    const invite = await this.prisma.adminInvite.findUnique({
      where: { email: normalized },
    });
    if (!invite || invite.status !== 'PENDING') return;
    if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) return;

    await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.adminInvite.updateMany({
        where: {
          id: invite.id,
          status: 'PENDING',
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        data: { status: 'ACCEPTED', acceptedAt: new Date(), tokenHash: null },
      });
      if (claimed.count !== 1) return;

      const granted = await tx.user.updateMany({
        where: { id: userId, role: 'USER' },
        data: { role: invite.role },
      });
      if (granted.count !== 1) return;

      await tx.adminAuditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_INVITE_ACCEPTED',
          entityType: 'AdminInvite',
          entityId: invite.id,
          metadata: { email: normalized, role: invite.role },
        },
      });
    });
  }
}
