/**
 * DEV-TO-DEV Curriculum — Cybersecurity Batch 1.
 *
 * Deep, structured lessons for the first five Cybersecurity nodes:
 * Security Fundamentals, OS Security, Networking Basics, Cryptography, and
 * Identity & Access Management.
 *
 * Read only by `author-cyber-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const cyberBatch1Lessons: PilotLesson[] = [
  // =====================================================================
  // 1. Security Fundamentals
  // =====================================================================
  {
    nodeId: 'f7a616d6-3616-4df4-94ea-be77f6f383f0',
    nodeTitle: 'Security Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Cybersecurity is the practice of protecting systems, networks, and data from harm. At its core it is a way of thinking: what are we protecting, from whom, and what happens if we fail. Every more advanced security topic — cryptography, network security, penetration testing — builds on a small set of foundational ideas.\n\n' +
            'This lesson introduces those ideas: the CIA Triad, the difference between authentication and authorization, assets, threats, vulnerabilities, and risk, security controls, and how to think about threats systematically with the STRIDE threat-modeling framework.\n\n' +
            'By the end you will be able to look at a system and reason about what could go wrong, how likely it is, and what you can do about it.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Cybersecurity?',
          items: [
            {
              kind: 'paragraph',
              text: 'Cybersecurity protects information and the systems that store, process, and transmit it. It is not just technology — it is also people and process.',
            },
            {
              kind: 'bullets',
              items: [
                'People: the users and staff whose actions can help or harm security.',
                'Process: policies, procedures, and response plans.',
                'Technology: controls such as encryption, firewalls, and access controls.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The CIA Triad',
          items: [
            {
              kind: 'paragraph',
              text: 'CIA is the classic model for what security protects. It stands for Confidentiality, Integrity, and Availability.',
            },
            {
              kind: 'table',
              headers: ['Property', 'Meaning', 'Example of a failure'],
              rows: [
                [
                  'Confidentiality',
                  'Only authorized people can read the data',
                  'A leaked database of customer records',
                ],
                [
                  'Integrity',
                  'Data is not altered without authorization',
                  'An attacker changes an account balance',
                ],
                [
                  'Availability',
                  'Data and services are reachable when needed',
                  'A denial-of-service attack takes a site offline',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Authentication vs Authorization',
          items: [
            {
              kind: 'paragraph',
              text: 'These are often confused but are different. Authentication answers "who are you?"; authorization answers "what are you allowed to do?".',
            },
            {
              kind: 'bullets',
              items: [
                'Authentication: proving your identity (password, MFA, certificate).',
                'Authorization: what an identified user is permitted to access or do.',
                'A user can be authenticated but still not authorized to read a particular file.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Assets, Threats, and Vulnerabilities',
          items: [
            {
              kind: 'bullets',
              items: [
                'Asset: anything of value (data, systems, people, reputation).',
                'Threat: something that could cause harm (an attacker, a flood, an accident).',
                'Vulnerability: a weakness a threat could exploit (unpatched software, weak password).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Risk',
          items: [
            {
              kind: 'paragraph',
              text: 'Risk combines likelihood and impact. You cannot eliminate all risk; security is about reducing it to an acceptable level, focusing effort where harm would be greatest.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security Controls',
          items: [
            {
              kind: 'table',
              headers: ['Type', 'Question it answers', 'Example'],
              rows: [
                [
                  'Preventive',
                  'Stop the incident',
                  'Firewall, strong password policy',
                ],
                [
                  'Detective',
                  'Notice the incident',
                  'Logging, intrusion detection',
                ],
                ['Corrective', 'Fix the incident', 'Backup restore, patching'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Threat Modeling and STRIDE',
          items: [
            {
              kind: 'paragraph',
              text: 'Threat modeling is a structured way to find and prioritise threats. STRIDE is a mnemonic for six categories of threat.',
            },
            {
              kind: 'table',
              headers: ['STRIDE', 'Threat'],
              rows: [
                ['Spoofing', 'Pretending to be someone else'],
                ['Tampering', 'Modifying data or code'],
                ['Repudiation', 'Denying you did something'],
                ['Information Disclosure', 'Exposing data to the wrong people'],
                ['Denial of Service', 'Making a service unavailable'],
                [
                  'Elevation of Privilege',
                  'Gaining higher access than intended',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Threat → Vulnerability → Exploit → Impact',
          items: [
            {
              kind: 'flow',
              steps: [
                'Threat (attacker)',
                'Exploits',
                'Vulnerability (weakness)',
                'Causes',
                'Impact (harm)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A threat uses an exploit to take advantage of a vulnerability, producing impact. Reducing any link in this chain reduces risk.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Defense in Depth',
          items: [
            {
              kind: 'layers',
              layers: [
                'Perimeter (firewall)',
                'Network (segmentation)',
                'Host (patching, hardening)',
                'Application (validation)',
                'Data (encryption)',
                'People (training)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Defense in depth layers multiple controls so that if one fails, others still protect. No single control is sufficient.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Least Privilege and Zero Trust',
          items: [
            {
              kind: 'bullets',
              items: [
                'Least privilege: grant only the access needed to do a job.',
                'Zero trust: do not automatically trust anything inside or outside the network; verify every request.',
              ],
            },
          ],
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Security is a process, not a product',
          text: 'A firewall or antivirus is not "done security." Security requires continuous monitoring, patching, and review.',
          variant: 'info',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Confusing authentication with authorization.',
                'Focusing only on confidentiality and ignoring integrity and availability.',
                'Treating security as a one-time purchase rather than an ongoing process.',
                'Ignoring the human layer — many breaches start with social engineering.',
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
              title: 'A threat-modeling walkthrough',
              description:
                'For a login form, think through STRIDE: Spoofing (stolen credentials), Tampering (modify a request), Information Disclosure (expose user data), Denial of Service (flood the endpoint).',
              language: 'text',
              code: 'Login form\n  Spoofing        → MFA\n  Tampering       → server-side validation\n  Info Disclosure → encrypt responses\n  DoS             → rate limiting',
              output: '(each threat maps to a mitigation)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a threat model using the STRIDE methodology for a theoretical mobile banking application. For each STRIDE category, identify one realistic threat and one mitigation. Then identify the three most important assets and explain what happens if each is compromised (confidentiality, integrity, or availability).',
          hints: [
            'Think about the mobile app, the backend API, and the customer data.',
            'Map each threat to a control (preventive, detective, or corrective).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does the "I" in the CIA Triad stand for?',
              options: [
                { text: 'Identification', isCorrect: false },
                { text: 'Integrity', isCorrect: true },
                { text: 'Interoperability', isCorrect: false },
                { text: 'Isolation', isCorrect: false },
              ],
              explanation: 'CIA = Confidentiality, Integrity, Availability.',
            },
            {
              question:
                'What is the difference between authentication and authorization?',
              options: [
                {
                  text: 'Authentication is identity; authorization is permissions',
                  isCorrect: true,
                },
                { text: 'They are the same thing', isCorrect: false },
                {
                  text: 'Authorization is identity; authentication is permissions',
                  isCorrect: false,
                },
                { text: 'Neither involves users', isCorrect: false },
              ],
              explanation:
                'Authentication proves who you are; authorization decides what you may do.',
            },
            {
              question: 'A firewall is which type of security control?',
              options: [
                { text: 'Detective', isCorrect: false },
                { text: 'Corrective', isCorrect: false },
                { text: 'Preventive', isCorrect: true },
                { text: 'None', isCorrect: false },
              ],
              explanation:
                'A firewall prevents unauthorized traffic before it causes harm.',
            },
            {
              question: 'In STRIDE, what does "Elevation of Privilege" mean?',
              options: [
                {
                  text: 'Gaining higher access than intended',
                  isCorrect: true,
                },
                { text: 'Deleting data', isCorrect: false },
                { text: 'Pretending to be another user', isCorrect: false },
                { text: 'Making a service unavailable', isCorrect: false },
              ],
              explanation:
                'Elevation of Privilege is gaining permissions you should not have.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Security protects confidentiality, integrity, and availability.',
            'Authentication is identity; authorization is permissions.',
            'A threat exploits a vulnerability to cause impact.',
            'STRIDE is a framework for identifying threats by category.',
            'Defense in depth and least privilege reduce risk.',
            'Security is continuous, not a one-time purchase.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 2. OS Security
  // =====================================================================
  {
    nodeId: '93d80cc4-fc74-4a11-950b-6b3f79e95ca4',
    nodeTitle: 'OS Security',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'The operating system is the security boundary between a running program and the rest of the machine. It decides who can read, write, and execute what, and it isolates processes from each other. Hardening an operating system means locking down that boundary: restricting permissions, removing unnecessary services, keeping software patched, and logging enough to detect trouble.\n\n' +
            'This lesson covers users, groups, and permissions, Linux file permissions (chmod/chown), processes and services, the concept of privilege escalation, Windows security, patch management, and a practical hardening workflow.\n\n' +
            'The examples use Linux because it is the standard for security work, but the principles apply to Windows and macOS too.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why the OS Is a Security Boundary',
          items: [
            {
              kind: 'paragraph',
              text: 'Applications run on top of the OS, and the OS enforces the rules about what each process may do. A compromised process is only as dangerous as the permissions the OS gave it — which is why least privilege matters at the OS level.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Users, Groups, and Permissions',
          items: [
            {
              kind: 'bullets',
              items: [
                'Users: accounts that own files and run processes.',
                'Groups: collections of users, used to grant shared access.',
                'Permissions: read, write, and execute rights on files and directories.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Linux File Permissions',
          items: [
            {
              kind: 'paragraph',
              text: 'Every file has an owner, a group, and a permission string like rwxr-xr-x, which grants read (r), write (w), and execute (x) to the owner, the group, and others.',
            },
            {
              kind: 'code',
              language: 'bash',
              code: '$ ls -l report.txt\n-rw-r--r-- 1 alice staff 120 Jan 01 10:00 report.txt\n\n$ chmod 600 report.txt    # owner read/write only\n$ chown alice:staff report.txt',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Processes and Services',
          items: [
            {
              kind: 'paragraph',
              text: 'A process is a running program; a service (daemon) is a process that runs in the background. Every unnecessary service increases attack surface, so hardening includes disabling what is not needed.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Privilege Escalation',
          items: [
            {
              kind: 'paragraph',
              text: 'Privilege escalation is when an attacker with limited access gains higher access — for example, from a normal user to root/admin. It is a key goal of many attacks and a key thing hardening tries to prevent.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Run services with the least privilege possible. A service that does not need root should not run as root.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Linux vs Windows Security',
          items: [
            {
              kind: 'table',
              headers: ['', 'Linux', 'Windows'],
              rows: [
                [
                  'Permissions',
                  'rwx bits via chmod/chown',
                  'ACLs, Registry, Group Policy',
                ],
                [
                  'Admin model',
                  'root vs normal user',
                  'Administrator vs standard user',
                ],
                [
                  'Central control',
                  'Config files, SSH',
                  'Active Directory, GPO',
                ],
                [
                  'Hardening focus',
                  'Disable services, file perms',
                  'Patching, GPO, AD',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Patch Management and Hardening',
          items: [
            {
              kind: 'bullets',
              items: [
                'Patch operating systems and applications promptly.',
                'Remove unused software and services.',
                'Disable default/guest accounts and set strong passwords.',
                'Restrict who can install software.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Logging and Endpoint Protection',
          items: [
            {
              kind: 'bullets',
              items: [
                'Enable and ship OS logs to a central location.',
                'Use endpoint protection (antivirus/EDR) and keep it updated.',
                'Log authentication and privileged actions so intrusions can be detected.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Hardening Workflow',
          items: [
            {
              kind: 'steps',
              items: [
                'Inventory the system and its services.',
                'Remove or disable unnecessary services.',
                'Tighten file and directory permissions.',
                'Apply least-privilege accounts.',
                'Enable and centralize logging.',
                'Patch and schedule regular reviews.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Running services as root/admin unnecessarily.',
                'Using chmod 777 to "make it work".',
                'Leaving default credentials in place.',
                'Ignoring patching until after an incident.',
                'Turning off logging to save disk.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Safe permission commands',
          language: 'bash',
          code:
            '# Inspect permissions\n' +
            'ls -l /etc/passwd\n' +
            '\n' +
            '# Restrict a sensitive file to its owner\n' +
            'chmod 600 secrets.txt\n' +
            '\n' +
            '# Make a directory private to its owner\n' +
            'chmod 700 ~/private\n' +
            '\n' +
            '# Change ownership\n' +
            'chown appuser:appgroup config.txt',
          note: 'These are safe, read-only-ish examples for a system you control. Never chmod 777 a file just to silence a permission error.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A hardening scenario',
              description: 'A web server should not run as root.',
              language: 'text',
              code: 'Bad:  web server runs as root\nGood: web server runs as a dedicated unprivileged user, owns only its own files',
              output:
                '(least privilege reduces the blast radius of a compromise)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Plan a hardening procedure for a Linux server running a web application. Identify: (1) the account under which the web server should run and why, (2) three services you might disable, (3) the permissions you would set on the application\u2019s configuration file, and (4) what logging you would enable. Explain the least-privilege reasoning for each choice.',
          starterCode:
            '# 1. service account and least privilege\n' +
            '# 2. unnecessary services to disable\n' +
            '# 3. file permission choices (chmod/chown)\n' +
            '# 4. logging to enable',
          language: 'bash',
          hints: [
            'The web server should not run as root.',
            'A config file with secrets should be owner-only (chmod 600).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does chmod 600 do to a file?',
              options: [
                { text: 'Owner read/write only', isCorrect: true },
                { text: 'Everyone can read and write', isCorrect: false },
                { text: 'Everyone can execute', isCorrect: false },
                { text: 'Removes the file', isCorrect: false },
              ],
              explanation:
                '600 grants the owner read (4) + write (2) and nothing to group or others.',
            },
            {
              question: 'Why should a web server not run as root?',
              options: [
                { text: 'Root is slower', isCorrect: false },
                {
                  text: 'A compromise would have full system control (least privilege)',
                  isCorrect: true,
                },
                { text: 'Root cannot listen on ports', isCorrect: false },
                { text: 'It is a Windows-only rule', isCorrect: false },
              ],
              explanation:
                'Running as root means any compromise gains maximum access.',
            },
            {
              question: 'What is privilege escalation?',
              options: [
                {
                  text: 'Gaining higher access than you were granted',
                  isCorrect: true,
                },
                { text: 'Deleting a user account', isCorrect: false },
                { text: 'Installing antivirus', isCorrect: false },
                { text: 'Backing up data', isCorrect: false },
              ],
              explanation:
                'Privilege escalation moves from a limited user to a more privileged one.',
            },
            {
              question: 'Which is a detective control in OS security?',
              options: [
                { text: 'chmod 600', isCorrect: false },
                { text: 'Logging authentication events', isCorrect: true },
                { text: 'Disabling a service', isCorrect: false },
                { text: 'Patching the OS', isCorrect: false },
              ],
              explanation: 'Logging detects rather than prevents.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The OS is the boundary that enforces access rules.',
            'Linux permissions are read/write/execute for owner, group, and others.',
            'Least privilege means services run with only the access they need.',
            'Disable unnecessary services to reduce attack surface.',
            'Patch promptly and centralize logging.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 3. Networking Basics
  // =====================================================================
  {
    nodeId: '869562e7-b073-4f9f-9743-7bac18290581',
    nodeTitle: 'Networking Basics',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Networks carry almost everything a computer does, so understanding how data moves across them is essential for security. Attackers exploit weak protocols, and defenders inspect traffic to find those attacks. This lesson introduces the core networking concepts — IP and MAC addresses, packets, TCP and UDP, ports, ARP, and DNS — and explains where each becomes a security concern.\n\n' +
            'The focus is practical: you will learn what a packet looks like, how a connection is established, and how common attacks such as ARP spoofing and DNS poisoning work, so you can recognize them in traffic.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Networking Matters to Security',
          items: [
            {
              kind: 'paragraph',
              text: 'If you cannot read traffic, you cannot see what an attacker is doing. Network security is the ability to understand, and therefore monitor and defend, the data flowing between systems.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Fundamentals',
          items: [
            {
              kind: 'bullets',
              items: [
                'IP address: the logical address of a host on a network.',
                'MAC address: the physical address of a network interface.',
                'Packet: a unit of data sent over the network, with a header and payload.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'TCP vs UDP',
          items: [
            {
              kind: 'table',
              headers: ['', 'TCP', 'UDP'],
              rows: [
                [
                  'Connection',
                  'Connection-oriented (handshake)',
                  'Connectionless',
                ],
                ['Reliability', 'Reliable, ordered', 'Best-effort'],
                ['Use', 'Web, email, file transfer', 'DNS, streaming, voice'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Ports and the TCP Handshake',
          items: [
            {
              kind: 'paragraph',
              text: 'A port identifies a service on a host (for example, 80 for HTTP, 443 for HTTPS). TCP establishes a connection with a three-way handshake.',
            },
            {
              kind: 'flow',
              steps: ['Client → SYN', 'Server → SYN-ACK', 'Client → ACK'],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'ARP and DNS',
          items: [
            {
              kind: 'paragraph',
              text: 'ARP maps IP addresses to MAC addresses on a local network. DNS maps human-readable names to IP addresses. Both are trusted protocols with no built-in verification, which makes them attack targets.',
            },
            {
              kind: 'flow',
              steps: [
                'Browser asks DNS for example.com',
                'DNS returns an IP',
                'Browser connects to the IP',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Network Attack Surfaces',
          items: [
            {
              kind: 'bullets',
              items: [
                'Open or misconfigured services.',
                'Plaintext protocols that leak credentials.',
                'Trust-based protocols such as ARP and DNS.',
                'Weak wireless encryption.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'ARP Spoofing and DNS Attacks',
          items: [
            {
              kind: 'paragraph',
              text: 'In ARP spoofing, an attacker answers ARP requests with their own MAC address, redirecting traffic. In DNS poisoning, an attacker injects a false DNS answer so a name resolves to the wrong IP. Both are man-in-the-middle techniques.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'These attacks exploit missing authentication in the protocols. Defenses include monitoring for unexpected mappings and using encrypted/authenticated channels.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Packet Inspection and Traffic Analysis',
          items: [
            {
              kind: 'paragraph',
              text: 'Tools such as Wireshark capture and display packets. Analysts look for anomalies: unexpected hosts, plaintext credentials, unusual ports, or repeated failed connections.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security Relevance of Each Protocol',
          items: [
            {
              kind: 'table',
              headers: ['Protocol', 'Security concern'],
              rows: [
                ['ARP', 'Spoofing / man-in-the-middle'],
                ['DNS', 'Poisoning / domain hijacking'],
                ['HTTP', 'Plaintext — use HTTPS'],
                ['FTP/Telnet', 'Plaintext credentials'],
                ['SSH/HTTPS', 'Encrypted — preferred'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Using plaintext protocols for credentials.',
                'Trusting ARP/DNS without verification.',
                'Ignoring traffic you cannot explain.',
                'Leaving unnecessary ports open.',
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
              title: 'A packet-flow scenario',
              description:
                'Trace what happens when a browser loads a page over HTTPS.',
              language: 'text',
              code: 'Client → DNS (resolve host) → TCP handshake → TLS handshake → HTTP request → response',
              output: '(each layer has a security role)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Given a sample PCAP containing malicious traffic, describe your analysis process: (1) how you would filter the capture to find the attacker\u2019s IP, (2) what plaintext credentials look like in the traffic, and (3) which protocol weaknesses the attacker likely exploited. Explain your reasoning step by step.',
          starterCode:
            '# 1. filter by protocol / source IP\n' +
            '# 2. follow the stream to find credentials\n' +
            '# 3. identify the protocol weakness',
          language: 'text',
          hints: [
            'Look for unencrypted protocols such as FTP, Telnet, or plain HTTP.',
            'Follow a TCP stream to reconstruct the conversation.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What are the three steps of the TCP handshake?',
              options: [
                { text: 'SYN, SYN-ACK, ACK', isCorrect: true },
                { text: 'ACK, SYN, FIN', isCorrect: false },
                { text: 'GET, POST, PUT', isCorrect: false },
                { text: 'SYN, FIN, RST', isCorrect: false },
              ],
              explanation: 'The three-way handshake is SYN, SYN-ACK, ACK.',
            },
            {
              question: 'What does DNS do?',
              options: [
                { text: 'Maps names to IP addresses', isCorrect: true },
                { text: 'Encrypts traffic', isCorrect: false },
                { text: 'Routes packets', isCorrect: false },
                { text: 'Assigns MAC addresses', isCorrect: false },
              ],
              explanation:
                'DNS translates human-readable names into IP addresses.',
            },
            {
              question: 'Which protocol is connectionless and best-effort?',
              options: [
                { text: 'TCP', isCorrect: false },
                { text: 'UDP', isCorrect: true },
                { text: 'HTTP', isCorrect: false },
                { text: 'SSH', isCorrect: false },
              ],
              explanation:
                'UDP is connectionless and does not guarantee delivery.',
            },
            {
              question: 'Why is ARP spoofing possible?',
              options: [
                { text: 'ARP has no built-in authentication', isCorrect: true },
                { text: 'ARP is encrypted', isCorrect: false },
                { text: 'ARP is too slow', isCorrect: false },
                { text: 'ARP only works on IPv6', isCorrect: false },
              ],
              explanation:
                'ARP trusts responses, so an attacker can reply with their own MAC address.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Networks move data as packets with addresses and ports.',
            'TCP is reliable and ordered; UDP is best-effort.',
            'ARP maps IP to MAC; DNS maps names to IP — both are unauthenticated.',
            'Plaintext protocols leak data; use encrypted ones.',
            'Traffic analysis is how defenders detect attacks.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 4. Cryptography
  // =====================================================================
  {
    nodeId: 'b31648a0-941b-4fb3-a6e1-c005d88dfbb9',
    nodeTitle: 'Cryptography',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Cryptography is the science of protecting information by transforming it. It gives us confidentiality (encryption), integrity (hashing and signatures), and authenticity (signatures and certificates). This lesson explains the fundamental ideas — encryption versus hashing, symmetric versus asymmetric encryption, password hashing, digital signatures, and the public-key infrastructure behind HTTPS.\n\n' +
            'The most important skill is knowing which tool to use when: hash passwords, encrypt data, sign messages. Confusing these is the source of most cryptographic mistakes.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Goals of Cryptography',
          items: [
            {
              kind: 'bullets',
              items: [
                'Confidentiality: only the intended recipient can read the data.',
                'Integrity: detect if data was altered.',
                'Authenticity: verify who the data came from.',
                'Non-repudiation: the sender cannot deny sending it.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Encryption vs Hashing vs Encoding',
          items: [
            {
              kind: 'table',
              headers: ['', 'Encryption', 'Hashing', 'Encoding'],
              rows: [
                [
                  'Reversible?',
                  'Yes (with the key)',
                  'No (one-way)',
                  'Yes (deterministic)',
                ],
                [
                  'Purpose',
                  'Confidentiality',
                  'Integrity / verification',
                  'Representation',
                ],
                ['Example', 'AES, RSA', 'SHA-256, bcrypt', 'Base64, hex'],
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Encoding (Base64, hex) is not encryption. It only changes representation and is trivially reversible.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Symmetric Encryption',
          items: [
            {
              kind: 'paragraph',
              text: 'Symmetric encryption uses one shared key to both encrypt and decrypt. It is fast and used for bulk data. AES is the standard algorithm. The challenge is securely sharing the key.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Asymmetric Encryption',
          items: [
            {
              kind: 'paragraph',
              text: 'Asymmetric encryption uses a key pair: a public key (shared freely) and a private key (kept secret). Anything encrypted with the public key can only be decrypted with the private key. RSA is the classic example. It solves key distribution but is slower.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hashing',
          items: [
            {
              kind: 'paragraph',
              text: 'A hash function maps any input to a fixed-size output and is one-way and deterministic. The same input always gives the same hash, but you cannot recover the input from the hash. SHA-256 is a common example.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Password Hashing: Salt, bcrypt, Argon2',
          items: [
            {
              kind: 'paragraph',
              text: 'Passwords must never be stored in plaintext or encrypted — they must be hashed with a slow, salted algorithm. A salt is random data added before hashing so identical passwords produce different hashes. bcrypt and Argon2 are designed to be slow, making brute-force attacks expensive.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Never encrypt passwords for storage. Hashing is one-way; encryption is reversible. Use bcrypt or Argon2, not fast hashes like SHA-256, for passwords.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Digital Signatures',
          items: [
            {
              kind: 'paragraph',
              text: 'A digital signature is created with a private key and verified with the corresponding public key. It proves authenticity and integrity: the message came from the key holder and was not altered.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Key Exchange and TLS',
          items: [
            {
              kind: 'flow',
              steps: [
                'Client hello',
                'Server certificate',
                'Key exchange',
                'Encrypted session',
              ],
            },
            {
              kind: 'paragraph',
              text: 'TLS uses asymmetric cryptography to establish a session key, then symmetric encryption for the rest of the connection. This gives the security of asymmetric with the speed of symmetric.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'PKI, Certificates, and Certificate Authorities',
          items: [
            {
              kind: 'paragraph',
              text: 'A digital certificate binds a public key to an identity. A Certificate Authority (CA) signs certificates, and browsers trust a set of root CAs. A certificate chain links a site\u2019s certificate up to a trusted root.',
            },
            {
              kind: 'flow',
              steps: ['Root CA', 'Intermediate CA', 'Site certificate'],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cryptographic Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Rolling your own crypto instead of using vetted libraries.',
                'Storing passwords in plaintext or with reversible encryption.',
                'Using fast, unsalted hashes for passwords.',
                'Confusing encoding (Base64) with encryption.',
                'Reusing keys or nonces inappropriately.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Hashing with the Python standard library',
          language: 'python',
          code:
            'import hashlib\n' +
            '\n' +
            'def sha256(text):\n' +
            '    return hashlib.sha256(text.encode()).hexdigest()\n' +
            '\n' +
            'print(sha256("correct horse battery staple"))\n' +
            'print(sha256("correct horse battery staple"))  # deterministic\n' +
            'print(sha256("Correct horse battery staple"))   # different!',
          note: 'SHA-256 is a fast hash for integrity, not for password storage. For passwords use a slow salted algorithm such as bcrypt or Argon2 (not shown here because the sandbox uses only the standard library).',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Hashing is deterministic and one-way',
              description:
                'The same input always produces the same hash; you cannot reverse it.',
              language: 'python',
              code: 'import hashlib\nh = hashlib.sha256(b"hello").hexdigest()\nprint(h)',
              output:
                '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
            },
            {
              title: 'A tiny change changes the whole hash',
              description:
                'The avalanche effect: one different character produces a completely different digest.',
              language: 'python',
              code: 'import hashlib\nprint(hashlib.sha256(b"hello").hexdigest()[:16])\nprint(hashlib.sha256(b"Hello").hexdigest()[:16])',
              output: '2cf24dba5fb0a30e\n185f8db32271fe25',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'import hashlib\n' +
            '\n' +
            'def hash_value(text):\n' +
            '    return hashlib.sha256(text.encode()).hexdigest()\n' +
            '\n' +
            'a = hash_value("password")\n' +
            'b = hash_value("password")\n' +
            'c = hash_value("Password")\n' +
            'print(a == b)   # same input, same hash\n' +
            'print(a == c)   # different input, different hash',
          instructions:
            'Run it to see hashing is deterministic but sensitive to input. Then change one character in the input and confirm the hash changes completely. Note: this is a fast hash for demonstrating the idea — real password storage uses slow, salted hashes.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Explain the difference between hashing and encryption, and why a password should be hashed (with salt) rather than encrypted. Then write the conceptual steps to create an RSA key pair and use it to encrypt a message, describing which key encrypts and which decrypts. Identify one situation where you would use symmetric encryption and one where you would use asymmetric encryption.',
          starterCode:
            '# 1. hashing vs encryption (one-way vs reversible)\n' +
            '# 2. RSA: public key encrypts, private key decrypts\n' +
            '# 3. symmetric vs asymmetric use cases',
          language: 'text',
          hints: [
            'Hashing is one-way and used for integrity/passwords.',
            'Public key encrypts; private key decrypts in RSA.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which operation is one-way and used for password storage?',
              options: [
                { text: 'Symmetric encryption', isCorrect: false },
                { text: 'Hashing', isCorrect: true },
                { text: 'Encoding', isCorrect: false },
                { text: 'Digital signatures', isCorrect: false },
              ],
              explanation:
                'Hashing is one-way; passwords are stored as salted hashes.',
            },
            {
              question: 'What does a salt do in password hashing?',
              options: [
                {
                  text: 'Makes identical passwords produce different hashes',
                  isCorrect: true,
                },
                { text: 'Encrypts the password', isCorrect: false },
                { text: 'Speeds up hashing', isCorrect: false },
                { text: 'Replaces the password', isCorrect: false },
              ],
              explanation:
                'A salt is random data added before hashing to defeat precomputed tables.',
            },
            {
              question:
                'In RSA, which key encrypts a message sent to a recipient?',
              options: [
                { text: 'The recipient\u2019s public key', isCorrect: true },
                { text: 'The recipient\u2019s private key', isCorrect: false },
                { text: 'The sender\u2019s private key', isCorrect: false },
                { text: 'A shared secret', isCorrect: false },
              ],
              explanation:
                'Encrypt with the recipient\u2019s public key; only their private key can decrypt.',
            },
            {
              question: 'Is Base64 encoding a form of encryption?',
              options: [
                {
                  text: 'No — it is reversible representation',
                  isCorrect: true,
                },
                { text: 'Yes — it is secret', isCorrect: false },
                { text: 'Yes — it is one-way', isCorrect: false },
                { text: 'Only for passwords', isCorrect: false },
              ],
              explanation:
                'Base64 is encoding, not encryption — it is trivially reversible.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Cryptography provides confidentiality, integrity, authenticity, and non-repudiation.',
            'Encryption is reversible; hashing is one-way; encoding is representation.',
            'Symmetric uses one shared key (fast); asymmetric uses a key pair.',
            'Hash passwords with a slow, salted algorithm (bcrypt/Argon2), never encrypt them.',
            'Digital signatures prove authenticity; certificates bind keys to identity.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 5. Identity & Access Management
  // =====================================================================
  {
    nodeId: 'afd163e5-e7cc-4445-a98c-46e1eeebc865',
    nodeTitle: 'Identity & Access Management',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Identity and Access Management (IAM) is the discipline of ensuring the right people have the right access to the right resources, for the right reasons. It covers identity, authentication, authorization, and auditing, plus the modern protocols — OAuth 2.0 and OpenID Connect — that web applications use to delegate access.\n\n' +
            'This lesson explains the IAM lifecycle, roles and permissions, multi-factor authentication, tokens and sessions, and the difference between OAuth 2.0 (authorization) and OIDC (authentication).',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Identity, Authentication, Authorization',
          items: [
            {
              kind: 'table',
              headers: ['Term', 'Question', 'Example'],
              rows: [
                ['Identity', 'Who is this?', 'A username or email'],
                ['Authentication', 'Prove it', 'Password + MFA'],
                ['Authorization', 'What may they do?', 'RBAC role permissions'],
                ['Accounting/Audit', 'What did they do?', 'Access logs'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The IAM Lifecycle',
          items: [
            {
              kind: 'bullets',
              items: [
                'Joiner: a new user is provisioned with the access their role needs.',
                'Mover: access changes when a role changes.',
                'Leaver: access is revoked promptly when someone leaves.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'RBAC and Least Privilege',
          items: [
            {
              kind: 'paragraph',
              text: 'Role-Based Access Control (RBAC) assigns permissions to roles, and users to roles. Least privilege means granting only the permissions required for the job.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Multi-Factor Authentication (MFA)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Something you know (password).',
                'Something you have (a token or phone).',
                'Something you are (biometrics).',
              ],
            },
            {
              kind: 'paragraph',
              text: 'MFA requires at least two factors, so a stolen password is not enough to gain access.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Sessions and Tokens',
          items: [
            {
              kind: 'paragraph',
              text: 'After authentication, the user is given a session or token that represents their identity for subsequent requests, so they do not re-enter credentials every time.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'OAuth 2.0',
          items: [
            {
              kind: 'paragraph',
              text: 'OAuth 2.0 is an authorization framework. It lets a user grant a third-party application limited access to a resource without sharing their password.',
            },
            {
              kind: 'flow',
              steps: [
                'User',
                'Authorization server',
                'Access token',
                'Application',
                'Resource',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'OpenID Connect (OIDC)',
          items: [
            {
              kind: 'paragraph',
              text: 'OIDC is an identity layer built on top of OAuth 2.0. Where OAuth 2.0 issues access tokens (authorization), OIDC adds ID tokens that prove who the user is (authentication).',
            },
            {
              kind: 'table',
              headers: ['', 'OAuth 2.0', 'OpenID Connect'],
              rows: [
                ['Purpose', 'Authorization', 'Authentication'],
                ['Key token', 'Access token', 'ID token'],
                ['Answers', 'What may the app access?', 'Who is the user?'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Access, ID, and Refresh Tokens',
          items: [
            {
              kind: 'table',
              headers: ['Token', 'Purpose'],
              rows: [
                ['Access token', 'Authorizes access to a resource'],
                ['ID token', 'Proves the user\u2019s identity'],
                ['Refresh token', 'Obtains new access tokens without re-login'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Scopes, Consent, and Service Accounts',
          items: [
            {
              kind: 'bullets',
              items: [
                'Scopes define the specific permissions an app is requesting.',
                'Consent is the user agreeing to those scopes.',
                'Service accounts are machine identities for automated access.',
                'Privileged accounts need extra protection and review.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common IAM Failures',
          items: [
            {
              kind: 'bullets',
              items: [
                'Over-permissioned users (no least privilege).',
                'Shared or default credentials.',
                'Access not revoked when someone leaves.',
                'Weak or missing MFA on privileged accounts.',
                'Confusing OAuth 2.0 (authorization) with authentication.',
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
              title: 'An OAuth authorization flow',
              description: 'A user grants a photo app access to their files.',
              language: 'text',
              code: 'User → App (redirect) → Auth server → Consent → Access token → App → Files API',
              output: '(the app never sees the user\u2019s password)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Design an IAM scheme for a small company with engineers, managers, and a finance team. Describe: (1) the roles and what each may access, (2) how you would enforce least privilege, (3) the MFA policy for privileged accounts, and (4) the joiner/mover/leaver process. Then explain, in one or two sentences, the difference between OAuth 2.0 and OpenID Connect.',
          starterCode:
            '# 1. roles and permissions\n' +
            '# 2. least-privilege policy\n' +
            '# 3. MFA policy\n' +
            '# 4. joiner/mover/leaver\n' +
            '# 5. OAuth 2.0 vs OIDC',
          language: 'text',
          hints: [
            'RBAC maps users to roles to permissions.',
            'OAuth 2.0 authorizes; OIDC authenticates.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the difference between OAuth 2.0 and OpenID Connect?',
              options: [
                {
                  text: 'OAuth 2.0 authorizes; OIDC authenticates',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                {
                  text: 'OIDC authorizes; OAuth 2.0 authenticates',
                  isCorrect: false,
                },
                { text: 'Neither uses tokens', isCorrect: false },
              ],
              explanation: 'OIDC is an identity layer on top of OAuth 2.0.',
            },
            {
              question: 'Which token proves the user\u2019s identity in OIDC?',
              options: [
                { text: 'Access token', isCorrect: false },
                { text: 'Refresh token', isCorrect: false },
                { text: 'ID token', isCorrect: true },
                { text: 'CSRF token', isCorrect: false },
              ],
              explanation: 'The ID token asserts who the user is.',
            },
            {
              question: 'What does least privilege mean?',
              options: [
                {
                  text: 'Grant only the access needed for the job',
                  isCorrect: true,
                },
                { text: 'Give everyone admin access', isCorrect: false },
                { text: 'Revoke all access', isCorrect: false },
                { text: 'Use only passwords', isCorrect: false },
              ],
              explanation:
                'Least privilege limits access to what is strictly necessary.',
            },
            {
              question: 'Which is an example of a "something you have" factor?',
              options: [
                { text: 'A password', isCorrect: false },
                { text: 'A fingerprint', isCorrect: false },
                { text: 'A hardware token or phone', isCorrect: true },
                { text: 'A username', isCorrect: false },
              ],
              explanation: 'A phone or token is a possession factor.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'IAM governs identity, authentication, authorization, and auditing.',
            'RBAC assigns permissions to roles; least privilege limits access.',
            'MFA combines factors so a stolen password is not enough.',
            'OAuth 2.0 is authorization; OIDC adds authentication.',
            'Revoke access promptly through the joiner/mover/leaver lifecycle.',
          ],
        },
      },
    ],
  },
];
