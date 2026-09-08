import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
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

    return { ...user, pendingProfile };
  }
}
