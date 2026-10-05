/**
 * DEV-TO-DEV Curriculum — Cybersecurity Batch 2.
 *
 * Deep, structured lessons for the next four Cybersecurity nodes:
 * Network Security, Cloud Security, Web Application Security, and
 * Secure Coding & SAST.
 *
 * Read only by `author-cyber-batch2.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified. Content is educational and defensive; it never provides
 * operational instructions against real systems.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const cyberBatch2Lessons: PilotLesson[] = [
  // =====================================================================
  // 6. Network Security
  // =====================================================================
  {
    nodeId: 'd8b0a252-1367-4832-a257-91ca4f803fc3',
    nodeTitle: 'Network Security',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Network security is the practice of protecting the systems, traffic, and boundaries of a network so that only intended communication happens. It applies the CIA Triad to everything that moves between hosts: keeping data confidential in transit, ensuring it is not altered, and keeping services reachable when they should be.\n\n' +
            'This lesson builds a defensive mental model of a network. You will learn the attack surface, how to segment a network into security zones, how firewalls and ACLs enforce policy, the difference between detecting and preventing attacks (IDS vs IPS), how VPNs and TLS protect communication, and how zero trust changes the classic perimeter assumption.\n\n' +
            'The running example is an enterprise network divided into zones. Everything here is conceptual and defensive: you will reason about policies and detections, never about attacking a real network.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Network Security Protects',
          items: [
            {
              kind: 'bullets',
              items: [
                'Confidentiality: only authorized parties can read traffic (encryption, segmentation).',
                'Integrity: traffic is not modified in transit (TLS, checksums, detection).',
                'Availability: services remain reachable (redundancy, DDoS mitigation).',
                'Accountability: traffic and changes are logged and attributable.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Network Attack Surface',
          items: [
            {
              kind: 'paragraph',
              text: 'Every reachable service, port, and protocol is a potential way in. Reducing attack surface means closing what is not needed.',
            },
            {
              kind: 'bullets',
              items: [
                'Open ports and unnecessary services.',
                'Plaintext protocols that leak credentials.',
                'Trust-based protocols such as ARP and DNS.',
                'Weak or default device credentials (routers, switches, firewalls).',
                'Unpatched network devices and firmware.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Defense in Depth and Security Zones',
          items: [
            {
              kind: 'paragraph',
              text: 'A single firewall is a single point of failure. Defense in depth layers multiple controls so that if one fails, others still protect. Zones group systems by trust level and enforce policy at the boundaries between them.',
            },
            {
              kind: 'flow',
              steps: [
                'Internet',
                'Edge Firewall',
                'DMZ',
                'Internal Firewall',
                'Application Network',
                'Database Network',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The DMZ hosts internet-facing services (web servers). Even if a DMZ host is compromised, the internal firewall still separates it from the application and database networks.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Segmentation',
          items: [
            {
              kind: 'paragraph',
              text: 'Segmentation divides a network into smaller zones (VLANs, subnets, or micro-segments) so a breach in one zone cannot spread freely to another.',
            },
            {
              kind: 'table',
              headers: ['Benefit', 'How it helps'],
              rows: [
                [
                  'Blast-radius reduction',
                  'Limits how far a compromise can move',
                ],
                [
                  'Least privilege',
                  'Only required cross-zone traffic is allowed',
                ],
                ['Monitoring', 'Zone boundaries are natural inspection points'],
                ['Compliance', 'Keeps sensitive data in isolated segments'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Firewalls',
          items: [
            {
              kind: 'paragraph',
              text: 'A firewall enforces a policy about which traffic may pass a boundary, based on rules that match addresses, ports, and protocols.',
            },
            {
              kind: 'bullets',
              items: [
                'Stateful: tracks the state of connections and allows return traffic for established connections.',
                'Stateless: evaluates each packet independently with no memory of prior packets.',
                'Application (proxy/WAF): inspects traffic at the application layer, not just headers.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Packet Filtering and ACLs',
          items: [
            {
              kind: 'paragraph',
              text: 'Packet filtering checks each packet against rules. An Access Control List (ACL) is an ordered list of rules applied top to bottom; the first match wins.',
            },
            {
              kind: 'table',
              headers: ['Field', 'Example', 'Meaning'],
              rows: [
                ['Source address', '10.0.1.0/24', 'Traffic from this subnet'],
                [
                  'Destination address',
                  '10.0.2.10',
                  'A specific internal host',
                ],
                ['Protocol / port', 'TCP 443', 'HTTPS only'],
                ['Action', 'PERMIT / DENY', 'Allow or drop'],
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Conceptual firewall rules',
          language: 'text',
          code:
            '# Concept: allow web clients to reach the DMZ web server over HTTPS\n' +
            'PERMIT tcp from ANY to 203.0.113.10 port 443\n' +
            '\n' +
            '# Concept: allow the DMZ web server to reach the internal DB only\n' +
            'PERMIT tcp from 203.0.113.10 to 10.0.2.20 port 5432\n' +
            '\n' +
            '# Concept: default deny — block everything else\n' +
            'DENY all',
          note: 'These are illustrative policy statements, not a real vendor syntax. Real rules follow the same shape: match, then permit or deny, with a default deny at the end.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'NAT and Its Security Implications',
          items: [
            {
              kind: 'bullets',
              items: [
                'NAT hides internal private addresses behind one public address.',
                'It is not a firewall by itself; it only rewrites addresses.',
                'It limits inbound connections by default, which adds a thin layer of obscurity.',
                'It can complicate logging and attribution if not correlated with firewall logs.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IDS vs IPS',
          items: [
            {
              kind: 'paragraph',
              text: 'An Intrusion Detection System (IDS) detects and alerts; an Intrusion Prevention System (IPS) detects and blocks. IPS sits inline in the traffic path, so a mistake can break availability, while IDS sits out of band and only observes.',
            },
            {
              kind: 'table',
              headers: ['', 'IDS', 'IPS'],
              rows: [
                [
                  'Placement',
                  'Out of band (copy of traffic)',
                  'Inline (in the path)',
                ],
                ['Action', 'Detects and alerts', 'Detects and blocks/prevents'],
                [
                  'Risk',
                  'Low — cannot block',
                  'Higher — can drop legitimate traffic',
                ],
                ['Use', 'Visibility, forensics', 'Automated prevention'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Signature vs Anomaly Detection',
          items: [
            {
              kind: 'table',
              headers: ['Approach', 'How it works', 'Strength', 'Weakness'],
              rows: [
                [
                  'Signature',
                  'Matches known attack patterns',
                  'Low false positives for known attacks',
                  'Misses unknown/new attacks',
                ],
                [
                  'Anomaly',
                  'Flags deviations from a learned baseline',
                  'Can find novel attacks',
                  'More false positives; needs tuning',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'VPNs',
          items: [
            {
              kind: 'paragraph',
              text: 'A Virtual Private Network creates an encrypted tunnel across an untrusted network so traffic is confidential and tamper-evident.',
            },
            {
              kind: 'table',
              headers: ['', 'Remote Access VPN', 'Site-to-Site VPN'],
              rows: [
                [
                  'Who connects',
                  'Individual users / devices',
                  'Whole networks / offices',
                ],
                ['Scale', 'Per user', 'Permanent tunnel between sites'],
                [
                  'Typical use',
                  'Remote workers',
                  'Connecting branch offices or clouds',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'TLS and Secure Network Communication',
          items: [
            {
              kind: 'bullets',
              items: [
                'TLS provides confidentiality, integrity, and server (and optionally client) authentication.',
                'It protects application traffic such as HTTPS, not just VPNs.',
                'Modern deployments use TLS 1.2/1.3; older versions are disabled.',
                'TLS protects data in transit; it does not protect a compromised endpoint.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Monitoring and Logging',
          items: [
            {
              kind: 'bullets',
              items: [
                'Collect flow data and device logs centrally.',
                'Correlate firewall, IDS/IPS, and endpoint logs.',
                'Watch for anomalies: unexpected hosts, port scans, large egress transfers.',
                'Baseline normal traffic so deviations stand out.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Hardening',
          items: [
            {
              kind: 'steps',
              items: [
                'Inventory devices, ports, and services.',
                'Disable unused services and ports.',
                'Segment the network into zones.',
                'Apply least-privilege firewall rules with a default deny.',
                'Encrypt with TLS/VPN and disable plaintext protocols.',
                'Patch devices and firmware; change default credentials.',
                'Centralize and monitor logs.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Zero Trust Networking',
          items: [
            {
              kind: 'bullets',
              items: [
                'Assume the network is hostile; do not trust something just because it is "inside".',
                'Authenticate and authorize every request, every time.',
                'Grant least-privilege access per session, not broad network access.',
                'Segment and encrypt so lateral movement is difficult.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Network Attacks (Defensive View)',
          items: [
            {
              kind: 'table',
              headers: ['Attack', 'Concept', 'Defense'],
              rows: [
                [
                  'DoS / DDoS',
                  'Overwhelm a service with traffic',
                  'Rate limiting, redundancy, scrubbing',
                ],
                [
                  'ARP spoofing',
                  'Attacker answers ARP with their MAC',
                  'Monitoring, static entries, network segmentation',
                ],
                [
                  'DNS attacks',
                  'Poisoning or hijacking name resolution',
                  'DNSSEC, monitoring, trusted resolvers',
                ],
                [
                  'Man-in-the-middle',
                  'Intercepting traffic in transit',
                  'TLS, mutual authentication, VPNs',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Detection vs prevention',
          text: 'IDS detects and alerts; IPS detects and blocks. Detection is safe to deploy broadly; prevention sits inline and can break availability, so it needs careful tuning and a fallback.',
          variant: 'info',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Reasoning about a firewall rule',
              description:
                'A web server in the DMZ needs to reach the database, but the internet must not.',
              language: 'text',
              code:
                'Internet ──X──> Database  (denied)\n' +
                'Web (DMZ) ──OK──> Database (permit tcp 10.0.2.20:5432)\n' +
                'Internet ──OK──> Web (DMZ) (permit tcp 203.0.113.10:443)',
              output:
                '(the database is reachable only from the application tier)',
            },
            {
              title: 'Where IDS vs IPS belongs',
              description:
                'You want visibility on the whole network but only want to block at the edge.',
              language: 'text',
              code:
                'Edge:  IPS (block known attacks before they reach the inside)\n' +
                'Core:  IDS (detect and alert on traffic already inside)\n' +
                'DMZ:  IDS (watch for lateral movement)',
              output: '(prevent at the perimeter, detect deeper inside)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Design a segmented network for a company with a public web application, an internal API, a database, and employee workstations. Specify: (1) the security zones and what lives in each, (2) the firewall rules between zones using least privilege with a default deny, (3) where you would place an IDS versus an IPS and why, and (4) how you would encrypt traffic in each segment. Then describe how a compromise of the public web server is contained by your design.',
          starterCode:
            '# 1. zones and hosts\n' +
            '# 2. firewall rules (source, destination, port, action)\n' +
            '# 3. IDS vs IPS placement\n' +
            '# 4. encryption per segment + containment reasoning',
          language: 'text',
          hints: [
            'Use a DMZ for the public web tier.',
            'The database should be reachable only from the application tier.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the key difference between an IDS and an IPS?',
              options: [
                {
                  text: 'IDS detects/alerts; IPS detects and blocks',
                  isCorrect: true,
                },
                { text: 'IPS only logs; IDS only blocks', isCorrect: false },
                { text: 'They are the same thing', isCorrect: false },
                { text: 'IDS is always inline', isCorrect: false },
              ],
              explanation:
                'IDS observes and alerts out of band; IPS sits inline and can block.',
            },
            {
              question: 'Why does network segmentation reduce risk?',
              options: [
                {
                  text: 'It limits how far a compromise can spread (blast radius)',
                  isCorrect: true,
                },
                {
                  text: 'It encrypts all traffic automatically',
                  isCorrect: false,
                },
                { text: 'It removes the need for firewalls', isCorrect: false },
                { text: 'It makes NAT unnecessary', isCorrect: false },
              ],
              explanation:
                'Segmentation contains a breach within a zone rather than letting it move laterally.',
            },
            {
              question:
                'Which approach is more likely to detect a brand-new, never-before-seen attack?',
              options: [
                { text: 'Signature-based detection', isCorrect: false },
                { text: 'Anomaly-based detection', isCorrect: true },
                { text: 'Stateless packet filtering', isCorrect: false },
                { text: 'NAT', isCorrect: false },
              ],
              explanation:
                'Anomaly detection flags deviations from normal behavior, so it can surface novel attacks that have no signature yet.',
            },
            {
              question: 'What is the main security limitation of NAT?',
              options: [
                {
                  text: 'It is not a firewall and does not enforce policy',
                  isCorrect: true,
                },
                { text: 'It encrypts traffic', isCorrect: false },
                { text: 'It blocks all outbound traffic', isCorrect: false },
                { text: 'It cannot hide private addresses', isCorrect: false },
              ],
              explanation:
                'NAT rewrites addresses but does not by itself inspect or control traffic the way a firewall does.',
            },
            {
              question: 'A core idea of zero trust networking is to...',
              options: [
                {
                  text: 'Trust everything inside the perimeter',
                  isCorrect: false,
                },
                {
                  text: 'Authenticate and authorize every request regardless of location',
                  isCorrect: true,
                },
                { text: 'Rely on a single strong firewall', isCorrect: false },
                { text: 'Disable all encryption', isCorrect: false },
              ],
              explanation:
                'Zero trust removes the assumption that "inside" means safe.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Network security enforces confidentiality, integrity, and availability for traffic.',
            'Segment networks into zones to contain breaches and apply least privilege.',
            'Firewalls enforce policy with ordered rules; default deny is essential.',
            'IDS detects/alerts; IPS detects and blocks — prevention carries more risk.',
            'TLS and VPNs protect data in transit; monitoring makes anomalies visible.',
            'Zero trust removes the implicit trust of the network perimeter.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 7. Cloud Security
  // =====================================================================
  {
    nodeId: '6a3f94e1-a6ef-4195-b915-ed779733a7b9',
    nodeTitle: 'Cloud Security',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Cloud security is the discipline of protecting workloads, data, and identities that live in a provider\u2019s environment. The single most important idea is the Shared Responsibility Model: the cloud provider secures the cloud itself, while the customer secures what they put in it.\n\n' +
            'Most cloud breaches are not exotic exploits — they are misconfigurations, over-broad permissions, and leaked credentials. This lesson teaches you to think about identity as the new perimeter, how to apply least privilege to cloud IAM, how to protect storage and networks, and how to detect problems through logging and monitoring.\n\n' +
            'The examples use AWS-style concepts (IAM, S3 buckets, security groups) because those patterns generalize across providers. Everything is hypothetical and defensive.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Shared Responsibility Model',
          items: [
            {
              kind: 'table',
              headers: ['', 'Cloud provider', 'Customer'],
              rows: [
                ['Physical security', 'Data centers, hardware', '—'],
                ['Hypervisor / host OS', 'Patch and secure', '—'],
                ['Service availability', 'Uptime of the service', '—'],
                ['Data and access', '—', 'Classify and protect data'],
                [
                  'Identity and permissions',
                  '—',
                  'Configure IAM and least privilege',
                ],
                ['Configuration', '—', 'Security groups, buckets, encryption'],
                ['Application security', '—', 'Secure the code you deploy'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Responsibility Across IaaS, PaaS, SaaS',
          items: [
            {
              kind: 'table',
              headers: ['Model', 'Provider manages', 'Customer manages'],
              rows: [
                [
                  'IaaS',
                  'Physical, hypervisor, network fabric',
                  'OS, runtime, apps, data, config',
                ],
                [
                  'PaaS',
                  'Everything up to the runtime platform',
                  'Your application and its data',
                ],
                [
                  'SaaS',
                  'The entire application',
                  'Your data, users, and access settings',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'As you move from IaaS to PaaS to SaaS, the provider takes on more responsibility, but the customer always owns their data, identities, and access controls.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Cloud Attack Surface',
          items: [
            {
              kind: 'bullets',
              items: [
                'Publicly exposed storage buckets and databases.',
                'Overly broad IAM policies and root-level access.',
                'Leaked API access keys in code or public repos.',
                'Unrestricted security groups and open ports.',
                'Disabled or under-collected logging and audit trails.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Identity as the Security Perimeter',
          items: [
            {
              kind: 'paragraph',
              text: 'In the cloud there is no physical network perimeter. Identity becomes the primary control: who (or what) can call which API on which resource.',
            },
            {
              kind: 'bullets',
              items: [
                'Every action is an authenticated API call.',
                'Principals are users, groups, and service accounts.',
                'Permissions are granted through policies attached to principals or resources.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IAM, Roles, and Policies',
          items: [
            {
              kind: 'bullets',
              items: [
                'Role: a set of permissions that can be assumed (not tied to one user).',
                'Policy: a JSON document stating Allow/Deny for actions on resources.',
                'Group: a collection of users sharing the same roles.',
                'Least privilege: grant only the actions needed for the task.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Service Accounts, Access Keys, and Secrets',
          items: [
            {
              kind: 'bullets',
              items: [
                'Service accounts are identities for applications and automation, not humans.',
                'Access keys are long-lived credentials that must be rotated and never embedded in code.',
                'Secrets (passwords, tokens, keys) belong in a secrets manager, not in source control.',
                'Prefer short-lived, automatically-rotated credentials where possible.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'A leaked access key with broad permissions is one of the most common root causes of cloud compromise. Treat access keys like passwords.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Encryption at Rest and in Transit',
          items: [
            {
              kind: 'bullets',
              items: [
                'Encryption at rest protects stored data (databases, buckets, disks).',
                'Encryption in transit protects data as it moves (TLS between services).',
                'Manage keys carefully; customer-managed keys offer more control than provider-managed keys.',
                'Encryption protects confidentiality but does not fix a broken access policy.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Controls: Security Groups',
          items: [
            {
              kind: 'paragraph',
              text: 'A security group is a stateful virtual firewall for a resource (such as an instance or function). Rules are allow-based with an implicit deny.',
            },
            {
              kind: 'bullets',
              items: [
                'Restrict inbound to only the ports and sources you need.',
                'Avoid rules that allow traffic from 0.0.0.0/0 (the whole internet) to sensitive ports.',
                'Segment tiers so the database group only accepts traffic from the application group.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Storage Security and Public Exposure',
          items: [
            {
              kind: 'bullets',
              items: [
                'Block public access to storage by default.',
                'Use policies that deny public read/write unless explicitly required.',
                'Enable versioning and backups for resilience.',
                'Encrypt objects and restrict who can manage keys.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'A publicly readable storage bucket can leak sensitive data with a single configuration mistake. Default to private.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Logging, Monitoring, and Audit Trails',
          items: [
            {
              kind: 'bullets',
              items: [
                'Enable audit logging for API calls (who did what, when, from where).',
                'Centralize logs and alert on anomalies.',
                'Monitor for unauthorized API calls, unusual regions, and policy changes.',
                'Retain logs long enough for incident response and compliance.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Misconfiguration Is the Top Cloud Risk',
          items: [
            {
              kind: 'bullets',
              items: [
                'Public storage buckets or databases.',
                'Overly broad IAM policies (e.g., wildcard actions on everything).',
                'Exposed credentials in code or logs.',
                'Unrestricted security groups.',
                'Disabled logging and monitoring.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Most cloud incidents are caused by misconfiguration, not by sophisticated exploits. Configuration review is a security control, not an afterthought.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Infrastructure as Code and Container Security',
          items: [
            {
              kind: 'bullets',
              items: [
                'Define infrastructure as code (IaC) so it is versioned and reviewable.',
                'Scan IaC and container images for vulnerabilities and misconfigurations before deploy.',
                'Run containers as non-root with minimal capabilities.',
                'Sign and pin container images; avoid "latest" tags.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Multi-Account Architecture and Zero Trust',
          items: [
            {
              kind: 'bullets',
              items: [
                'Separate production from development in different accounts/projects.',
                'Use an organization hierarchy to apply guardrails centrally.',
                'Apply zero trust: verify every request, least privilege by default.',
                'Isolate workloads so a single account compromise does not expose everything.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cloud Incident Response',
          items: [
            {
              kind: 'steps',
              items: [
                'Detect via monitoring and alerts.',
                'Revoke compromised credentials immediately.',
                'Contain by tightening the affected security group or policy.',
                'Investigate using audit logs and snapshots.',
                'Remediate the misconfiguration and rotate secrets.',
                'Post-mortem and harden to prevent recurrence.',
              ],
            },
          ],
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'An overly broad IAM policy',
              description:
                'A policy with a wildcard action on all resources violates least privilege.',
              language: 'text',
              code:
                'Vulnerable policy concept:\n' +
                '  Action: *\n' +
                '  Resource: *\n' +
                '  Effect: Allow\n' +
                '\n' +
                'Least-privilege version:\n' +
                '  Action: s3:GetObject\n' +
                '  Resource: arn:...:bucket/app-assets/*\n' +
                '  Effect: Allow',
              output: '(the second policy grants only what is needed)',
            },
            {
              title: 'A public storage bucket',
              description:
                'A bucket holding customer data was left publicly readable.',
              language: 'text',
              code:
                'Public read: ON   → anyone can list and download objects\n' +
                'Expected:   OFF  → only the application role can read/write',
              output: '(fix: block public access and scope to the app role)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are reviewing a hypothetical AWS-style environment. Find and explain the risks in each item: (1) a storage bucket with public read enabled, (2) an IAM policy granting s3:* on * to a development service account, (3) an access key committed to a public repository, (4) a security group allowing SSH from 0.0.0.0/0, and (5) cloud audit logging disabled. For each, state whether the provider or the customer is responsible, and describe the specific fix you would apply.',
          starterCode:
            '# 1. public bucket → responsibility + fix\n' +
            '# 2. broad IAM → responsibility + fix\n' +
            '# 3. leaked key → responsibility + fix\n' +
            '# 4. open security group → responsibility + fix\n' +
            '# 5. disabled logging → responsibility + fix',
          language: 'text',
          hints: [
            'The customer is responsible for configuration, identity, and data.',
            'Least privilege and default-deny are the fixes for most of these.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'In the shared responsibility model, who is responsible for a misconfigured public storage bucket?',
              options: [
                { text: 'The cloud provider', isCorrect: false },
                { text: 'The customer', isCorrect: true },
                { text: 'The bucket vendor', isCorrect: false },
                { text: 'No one', isCorrect: false },
              ],
              explanation:
                'The provider secures the service; the customer is responsible for how they configure and use it.',
            },
            {
              question:
                'As you move from IaaS to PaaS to SaaS, the customer\u2019s responsibility...',
              options: [
                { text: 'Increases', isCorrect: false },
                {
                  text: 'Decreases (but data and access always remain theirs)',
                  isCorrect: true,
                },
                { text: 'Disappears entirely', isCorrect: false },
                { text: 'Stays exactly the same', isCorrect: false },
              ],
              explanation:
                'The provider manages more of the stack, but the customer always owns data, identity, and access.',
            },
            {
              question:
                'Why is identity called the security perimeter in the cloud?',
              options: [
                {
                  text: 'There is no physical network perimeter, so identity controls access',
                  isCorrect: true,
                },
                { text: 'Cloud has no encryption', isCorrect: false },
                {
                  text: 'Firewalls do not exist in the cloud',
                  isCorrect: false,
                },
                { text: 'Passwords are never needed', isCorrect: false },
              ],
              explanation:
                'Every cloud action is an authenticated API call, so identity and permissions become the primary boundary.',
            },
            {
              question:
                'Which is the most common root cause of cloud security incidents?',
              options: [
                { text: 'Misconfiguration', isCorrect: true },
                { text: 'Zero-day exploits', isCorrect: false },
                { text: 'Physical break-ins', isCorrect: false },
                { text: 'Quantum attacks', isCorrect: false },
              ],
              explanation:
                'Misconfigurations such as public buckets and broad IAM cause most incidents.',
            },
            {
              question: 'What is a security group?',
              options: [
                {
                  text: 'A stateful virtual firewall for a resource',
                  isCorrect: true,
                },
                { text: 'A group of users', isCorrect: false },
                { text: 'A type of encryption key', isCorrect: false },
                { text: 'An audit log', isCorrect: false },
              ],
              explanation:
                'Security groups control inbound/outbound traffic to cloud resources.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The shared responsibility model: provider secures the cloud, customer secures what is in it.',
            'Identity is the cloud perimeter; least privilege is the core control.',
            'Most cloud incidents are misconfigurations, not exploits.',
            'Default storage to private and restrict security groups.',
            'Encrypt at rest and in transit; manage secrets in a secrets manager.',
            'Log, monitor, and audit so problems are detected quickly.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 8. Web Application Security
  // =====================================================================
  {
    nodeId: '9859e4c7-dd38-4d30-91ff-4263370646aa',
    nodeTitle: 'Web Application Security',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Web applications are the most exposed software most organizations run: anyone on the internet can reach them. Web application security is about controlling that exposure — validating and encoding every input, protecting sessions and identities, and enforcing authorization on every request.\n\n' +
            'This lesson covers the OWASP-style fundamentals: the attack surface, authentication and authorization, the major vulnerability classes (XSS, CSRF, SQL injection, IDOR, broken access control, misconfiguration, file upload, path traversal, SSRF), and the defensive controls that stop them.\n\n' +
            'For each major vulnerability you will learn what it is, why it happens, what an attacker aims to achieve, a deliberately simplified toy example, the impact, and how to prevent and detect it. Everything is educational, local, and contained.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Web Application Attack Surface',
          items: [
            {
              kind: 'bullets',
              items: [
                'Every input: forms, URLs, headers, cookies, uploaded files.',
                'Authentication and session management.',
                'Authorization and access-control checks.',
                'Server configuration and exposed services.',
                'APIs and third-party integrations.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTTP, Cookies, and Sessions',
          items: [
            {
              kind: 'paragraph',
              text: 'HTTP is stateless: each request is independent. Cookies and session tokens let a server remember a user across requests. That state is valuable to attackers, so it must be protected.',
            },
            {
              kind: 'table',
              headers: ['Concept', 'Role', 'Risk if mishandled'],
              rows: [
                [
                  'Cookie',
                  'Stores state in the browser',
                  'Session hijacking if stolen or predictable',
                ],
                [
                  'Session token',
                  'Identifies the logged-in user',
                  'Account takeover if leaked',
                ],
                [
                  'Request/response',
                  'The channel of interaction',
                  'Tampering or injection via untrusted input',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Authentication and Authorization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Authentication proves who you are; authorization decides what you may do.',
                'Enforce authorization on the server for every request, not just in the UI.',
                'Never rely on client-side checks alone.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Input Validation and Output Encoding',
          items: [
            {
              kind: 'bullets',
              items: [
                'Validate input: accept only what is expected (allowlists over denylists).',
                'Encode output: render untrusted data as data, never as code or markup.',
                'Context matters: encode differently for HTML, JavaScript, and URLs.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Validation and encoding are two different controls. Validate on the way in; encode on the way out. Skipping either opens the door to injection.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cross-Site Scripting (XSS)',
          items: [
            {
              kind: 'paragraph',
              text: 'XSS occurs when an application renders untrusted input as HTML or JavaScript, letting an attacker run script in a victim\u2019s browser.',
            },
            {
              kind: 'table',
              headers: ['Type', 'Where the payload lives', 'Typical trigger'],
              rows: [
                [
                  'Stored XSS',
                  'Persisted on the server (a comment, a profile)',
                  'Every visitor who views it',
                ],
                [
                  'Reflected XSS',
                  'Echoed from the request (a search term)',
                  'A crafted link the victim clicks',
                ],
                [
                  'DOM XSS',
                  'Processed by client-side JavaScript',
                  'Manipulating the page state',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'XSS: What, Why, Impact, Prevention',
          items: [
            {
              kind: 'bullets',
              items: [
                'What: attacker-supplied script executes in a victim\u2019s browser.',
                'Why: untrusted data is rendered without encoding.',
                'Impact: session theft, defacement, phishing, keylogging.',
                'Prevent: encode output in the correct context; validate input.',
                'Detect: review how user data reaches the page; use a Content Security Policy.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cross-Site Request Forgery (CSRF)',
          items: [
            {
              kind: 'paragraph',
              text: 'CSRF tricks an authenticated user\u2019s browser into making an unintended request to a site where they are logged in, riding on their existing session.',
            },
            {
              kind: 'bullets',
              items: [
                'Why: the browser automatically attaches the session cookie.',
                'Impact: unwanted actions such as changing a password or transferring money.',
                'Prevent: anti-CSRF tokens, SameSite cookies, and verifying the request origin.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SQL Injection',
          items: [
            {
              kind: 'paragraph',
              text: 'SQL injection occurs when user input is concatenated into a SQL query, letting an attacker alter the query\u2019s meaning.',
            },
            {
              kind: 'code',
              language: 'python',
              code:
                '# Vulnerable: string formatting builds the query\n' +
                "name = request.get('name')\n" +
                'query = "SELECT * FROM users WHERE name = \'" + name + "\'"\n' +
                '\n' +
                "# If name is:  ' OR '1'='1\n" +
                '# the query becomes:\n' +
                "#   SELECT * FROM users WHERE name = '' OR '1'='1'",
            },
            {
              kind: 'bullets',
              items: [
                'Impact: data theft, modification, or deletion.',
                'Prevent: parameterized queries / prepared statements.',
                'Detect: code review and web application scanning.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IDOR / Broken Object-Level Authorization',
          items: [
            {
              kind: 'bullets',
              items: [
                'IDOR: a resource is referenced by a predictable identifier with no check that the requester may access it.',
                'Why: authorization is checked only in the UI, not on the server.',
                'Impact: reading or modifying other users\u2019 data.',
                'Prevent: verify object ownership and authorization on every request.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Broken Access Control',
          items: [
            {
              kind: 'bullets',
              items: [
                'Missing server-side checks on sensitive actions.',
                'Exposed admin endpoints reachable by normal users.',
                'Client-side hiding of controls instead of server enforcement.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security Misconfiguration',
          items: [
            {
              kind: 'bullets',
              items: [
                'Default credentials and debug modes left enabled.',
                'Unnecessary features, ports, or directories exposed.',
                'Missing security headers or overly permissive CORS.',
                'Error pages that leak stack traces and internals.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'File Upload and Path Traversal',
          items: [
            {
              kind: 'bullets',
              items: [
                'File upload: validate type and content; never serve executable uploads from the same origin.',
                'Path traversal: user input such as ../ must not control filesystem paths.',
                'Prevent: allowlist extensions, rename files, and constrain paths.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SSRF (Server-Side Request Forgery)',
          items: [
            {
              kind: 'paragraph',
              text: 'SSRF makes the server itself issue requests to an attacker-chosen URL. Because the request comes from the trusted server, it can reach internal systems such as metadata endpoints.',
            },
            {
              kind: 'bullets',
              items: [
                'Why: the server fetches a user-supplied URL without restriction.',
                'Impact: reaching internal services or cloud metadata.',
                'Prevent: allowlist destinations, block internal ranges, and validate URLs.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Session Security and Password Handling',
          items: [
            {
              kind: 'bullets',
              items: [
                'Issue strong, random session tokens; rotate on login.',
                'Set cookies with HttpOnly, Secure, and SameSite.',
                'Hash passwords with a slow, salted algorithm (bcrypt/Argon2).',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'HttpOnly cookies cannot be read by JavaScript, which blocks a common XSS escalation path to session theft.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security Headers, CORS, and HTTPS',
          items: [
            {
              kind: 'table',
              headers: ['Control', 'Purpose'],
              rows: [
                ['HTTPS (TLS)', 'Confidentiality and integrity in transit'],
                [
                  'Content-Security-Policy',
                  'Restricts what scripts and resources may load',
                ],
                ['Strict-Transport-Security', 'Forces HTTPS'],
                ['CORS policy', 'Controls which origins may read responses'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Secure API Design, Rate Limiting, and Monitoring',
          items: [
            {
              kind: 'bullets',
              items: [
                'Validate and authorize on every endpoint.',
                'Rate-limit to blunt brute force and abuse.',
                'Log and monitor authentication failures and anomalous activity.',
                'Return generic errors to users; log details server-side.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vulnerability to Impact: The Full Chain',
          items: [
            {
              kind: 'flow',
              steps: [
                'Vulnerability',
                'Exploit',
                'Impact',
                'Mitigation',
                'Detection',
              ],
            },
            {
              kind: 'paragraph',
              text: 'For every finding, reason about the whole chain: the weakness, how it is exploited, the harm it causes, how to prevent it, and how to detect it.',
            },
          ],
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A toy reflected XSS',
              description:
                'A search page echoes the query into HTML without encoding.',
              language: 'text',
              code:
                'Input:   <script>alert(1)</script>\n' +
                'Vulnerable output:\n' +
                '  You searched for: <script>alert(1)</script>\n' +
                'Safe output (encoded):\n' +
                '  You searched for: &lt;script&gt;alert(1)&lt;/script&gt;',
              output: '(encoding renders the input as text, not script)',
            },
            {
              title: 'A toy SQL injection vs parameterized query',
              description: 'The same login query written unsafely and safely.',
              language: 'python',
              code:
                'unsafe = "SELECT * FROM users WHERE name = \'" + name + "\'"\n' +
                'safe  = "SELECT * FROM users WHERE name = %s"  # bound with (name,)',
              output:
                '(the parameterized query treats input as data, never as SQL)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def build_query_unsafe(name):\n' +
            '    return "SELECT * FROM users WHERE name = \'" + name + "\'"\n' +
            '\n' +
            'def build_query_safe(name):\n' +
            '    # A real app binds the value with the driver; here we show the idea.\n' +
            '    return "SELECT * FROM users WHERE name = %s", (name,)\n' +
            '\n' +
            "attack = \"alice' OR '1'='1\"\n" +
            'print("UNSAFE:")\n' +
            'print(build_query_unsafe(attack))\n' +
            'print()\n' +
            'print("SAFE:")\n' +
            'print(build_query_safe("alice"))',
          instructions:
            'Run it and compare the two results. Notice how the unsafe version lets the input change the meaning of the query, while the safe version keeps the value separate from the SQL. This is why parameterized queries stop SQL injection.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'For each scenario, identify the vulnerability class (XSS, CSRF, SQLi, IDOR, or SSRF) and state the fix: (1) a search box echoes its input directly into the page, (2) a URL like /invoice/123 lets any logged-in user view any invoice number, (3) a profile image URL is fetched server-side from user input, (4) a state-changing endpoint has no token and accepts any same-site request, and (5) a login form concatenates a username into a SQL string. Then write the one-sentence prevention for each.',
          starterCode:
            '# 1. vulnerability + fix\n' +
            '# 2. vulnerability + fix\n' +
            '# 3. vulnerability + fix\n' +
            '# 4. vulnerability + fix\n' +
            '# 5. vulnerability + fix',
          language: 'text',
          hints: [
            'Authorization (IDOR) is about ownership, not authentication.',
            'SSRF happens when the server fetches an attacker-chosen URL.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the difference between stored and reflected XSS?',
              options: [
                {
                  text: 'Stored persists on the server; reflected echoes a request',
                  isCorrect: true,
                },
                {
                  text: 'Reflected persists; stored does not',
                  isCorrect: false,
                },
                { text: 'They are identical', isCorrect: false },
                { text: 'Stored only affects the attacker', isCorrect: false },
              ],
              explanation:
                'Stored XSS is saved and served to all viewers; reflected XSS comes back from the current request.',
            },
            {
              question: 'Which control most directly prevents SQL injection?',
              options: [
                { text: 'Parameterized queries', isCorrect: true },
                { text: 'A longer password', isCorrect: false },
                { text: 'Disabling HTTPS', isCorrect: false },
                { text: 'Using a bigger database', isCorrect: false },
              ],
              explanation:
                'Parameterized queries keep user input separate from SQL structure.',
            },
            {
              question:
                'An attacker changes /invoice/123 to /invoice/456 and sees another user\u2019s invoice. This is...',
              options: [
                {
                  text: 'IDOR / broken object-level authorization',
                  isCorrect: true,
                },
                { text: 'CSRF', isCorrect: false },
                { text: 'XSS', isCorrect: false },
                { text: 'SQL injection', isCorrect: false },
              ],
              explanation:
                'A predictable identifier with no ownership check is the definition of IDOR.',
            },
            {
              question: 'Why should session cookies use the HttpOnly flag?',
              options: [
                {
                  text: 'It prevents JavaScript from reading the cookie, blocking session theft via XSS',
                  isCorrect: true,
                },
                { text: 'It encrypts the cookie', isCorrect: false },
                { text: 'It makes the cookie never expire', isCorrect: false },
                {
                  text: 'It stores the password in the cookie',
                  isCorrect: false,
                },
              ],
              explanation:
                'HttpOnly blocks client-side script access to the session token.',
            },
            {
              question: 'What does an anti-CSRF token protect against?',
              options: [
                {
                  text: 'An attacker forcing a victim\u2019s browser to make unintended requests',
                  isCorrect: true,
                },
                { text: 'SQL injection', isCorrect: false },
                { text: 'Password guessing', isCorrect: false },
                { text: 'Denial of service', isCorrect: false },
              ],
              explanation:
                'The token proves a request was intentionally initiated by the user, not forged.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Validate input on the way in and encode output on the way out.',
            'XSS, CSRF, SQLi, IDOR, and SSRF share one cause: trusting untrusted data.',
            'Enforce authorization on the server for every request.',
            'Use parameterized queries; hash passwords with bcrypt/Argon2.',
            'Protect sessions with HttpOnly/Secure/SameSite cookies.',
            'Reason in full chains: vulnerability → exploit → impact → mitigation → detection.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 9. Secure Coding & SAST
  // =====================================================================
  {
    nodeId: '997b723b-b82f-44e5-a898-d34308750d4e',
    nodeTitle: 'Secure Coding & SAST',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Secure coding is writing software so that it is hard to misuse: validating input, encoding output, parameterizing queries, checking authorization, and failing safely. Static Application Security Testing (SAST) and related tooling catch these mistakes early, in the development workflow, before they reach production.\n\n' +
            'This lesson covers the principles of security by design, the specific coding patterns that prevent common vulnerabilities, and the tooling — SAST, DAST, and SCA — that automates finding them, plus how false positives and false negatives shape remediation.\n\n' +
            'The code examples are deliberately vulnerable then fixed, using small, self-contained Python so you can see the exact difference.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security by Design',
          items: [
            {
              kind: 'bullets',
              items: [
                'Treat security as a requirement from the start, not a review at the end.',
                'Model threats during design so controls are built in.',
                'Prefer secure defaults over optional hardening.',
                'Assume every input is hostile and every boundary is crossed.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Input Validation and Output Encoding',
          items: [
            {
              kind: 'bullets',
              items: [
                'Validate with allowlists: accept only what you expect.',
                'Validate at trust boundaries (every external input).',
                'Encode output for its context to prevent injection.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Parameterized Queries',
          items: [
            {
              kind: 'code',
              language: 'python',
              code:
                '# Vulnerable: string concatenation\n' +
                'query = "SELECT * FROM users WHERE name = \'" + name + "\'"\n' +
                '\n' +
                '# Secure: parameterized / prepared statement\n' +
                'query = "SELECT * FROM users WHERE name = %s"\n' +
                'cursor.execute(query, (name,))',
            },
            {
              kind: 'paragraph',
              text: 'Parameterized queries separate code from data so the database never interprets input as SQL.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Authentication and Authorization Checks',
          items: [
            {
              kind: 'bullets',
              items: [
                'Store only hashed passwords with a slow, salted algorithm.',
                'Check authorization on the server for every sensitive operation.',
                'Do not trust client-side checks or hidden fields.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Least Privilege and Secrets Management',
          items: [
            {
              kind: 'bullets',
              items: [
                'Run with the least privilege needed; avoid root/admin.',
                'Store secrets in a secrets manager, never in code or config committed to source control.',
                'Rotate credentials and use short-lived tokens where possible.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Secrets in source control are effectively public. Once committed, treat them as compromised and rotate immediately.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Error Handling and Logging',
          items: [
            {
              kind: 'bullets',
              items: [
                'Return generic errors to users; log details server-side.',
                'Never leak stack traces, queries, or secrets in errors.',
                'Log security-relevant events but never log secrets.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dependency Security (SCA)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Software Composition Analysis scans third-party dependencies for known vulnerabilities.',
                'Pin versions and update regularly.',
                'Review the supply chain: only pull from trusted sources.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Secure Defaults and Fail-Safe Behavior',
          items: [
            {
              kind: 'bullets',
              items: [
                'Default to deny; require an explicit allow.',
                'Fail closed: on error, deny rather than allow.',
                'Avoid insecure defaults such as weak crypto or open permissions.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Defensive Programming',
          items: [
            {
              kind: 'bullets',
              items: [
                'Check preconditions and reject invalid state early.',
                'Handle unexpected values gracefully rather than crashing into an insecure state.',
                'Write small, reviewable units that are easy to reason about.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Threat Modeling During Development',
          items: [
            {
              kind: 'steps',
              items: [
                'Identify assets and entry points.',
                'List threats (e.g., STRIDE).',
                'Prioritize by likelihood and impact.',
                'Apply mitigations and verify them.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SAST vs DAST vs SCA',
          items: [
            {
              kind: 'table',
              headers: ['Tool', 'Analyzes', 'When it runs', 'Finds'],
              rows: [
                [
                  'SAST',
                  'Source code / bytecode',
                  'During development/CI',
                  'Injection, hardcoded secrets, unsafe patterns',
                ],
                [
                  'DAST',
                  'A running application',
                  'Against a deployed/test instance',
                  'Runtime flaws, misconfigurations, exposed endpoints',
                ],
                [
                  'SCA',
                  'Third-party dependencies',
                  'During build',
                  'Known vulnerabilities in libraries',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'SAST looks at code, DAST tests the running application, and SCA checks dependencies. They are complementary, not interchangeable.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Secret Scanning, Code Review, and Security Gates',
          items: [
            {
              kind: 'bullets',
              items: [
                'Secret scanning detects credentials and tokens in code and history.',
                'Code review includes a security lens, not just correctness.',
                'Security gates in CI/CD block deployment when a critical finding is present.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'CI/CD Security and DevSecOps',
          items: [
            {
              kind: 'bullets',
              items: [
                'Shift security left: scan in the pipeline, not after release.',
                'Run SAST/SCA/secret scanning automatically on every change.',
                'Sign and pin build artifacts and images.',
                'Apply the same least privilege to pipeline credentials.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vulnerability Lifecycle and Remediation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Triage findings by severity and exploitability.',
                'False positive: a flagged issue that is not real.',
                'False negative: a real issue the tool missed.',
                'Remediate by risk, not by raw count.',
                'Verify the fix and retest.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Vulnerable → fixed: SQL and command handling',
          language: 'python',
          code:
            '# Vulnerable: string-built SQL\n' +
            'query = "SELECT * FROM users WHERE id = " + user_id\n' +
            '\n' +
            '# Secure: parameterized\n' +
            'query = "SELECT * FROM users WHERE id = %s"\n' +
            'cursor.execute(query, (user_id,))\n' +
            '\n' +
            '# Vulnerable: shell=True with user input\n' +
            'subprocess.call("ping " + host, shell=True)\n' +
            '\n' +
            '# Secure: argument list, no shell\n' +
            'subprocess.call(["ping", host])',
          note: 'Passing an argument list (instead of a single shell string) prevents the shell from interpreting user input as commands.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Output encoding prevents XSS',
              description: 'Rendering untrusted text safely.',
              language: 'python',
              code:
                'import html\n' +
                'user_text = "<script>alert(1)</script>"\n' +
                'print(html.escape(user_text))',
              output: '&lt;script&gt;alert(1)&lt;/script&gt;',
            },
            {
              title: 'Choosing the right scanner',
              description: 'A bug in a dependency is invisible to SAST.',
              language: 'text',
              code:
                'Dependency vulnerability → SCA (not SAST)\n' +
                'Live endpoint exposure  → DAST (not SAST)\n' +
                'Hardcoded secret in code → SAST / secret scanning',
              output: '(match the tool to the layer it analyzes)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def login_query_unsafe(user):\n' +
            '    return "SELECT * FROM users WHERE name = \'" + user + "\'"\n' +
            '\n' +
            'def login_query_safe(user):\n' +
            '    return "SELECT * FROM users WHERE name = %s", (user,)\n' +
            '\n' +
            'attack = "admin\' --"\n' +
            'print("UNSAFE:", login_query_unsafe(attack))\n' +
            'print("SAFE:  ", login_query_safe("admin"))',
          instructions:
            'Run it and read the UNSAFE result carefully: the single quote and comment sequence changes the meaning of the query. The SAFE version keeps the value separate so it can never alter the SQL. This single pattern — parameterization — is the fix for SQL injection.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Review each snippet, explain why it is vulnerable, rewrite it securely, and name the correct tool to catch it (SAST, DAST, or SCA): (1) `query = "SELECT * FROM users WHERE id = " + user_id`, (2) a hardcoded API key in source, (3) a dependency with a known CVE, (4) an admin endpoint reachable without an authorization check on a running app, and (5) `subprocess.call("ping " + host, shell=True)`. For each, write the fixed code or the control that would prevent it.',
          starterCode:
            '# 1. SQL injection → fix + tool\n' +
            '# 2. hardcoded secret → fix + tool\n' +
            '# 3. vulnerable dependency → fix + tool\n' +
            '# 4. missing authz → fix + tool\n' +
            '# 5. command injection → fix + tool',
          language: 'text',
          hints: [
            'SAST analyzes code, DAST tests running apps, SCA checks dependencies.',
            'Parameterize queries and avoid shell=True with user input.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does SAST analyze?',
              options: [
                { text: 'Source code', isCorrect: true },
                { text: 'A running application', isCorrect: false },
                { text: 'Third-party dependencies', isCorrect: false },
                { text: 'Network traffic', isCorrect: false },
              ],
              explanation:
                'SAST (Static Application Security Testing) analyzes source code or bytecode.',
            },
            {
              question:
                'Which tool detects a known vulnerability in a third-party library?',
              options: [
                { text: 'SCA', isCorrect: true },
                { text: 'SAST', isCorrect: false },
                { text: 'DAST', isCorrect: false },
                { text: 'A firewall', isCorrect: false },
              ],
              explanation:
                'Software Composition Analysis scans dependencies for known vulnerabilities.',
            },
            {
              question:
                'A finding that is flagged by a scanner but is not actually exploitable is a...',
              options: [
                { text: 'False positive', isCorrect: true },
                { text: 'False negative', isCorrect: false },
                { text: 'Zero day', isCorrect: false },
                { text: 'True positive', isCorrect: false },
              ],
              explanation:
                'A false positive is a reported issue that is not a real vulnerability.',
            },
            {
              question:
                'Why is `subprocess.call("ping " + host, shell=True)` dangerous?',
              options: [
                {
                  text: 'The shell may interpret user input as additional commands',
                  isCorrect: true,
                },
                { text: 'It is too slow', isCorrect: false },
                { text: 'It never runs', isCorrect: false },
                { text: 'It disables logging', isCorrect: false },
              ],
              explanation:
                'shell=True with concatenated input allows command injection.',
            },
            {
              question: 'What does "fail closed" mean?',
              options: [
                { text: 'Deny access when an error occurs', isCorrect: true },
                { text: 'Grant access on error', isCorrect: false },
                { text: 'Crash the application', isCorrect: false },
                { text: 'Log everything', isCorrect: false },
              ],
              explanation:
                'Failing closed means defaulting to denial on unexpected conditions, which is safer.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Validate input, encode output, and parameterize queries.',
            'Enforce authorization and least privilege on the server.',
            'SAST analyzes code, DAST tests running apps, SCA checks dependencies.',
            'Scan in CI/CD and block critical findings with security gates.',
            'Handle errors without leaking internals; never log secrets.',
            'Triage by risk and distinguish false positives from false negatives.',
          ],
        },
      },
    ],
  },
];
