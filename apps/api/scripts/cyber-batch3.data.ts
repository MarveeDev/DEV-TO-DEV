/**
 * DEV-TO-DEV Curriculum — Cybersecurity Batch 3 (final batch).
 *
 * Advanced, defensive lessons for the last four Cybersecurity nodes:
 * Penetration Testing, Malware Analysis, SOC Operations, and Incident
 * Response.
 *
 * Read only by `author-cyber-batch3.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified. Content is educational, controlled, and defensive; it never
 * provides operational instructions for attacking or compromising real
 * systems, creating malware, or deploying persistence.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const cyberBatch3Lessons: PilotLesson[] = [
  // =====================================================================
  // 10. Penetration Testing
  // =====================================================================
  {
    nodeId: '7e7175c9-5fe3-4f48-8c39-7da3ea3fe198',
    nodeTitle: 'Penetration Testing',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Penetration testing is the authorized, controlled simulation of an attack against a system to find weaknesses before a real attacker does. It is not hacking for its own sake: it is a professional engagement governed by a signed authorization and a defined scope, and its output is a report that tells the organization what is broken and how to fix it.\n\n' +
            'This lesson teaches the discipline: how a penetration test differs from a vulnerability assessment, the rules of engagement, the testing lifecycle, the different box types and testing surfaces, how findings are rated and reported, and the ethics that keep the whole activity safe and legal.\n\n' +
            'Everything here is conceptual, controlled, and defensive. You will reason about scope, findings, and remediation — never about exploiting a real target.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vulnerability Assessment vs Penetration Testing',
          items: [
            {
              kind: 'table',
              headers: ['', 'Vulnerability Assessment', 'Penetration Testing'],
              rows: [
                [
                  'Goal',
                  'Find and list weaknesses',
                  'Prove what an attacker could actually do',
                ],
                [
                  'Depth',
                  'Broad, mostly automated',
                  'Deeper, manual, goal-driven',
                ],
                [
                  'Exploitation',
                  'Not performed',
                  'Controlled exploitation of validated findings',
                ],
                [
                  'Output',
                  'Inventory of vulnerabilities',
                  'Findings with impact and remediation',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'A vulnerability assessment finds; a penetration test proves. They are complementary: many engagements start with an assessment and follow with targeted testing.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Rules of Engagement, Authorization, and Scope',
          items: [
            {
              kind: 'bullets',
              items: [
                'Authorization: written permission signed by someone who can grant it.',
                'Scope: the exact systems, networks, and techniques allowed.',
                'Rules of engagement: what the tester may and may not do.',
                'Time window: when testing may occur.',
                'Emergency contact: who to call if something breaks.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Testing outside the authorized scope is unauthorized access, regardless of intent. Scope and authorization are legal boundaries, not suggestions.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Penetration Testing Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: [
                'Scoping',
                'Reconnaissance',
                'Enumeration',
                'Vulnerability Identification',
                'Exploitation',
                'Post-Exploitation',
                'Reporting',
                'Remediation & Retesting',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The lifecycle is methodical: understand the target, find entry points, validate them, document everything, and help the organization fix what was found.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Box Types: Black, White, and Gray',
          items: [
            {
              kind: 'table',
              headers: ['Type', 'Tester knowledge', 'Best for'],
              rows: [
                [
                  'Black-box',
                  'No prior information',
                  'Simulating an external attacker',
                ],
                [
                  'White-box',
                  'Full information (code, configs)',
                  'Finding the most issues efficiently',
                ],
                [
                  'Gray-box',
                  'Partial information',
                  'Balanced, realistic testing',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Internal vs External Testing',
          items: [
            {
              kind: 'bullets',
              items: [
                'External: from the internet, simulating an outside attacker.',
                'Internal: from inside the network, simulating a malicious insider or compromised host.',
                'Internal tests reveal what an attacker can reach after getting inside.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reconnaissance and Enumeration',
          items: [
            {
              kind: 'bullets',
              items: [
                'Reconnaissance: passively gathering information (DNS, metadata, public sources).',
                'Enumeration: actively discovering hosts, services, and accounts.',
                'Both build a map of the attack surface within scope.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vulnerability Identification',
          items: [
            {
              kind: 'bullets',
              items: [
                'Compare discovered services and versions against known weaknesses.',
                'Probe for misconfigurations and missing patches.',
                'Prioritize findings by likelihood and impact before exploiting.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Exploitation and Privilege Escalation (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Exploitation proves a vulnerability is real and measures its impact.',
                'Privilege escalation moves from limited to higher access.',
                'Every step is documented so the impact can be reproduced and fixed.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Exploitation is only performed within the authorized scope, on approved systems, to demonstrate impact — never to cause damage or steal data.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Post-Exploitation and Evidence',
          items: [
            {
              kind: 'bullets',
              items: [
                'Determine what an attacker who reached this point could access.',
                'Collect screenshots, logs, and steps as evidence.',
                'Document the full path so defenders understand the chain.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Tools (Conceptual)',
          items: [
            {
              kind: 'table',
              headers: ['Tool', 'Purpose'],
              rows: [
                ['Nmap', 'Network discovery and port/service enumeration'],
                [
                  'Burp Suite',
                  'Web application testing and request interception',
                ],
                ['OWASP ZAP', 'Web application security scanning'],
                [
                  'Metasploit',
                  'Framework for validating known vulnerabilities',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Tools support the methodology; they do not replace it. A tester reasons, plans, and documents — tools only execute parts of that plan.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Finding Severity and CVSS',
          items: [
            {
              kind: 'bullets',
              items: [
                'CVSS (Common Vulnerability Scoring System) rates severity with a 0–10 score.',
                'Severity reflects exploitability and impact, not just the vulnerability class.',
                'Ratings help the organization prioritize remediation.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reporting: Executive vs Technical',
          items: [
            {
              kind: 'table',
              headers: ['', 'Executive Report', 'Technical Report'],
              rows: [
                ['Audience', 'Leadership', 'Engineers and admins'],
                [
                  'Content',
                  'Risk, impact, priorities',
                  'Steps, evidence, technical detail',
                ],
                ['Length', 'Short, business-focused', 'Detailed and complete'],
                ['Purpose', 'Decision-making', 'Remediation'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Remediation and Retesting',
          items: [
            {
              kind: 'bullets',
              items: [
                'Each finding maps to a concrete fix.',
                'Remediation is prioritized by severity and business impact.',
                'Retesting confirms the fix actually closed the issue.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Professional Ethics',
          items: [
            {
              kind: 'bullets',
              items: [
                'Act only within the authorized scope.',
                'Handle discovered data with confidentiality.',
                'Report findings honestly without exaggeration.',
                'Do no harm: testing must not disrupt real operations.',
              ],
            },
          ],
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Authorization is non-negotiable',
          text: 'A penetration test without signed authorization is a computer crime. The document that defines scope and permission is the foundation of the entire engagement.',
          variant: 'warning',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A controlled engagement',
              description:
                'A company authorizes an external black-box test of one web application.',
              language: 'text',
              code:
                'Scope: webapp.example.test (staging, no production)\n' +
                'Allowed: recon, enumeration, vulnerability validation, reporting\n' +
                'Prohibited: production systems, denial of service, data exfiltration\n' +
                'Window: Saturday 00:00–06:00 UTC\n' +
                'Emergency contact: security-lead@example.test',
              output: '(a clear scope and rules of engagement)',
            },
            {
              title: 'A finding write-up',
              description: 'A validated finding with severity and remediation.',
              language: 'text',
              code:
                'Title: Missing authorization on invoice API\n' +
                'Severity: High (CVSS 8.1)\n' +
                'Finding: /invoice/{id} returns any invoice without an ownership check\n' +
                'Impact: any authenticated user can read others\u2019 invoices\n' +
                'Remediation: enforce object-level authorization on the server',
              output: '(what, why, impact, and fix in one place)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are the tester on a gray-box engagement of a web application. Do the following: (1) write a three-line scope statement, (2) classify these findings by severity (an IDOR exposing invoices; a missing security header; an unauthenticated admin endpoint) and justify each rating, (3) for the highest-severity finding, write a finding entry with title, severity, impact, and remediation, and (4) describe what retesting you would perform after the fix. Reason like a professional: separate likelihood from impact.',
          starterCode:
            '# 1. scope statement\n' +
            '# 2. severity classification + justification\n' +
            '# 3. finding write-up (title/severity/impact/remediation)\n' +
            '# 4. retest plan',
          language: 'text',
          hints: [
            'Severity = exploitability combined with impact, not just the bug type.',
            'A finding is only useful if it tells the owner how to fix it.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the fundamental difference between a vulnerability assessment and a penetration test?',
              options: [
                {
                  text: 'A penetration test proves exploitability; an assessment primarily finds and lists',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                { text: 'An assessment is always manual', isCorrect: false },
                {
                  text: 'A penetration test never uses tools',
                  isCorrect: false,
                },
              ],
              explanation:
                'An assessment finds and lists weaknesses; a penetration test validates and demonstrates their real impact.',
            },
            {
              question: 'Why are rules of engagement and scope critical?',
              options: [
                {
                  text: 'They define the legal boundary of what the tester may do',
                  isCorrect: true,
                },
                { text: 'They make the test faster', isCorrect: false },
                {
                  text: 'They remove the need for reporting',
                  isCorrect: false,
                },
                { text: 'They allow testing any system', isCorrect: false },
              ],
              explanation:
                'Scope and authorization define what is lawful to test; outside them, testing is unauthorized access.',
            },
            {
              question: 'Which box type gives the tester no prior information?',
              options: [
                { text: 'Black-box', isCorrect: true },
                { text: 'White-box', isCorrect: false },
                { text: 'Gray-box', isCorrect: false },
                { text: 'Closed-box', isCorrect: false },
              ],
              explanation:
                'Black-box testing simulates an external attacker with no inside knowledge.',
            },
            {
              question: 'What does privilege escalation aim to demonstrate?',
              options: [
                {
                  text: 'Whether an attacker can move from limited to higher access',
                  isCorrect: true,
                },
                { text: 'How to delete a database', isCorrect: false },
                { text: 'Network latency', isCorrect: false },
                { text: 'Password complexity', isCorrect: false },
              ],
              explanation:
                'Privilege escalation shows how far a validated foothold can be extended.',
            },
            {
              question: 'An executive report should focus on...',
              options: [
                {
                  text: 'Business risk, impact, and priorities',
                  isCorrect: true,
                },
                { text: 'Raw command output', isCorrect: false },
                { text: 'Exact exploit code', isCorrect: false },
                { text: 'Tool configuration details', isCorrect: false },
              ],
              explanation:
                'Executives need decisions: what is the risk, and what should we fix first.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Penetration testing is authorized, scoped, and evidence-driven.',
            'Authorization and rules of engagement are legal boundaries.',
            'The lifecycle runs from scoping through reporting and retesting.',
            'An assessment finds; a penetration test proves impact.',
            'Findings are rated (CVSS) and reported to both executives and engineers.',
            'Remediation and retesting close the loop.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 11. Malware Analysis
  // =====================================================================
  {
    nodeId: '15a63738-2e9f-4bb2-87e6-a945bd13181f',
    nodeTitle: 'Malware Analysis',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Malware analysis is the defensive discipline of understanding what a malicious program does, how it does it, and how to detect and stop it. Analysts study malware in an isolated environment so they can extract indicators and build detections without ever executing it on a real system.\n\n' +
            'This lesson covers malware categories, the malware lifecycle, static versus dynamic analysis, indicators of compromise, and the professional, safe workflow an analyst follows. You will learn to reason about behavior and evidence, not to write malware.\n\n' +
            'Everything here is defensive. You will analyze indicators and behaviors in controlled, hypothetical settings — never build or run real malware.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Malware Categories',
          items: [
            {
              kind: 'table',
              headers: ['Category', 'Behavior'],
              rows: [
                ['Virus', 'Attaches to files and spreads when they run'],
                ['Worm', 'Self-replicating across a network'],
                ['Trojan', 'Disguised as legitimate software'],
                ['Ransomware', 'Encrypts data and demands payment'],
                ['Spyware', 'Collects information covertly'],
                ['Rootkit', 'Hides its presence at a low level'],
                ['Bot', 'Controlled remotely as part of a botnet'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Malware Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: [
                'Delivery',
                'Execution',
                'Persistence',
                'Objective (C2 / theft / damage)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Delivery brings the malware in (email, download, exploit). Execution runs it. Persistence keeps it alive across reboots. The objective is what the attacker ultimately wants.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Static vs Dynamic Analysis',
          items: [
            {
              kind: 'table',
              headers: ['', 'Static Analysis', 'Dynamic Analysis'],
              rows: [
                ['Runs the code?', 'No', 'Yes (in a sandbox)'],
                [
                  'Examines',
                  'Hash, strings, imports, metadata',
                  'Processes, files, registry, network',
                ],
                ['Strength', 'Safe, fast, broad', 'Reveals actual behavior'],
                [
                  'Limit',
                  'Misses packed/obfuscated behavior',
                  'May not trigger all paths',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Static Analysis',
          items: [
            {
              kind: 'bullets',
              items: [
                'File hash: a fingerprint to identify and share the sample.',
                'Strings: human-readable text that hints at URLs, names, commands.',
                'Metadata: compile time, authors, and other attributes.',
                'Imports: the functions and libraries the program uses.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dynamic / Behavioral Analysis',
          items: [
            {
              kind: 'bullets',
              items: [
                'Processes: what the sample spawns or injects into.',
                'Filesystem: files it creates, modifies, or deletes.',
                'Registry: keys it changes (often for persistence).',
                'Network: connections and traffic it generates.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Persistence (Defensive View)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Persistence lets malware survive reboots (autostart, scheduled tasks, services).',
                'Analysts identify persistence so responders can remove it completely.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'This is described so you can recognize and remove persistence. It is not a guide to implanting it.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Safe Analysis Environment',
          items: [
            {
              kind: 'bullets',
              items: [
                'Isolate the sample in a sandbox or VM with no access to real networks.',
                'Use snapshots so you can revert after analysis.',
                'Assume every sample is live malware until proven otherwise.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Never execute a suspicious file on your real machine. Isolation is a safety requirement, not a preference.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Indicators of Compromise (IOCs)',
          items: [
            {
              kind: 'bullets',
              items: [
                'File hashes of known-malicious samples.',
                'Command-and-control domains and IPs.',
                'Registry keys and file paths used for persistence.',
                'Unusual process or network behavior.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reverse Engineering Concepts',
          items: [
            {
              kind: 'bullets',
              items: [
                'Disassembly: reading machine instructions as assembly.',
                'Debugging: stepping through execution to watch behavior.',
                'Ghidra: a tool for static reverse engineering.',
                'These are used to understand highly obfuscated samples.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'YARA and IOC Extraction',
          items: [
            {
              kind: 'bullets',
              items: [
                'YARA: a language for writing rules that match file characteristics.',
                'Analysts extract IOCs and turn them into detections.',
                'Detections are shared so the whole team can block the threat.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Monitoring',
          items: [
            {
              kind: 'bullets',
              items: [
                'Observe the sample\u2019s traffic in the sandbox.',
                'Look for command-and-control beacons and data exfiltration.',
                'Extract network IOCs for blocking and detection.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Detection Engineering and Reporting',
          items: [
            {
              kind: 'bullets',
              items: [
                'Convert findings into detection rules and signatures.',
                'Report what the malware does, how it persists, and how to remove it.',
                'Share IOCs and analysis with the wider team.',
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
              title: 'A benign toy sample profile',
              description: 'A hypothetical analysis of a suspicious file.',
              language: 'text',
              code:
                'SHA-256: 3f2a... (fictitious)\n' +
                'Strings: "backup.exe", "C:\\Temp\\data", "http://c2.example.test"\n' +
                'Imports: WriteFile, RegSetValue, WinExec\n' +
                'Behavior (sandbox): writes to C:\\Temp, adds a registry run key, beacons to c2.example.test',
              output: '(static + dynamic evidence together tell the story)',
            },
            {
              title: 'Classifying behavior from IOCs',
              description: 'Given the IOCs, what kind of malware is it?',
              language: 'text',
              code:
                'IOC: encrypts documents, drops a ransom note, uses strong crypto\n' +
                '→ classification: ransomware\n' +
                'IOC: remote commands, joins a network of infected hosts\n' +
                '→ classification: bot',
              output: '(behavior, not the file name, determines the category)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are analyzing a suspicious sample in an isolated sandbox. The evidence: the file creates a scheduled task, writes a DLL to C:\\ProgramData, and connects to 203.0.113.50 every 10 minutes. The strings contain "collect" and "upload". Do the following: (1) classify the likely malware category and justify it, (2) list the IOCs you would extract, (3) describe what you would check to confirm persistence, and (4) recommend the immediate containment actions. Do not write or run any code — reason from the evidence only.',
          starterCode:
            '# 1. classification + justification\n' +
            '# 2. IOCs to extract\n' +
            '# 3. persistence confirmation\n' +
            '# 4. containment actions',
          language: 'text',
          hints: [
            'Scheduled task + dropped DLL points to persistence.',
            'Regular outbound connections suggest command-and-control.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the key difference between static and dynamic analysis?',
              options: [
                {
                  text: 'Static does not run the code; dynamic executes it in a sandbox',
                  isCorrect: true,
                },
                { text: 'Static is faster than dynamic', isCorrect: false },
                { text: 'Dynamic never runs the code', isCorrect: false },
                { text: 'They are the same', isCorrect: false },
              ],
              explanation:
                'Static analysis inspects the file without executing it; dynamic analysis observes behavior during execution.',
            },
            {
              question:
                'A sample that encrypts files and demands payment is most likely...',
              options: [
                { text: 'Ransomware', isCorrect: true },
                { text: 'A worm', isCorrect: false },
                { text: 'Spyware', isCorrect: false },
                { text: 'A bot', isCorrect: false },
              ],
              explanation:
                'Encrypting data and demanding payment is the defining behavior of ransomware.',
            },
            {
              question:
                'Why must malware be analyzed in an isolated environment?',
              options: [
                {
                  text: 'To prevent it from affecting real systems or spreading',
                  isCorrect: true,
                },
                { text: 'To make it run faster', isCorrect: false },
                { text: 'To avoid antivirus', isCorrect: false },
                { text: 'Because it is required for YARA', isCorrect: false },
              ],
              explanation:
                'Isolation contains the sample so it cannot harm production systems or networks.',
            },
            {
              question: 'Which of these is an indicator of compromise (IOC)?',
              options: [
                {
                  text: 'A command-and-control domain contacted by the sample',
                  isCorrect: true,
                },
                { text: 'The analyst\u2019s username', isCorrect: false },
                { text: 'The sandbox version', isCorrect: false },
                { text: 'The compiler vendor', isCorrect: false },
              ],
              explanation:
                'IOCs are observable artifacts such as hashes, domains, and registry keys tied to malicious activity.',
            },
            {
              question: 'What is YARA used for?',
              options: [
                {
                  text: 'Writing rules to match malicious file characteristics',
                  isCorrect: true,
                },
                { text: 'Encrypting files', isCorrect: false },
                { text: 'Creating malware', isCorrect: false },
                { text: 'Running a sandbox', isCorrect: false },
              ],
              explanation:
                'YARA is a rule language for detecting malware by matching patterns.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Malware analysis is defensive and always isolated.',
            'Static analysis inspects files; dynamic analysis observes behavior.',
            'Persistence keeps malware alive; analysts find it to remove it.',
            'IOCs (hashes, domains, paths) power detection and blocking.',
            'Classify by behavior, not by file name.',
            'Analysis ends with detection engineering and a clear report.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 12. SOC Operations
  // =====================================================================
  {
    nodeId: '12df49f9-397d-4a73-8c0e-f3556fcdb3d7',
    nodeTitle: 'SOC Operations',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A Security Operations Center (SOC) is the team that monitors an organization\u2019s telemetry around the clock, turning raw logs into detections, detections into investigations, and investigations into response. The SOC\u2019s core loop is: alert, triage, investigate, escalate.\n\n' +
            'This lesson teaches how that loop works: the roles, the SIEM that centralizes logs, how detection rules fire, the difference between IOCs and IOAs, how threat hunting finds what rules miss, and the metrics that tell you if the SOC is actually working.\n\n' +
            'You will simulate analyst work by reasoning over toy log events — no external tools required.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SOC Roles',
          items: [
            {
              kind: 'table',
              headers: ['Role', 'Responsibility'],
              rows: [
                ['Tier 1', 'Monitor alerts, perform initial triage, escalate'],
                ['Tier 2', 'Deeper investigation and response'],
                [
                  'Tier 3',
                  'Threat hunting, detection engineering, advanced analysis',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The SOC Workflow',
          items: [
            {
              kind: 'flow',
              steps: [
                'Telemetry',
                'SIEM',
                'Detection Rule',
                'Alert',
                'Triage',
                'Investigation',
                'Escalation',
                'Response',
                'Closure',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Raw telemetry flows into the SIEM, rules raise alerts, analysts triage and investigate, and confirmed threats escalate to response before closure.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SIEM: Collection, Normalization, Correlation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Collection: gather logs from endpoints, network, auth, and cloud.',
                'Normalization: convert logs into a common schema.',
                'Correlation: link related events across sources.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Detection Rules and Alerts',
          items: [
            {
              kind: 'bullets',
              items: [
                'Rules match patterns in normalized logs.',
                'A good rule balances coverage with precision.',
                'Alerts are signals for a human to examine — not conclusions.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'False Positives vs False Negatives',
          items: [
            {
              kind: 'table',
              headers: ['', 'False Positive', 'False Negative'],
              rows: [
                ['Meaning', 'Alert on benign activity', 'Missed real threat'],
                [
                  'Effect',
                  'Alert fatigue, wasted time',
                  'Undetected compromise',
                ],
                [
                  'Fix',
                  'Tune rules, add context',
                  'Broaden coverage, threat hunt',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IOC vs IOA',
          items: [
            {
              kind: 'table',
              headers: ['', 'IOC', 'IOA'],
              rows: [
                [
                  'Stands for',
                  'Indicator of Compromise',
                  'Indicator of Attack',
                ],
                [
                  'Detects',
                  'Known-bad artifacts (hash, domain)',
                  'Attacker behavior (lateral movement, C2)',
                ],
                [
                  'Strength',
                  'High precision, known threats',
                  'Catches novel attacks',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Threat Intelligence and MITRE ATT&CK',
          items: [
            {
              kind: 'bullets',
              items: [
                'Threat intelligence provides context on adversaries and their techniques.',
                'MITRE ATT&CK is a framework of real-world adversary tactics and techniques.',
                'Mapping detections to ATT&CK reveals coverage gaps.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Threat Hunting',
          items: [
            {
              kind: 'bullets',
              items: [
                'Proactively search for threats that rules did not catch.',
                'Start from a hypothesis (a technique, a behavior) rather than an alert.',
                'Findings feed back into new detection rules.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Telemetry Sources',
          items: [
            {
              kind: 'table',
              headers: ['Source', 'What it tells you'],
              rows: [
                ['Endpoint (EDR)', 'Process, file, and registry activity'],
                ['Network', 'Connections and traffic patterns'],
                ['Authentication logs', 'Who logged in, from where, when'],
                ['Cloud logs', 'API calls and configuration changes'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SIEM vs EDR',
          items: [
            {
              kind: 'table',
              headers: ['', 'SIEM', 'EDR'],
              rows: [
                [
                  'Scope',
                  'Centralized logs across the org',
                  'Deep visibility on each endpoint',
                ],
                [
                  'Strength',
                  'Correlation across sources',
                  'Detailed process/host behavior',
                ],
                [
                  'Relationship',
                  'Aggregates and correlates',
                  'Feeds rich endpoint data into the SIEM',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Case Management and Evidence Preservation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Track every investigation in a case with notes and evidence.',
                'Preserve evidence in its original form for later analysis.',
                'A good case record makes escalation and handoff clean.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Escalation and Incident Handoff',
          items: [
            {
              kind: 'bullets',
              items: [
                'Escalate when an alert is confirmed as a real threat.',
                'Hand off with the full case context to incident response.',
                'Clear handoff prevents duplicated or dropped work.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SOC Metrics',
          items: [
            {
              kind: 'table',
              headers: ['Metric', 'Meaning', 'Why it matters'],
              rows: [
                ['MTTD', 'Mean time to detect', 'How fast threats are found'],
                [
                  'MTTR',
                  'Mean time to respond',
                  'How fast threats are handled',
                ],
                [
                  'Detection coverage',
                  'What techniques you can detect',
                  'Gaps attackers can hide in',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Alert Fatigue and Playbooks',
          items: [
            {
              kind: 'bullets',
              items: [
                'Too many false positives desensitize analysts and hide real alerts.',
                'Tune rules and deduplicate to keep signal high.',
                'Playbooks give analysts a consistent, repeatable response per alert type.',
              ],
            },
          ],
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Triage vs investigation',
          text: 'Triage is the fast first pass — is this alert worth more time? Investigation is the deeper work of confirming a threat and understanding its scope. Do not skip triage and jump straight to a full investigation for every alert.',
          variant: 'info',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A realistic SOC investigation (toy logs)',
              description: 'Three correlated events arrive in the SIEM.',
              language: 'text',
              code:
                '08:12  login success  user=alice  src=203.0.113.99  geo=US\n' +
                '08:14  login success  user=alice  src=198.51.100.7   geo=NL\n' +
                '08:20  data export    user=alice  volume=2GB  to=external\n' +
                '\n' +
                'Hypothesis: impossible travel + large egress = compromised account',
              output: '(correlation across sources turns noise into a signal)',
            },
            {
              title: 'False positive or real?',
              description: 'Deciding whether an alert needs escalation.',
              language: 'text',
              code:
                'Alert: failed logins x5 for user=alice\n' +
                'Context: alice is on leave, no known travel\n' +
                'Decision: escalate — the context makes it suspicious\n' +
                '\n' +
                'Alert: failed logins x5 for a printer account\n' +
                'Context: routine maintenance window\n' +
                'Decision: triage as likely false positive',
              output: '(context determines whether an alert escalates)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are a Tier 1 SOC analyst. Review these toy log events: (1) 03:00 login failure x10 for user=root from an internal subnet; (2) a workstation opening a connection to a known-bad domain; (3) a user downloading 3GB to a personal cloud drive at 02:00; (4) a normal login for user=bob at 09:00. For each: state whether you would escalate or close, explain your reasoning, and note what additional evidence would change your decision. Then describe one detection rule you would write based on what you learned.',
          starterCode:
            '# 1. event + escalate/close + reasoning + evidence needed\n' +
            '# 2. ...\n' +
            '# 3. ...\n' +
            '# 4. ...\n' +
            '# 5. one detection rule you would add',
          language: 'text',
          hints: [
            'Consider time, source, user, and what is normal.',
            'A known-bad domain is a strong IOC; a routine login is usually benign.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the correct order of the SOC workflow?',
              options: [
                {
                  text: 'Telemetry → SIEM → Detection → Alert → Triage → Investigation → Escalation → Response',
                  isCorrect: true,
                },
                {
                  text: 'Alert → Telemetry → SIEM → Response',
                  isCorrect: false,
                },
                { text: 'Investigation → Triage → Alert', isCorrect: false },
                { text: 'Detection → Escalation → Triage', isCorrect: false },
              ],
              explanation:
                'Raw telemetry is correlated in the SIEM, raising alerts that analysts triage and investigate before escalation.',
            },
            {
              question:
                'A rule flags benign activity as malicious. This is a...',
              options: [
                { text: 'False positive', isCorrect: true },
                { text: 'False negative', isCorrect: false },
                { text: 'True positive', isCorrect: false },
                { text: 'True negative', isCorrect: false },
              ],
              explanation:
                'A false positive is a benign event incorrectly flagged as a threat.',
            },
            {
              question: 'What is the difference between an IOC and an IOA?',
              options: [
                {
                  text: 'IOC is a known-bad artifact; IOA is attacker behavior',
                  isCorrect: true,
                },
                { text: 'They are the same thing', isCorrect: false },
                {
                  text: 'IOA is a file hash; IOC is a technique',
                  isCorrect: false,
                },
                { text: 'IOC only applies to cloud', isCorrect: false },
              ],
              explanation:
                'IOCs detect known artifacts; IOAs detect behavioral patterns, including novel attacks.',
            },
            {
              question:
                'Threat hunting differs from alert-driven monitoring because it...',
              options: [
                {
                  text: 'Starts from a hypothesis rather than an alert',
                  isCorrect: true,
                },
                { text: 'Never uses the SIEM', isCorrect: false },
                { text: 'Replaces detection rules', isCorrect: false },
                { text: 'Only runs at night', isCorrect: false },
              ],
              explanation:
                'Hunting proactively searches for threats that rules may have missed.',
            },
            {
              question: 'What does MTTD measure?',
              options: [
                { text: 'How fast threats are detected', isCorrect: true },
                { text: 'How fast threats are remediated', isCorrect: false },
                { text: 'Number of false positives', isCorrect: false },
                { text: 'Log volume', isCorrect: false },
              ],
              explanation:
                'MTTD (mean time to detect) measures detection speed; MTTR measures response speed.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The SOC turns telemetry into detections, investigations, and response.',
            'Triage is a fast first pass; investigation confirms the threat.',
            'IOCs detect known artifacts; IOAs detect behavior.',
            'Correlation across sources turns noise into signal.',
            'Tune rules to fight alert fatigue; hunt to find what rules miss.',
            'Metrics (MTTD/MTTR/coverage) tell you if the SOC is improving.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 13. Incident Response
  // =====================================================================
  {
    nodeId: '5001e87a-6822-4150-b2b2-6f94f921a358',
    nodeTitle: 'Incident Response',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Incident response is how an organization handles a security incident: detecting it, containing it, removing the threat, recovering, and learning so it does not happen again. It is a disciplined, evidence-driven process, not a scramble.\n\n' +
            'This lesson teaches the incident response lifecycle, how to classify and contain an incident, how evidence is preserved and analyzed, and how to communicate and learn from the experience. You will work a realistic tabletop exercise and reason through each phase.\n\n' +
            'Everything is hypothetical and defensive. No real systems or credentials are involved.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Incident vs Event',
          items: [
            {
              kind: 'bullets',
              items: [
                'An event is any observable occurrence (a login, a file change).',
                'An incident is an event that causes, or risks, harm to confidentiality, integrity, or availability.',
                'Not every alert is an incident; classification matters.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Incident Response Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: [
                'Preparation',
                'Detection & Analysis',
                'Containment',
                'Eradication',
                'Recovery',
                'Lessons Learned',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The lifecycle is a loop: lessons learned feeds back into preparation, making the next response faster and stronger.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Preparation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Define roles, contacts, and escalation paths before an incident.',
                'Build playbooks for common incident types.',
                'Ensure logging, tooling, and evidence-handling are ready.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Detection and Analysis',
          items: [
            {
              kind: 'bullets',
              items: [
                'Confirm the incident is real (avoid false positives).',
                'Determine scope: which systems, accounts, and data are affected.',
                'Build a timeline from correlated evidence.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Containment Strategies',
          items: [
            {
              kind: 'table',
              headers: ['Strategy', 'Goal', 'Example'],
              rows: [
                [
                  'Short-term',
                  'Stop the bleeding now',
                  'Isolate a host, revoke a session',
                ],
                [
                  'Long-term',
                  'Contain while preserving evidence',
                  'Segment the network, keep a copy for forensics',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Containment balances speed against preserving evidence: stop the harm without destroying what you need to investigate.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Eradication',
          items: [
            {
              kind: 'bullets',
              items: [
                'Remove the root cause: the malware, the backdoor, the misconfiguration.',
                'Confirm persistence mechanisms are gone.',
                'Apply the fix that prevents recurrence.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Recovery and Validation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Restore systems from trusted backups.',
                'Validate that systems are clean and functioning before returning to service.',
                'Monitor closely after recovery for signs the threat returned.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Lessons Learned / Post-Incident Review',
          items: [
            {
              kind: 'bullets',
              items: [
                'Review what happened, what worked, and what did not.',
                'Document root cause and missing controls.',
                'Turn findings into new detections, policies, and playbooks.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Incident Classification and Severity',
          items: [
            {
              kind: 'table',
              headers: ['Severity', 'Example'],
              rows: [
                ['Low', 'Minor policy violation'],
                ['Medium', 'Single-user account compromise'],
                ['High', 'Lateral movement or data exposure'],
                ['Critical', 'Ransomware, mass data exfiltration'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Incident Commander',
          items: [
            {
              kind: 'bullets',
              items: [
                'One person coordinates the response and decisions.',
                'They track tasks, timelines, and communication.',
                'Clear command prevents chaos during a crisis.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Evidence Preservation and Chain of Custody',
          items: [
            {
              kind: 'bullets',
              items: [
                'Preserve evidence in its original state.',
                'Chain of custody records who handled evidence, when, and why.',
                'Proper handling keeps evidence admissible and trustworthy.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'A broken chain of custody can invalidate evidence. Document every transfer and never alter the original.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Volatile vs Non-Volatile Evidence',
          items: [
            {
              kind: 'table',
              headers: ['', 'Volatile', 'Non-volatile'],
              rows: [
                [
                  'Examples',
                  'Memory, network state, running processes',
                  'Disk, logs, backups',
                ],
                ['Lifetime', 'Lost on power-off', 'Persists'],
                ['Collection order', 'Collect first', 'Collect after volatile'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Forensics: Memory, Disk, and Network',
          items: [
            {
              kind: 'bullets',
              items: [
                'Memory forensics: recover running processes, injected code, and encryption keys.',
                'Disk forensics: recover deleted files and artifacts.',
                'Network forensics: reconstruct sessions from captured traffic.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Timeline and Root Cause Analysis',
          items: [
            {
              kind: 'bullets',
              items: [
                'Correlate events into a single timeline.',
                'Root cause analysis finds the true origin, not just symptoms.',
                'The timeline answers what happened, when, and in what order.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Communication and Stakeholder Management',
          items: [
            {
              kind: 'bullets',
              items: [
                'Communicate clearly and on schedule to leadership and affected teams.',
                'Separate technical detail from business impact.',
                'Legal and compliance may require specific notifications.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Playbooks and Tabletop Exercises',
          items: [
            {
              kind: 'bullets',
              items: [
                'Playbooks give step-by-step guidance per incident type.',
                'Tabletop exercises rehearse the response without a real incident.',
                'Rehearsal exposes gaps in plans before a real crisis.',
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
              title: 'A tabletop exercise scenario',
              description: 'A suspicious account, described for analysis.',
              language: 'text',
              code:
                'Indicators:\n' +
                '  - login from two countries 15 minutes apart\n' +
                '  - a new MFA device registered\n' +
                '  - unusual cloud storage access\n' +
                '  - a large data transfer to an external service',
              output: '(classify, contain, investigate, recover, learn)',
            },
            {
              title: 'Containment decision',
              description: 'Weighing speed against evidence preservation.',
              language: 'text',
              code:
                'Fast: disable the account, revoke sessions, block the IP\n' +
                'Then: snapshot the affected systems before cleanup\n' +
                'Then: investigate the timeline and root cause',
              output: '(stop the harm first, then preserve and investigate)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'A company\u2019s employee account shows impossible-travel logins, a newly registered MFA device, unusual cloud access, and a large external data transfer. As the responder: (1) classify the incident and assign a severity with justification, (2) list the containment actions you would take immediately, (3) describe the evidence you would preserve and in what order (volatile first), (4) outline what you would investigate to determine scope and root cause, and (5) list three lessons-learned items you would document. Reason step by step — no real systems involved.',
          starterCode:
            '# 1. classification + severity + justification\n' +
            '# 2. immediate containment actions\n' +
            '# 3. evidence to preserve (volatile first)\n' +
            '# 4. investigation plan (scope + root cause)\n' +
            '# 5. three lessons learned',
          language: 'text',
          hints: [
            'Contain the account before investigating deeply.',
            'Preserve memory and network state before they are lost.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the difference between an event and an incident?',
              options: [
                {
                  text: 'An incident causes or risks harm; an event is any observable occurrence',
                  isCorrect: true,
                },
                { text: 'They are the same', isCorrect: false },
                { text: 'An event is always malicious', isCorrect: false },
                { text: 'An incident is always minor', isCorrect: false },
              ],
              explanation:
                'An incident is a subset of events that threatens confidentiality, integrity, or availability.',
            },
            {
              question: 'Why is volatile evidence collected first?',
              options: [
                {
                  text: 'It is lost when a system powers off',
                  isCorrect: true,
                },
                { text: 'It is larger than disk data', isCorrect: false },
                { text: 'It never changes', isCorrect: false },
                { text: 'It is not important', isCorrect: false },
              ],
              explanation:
                'Memory and network state disappear on power-off, so they must be captured before disk evidence.',
            },
            {
              question: 'The primary goal of the containment phase is to...',
              options: [
                {
                  text: 'Stop the harm while preserving evidence',
                  isCorrect: true,
                },
                { text: 'Delete all logs', isCorrect: false },
                { text: 'Rebuild systems immediately', isCorrect: false },
                { text: 'Notify the attacker', isCorrect: false },
              ],
              explanation:
                'Containment stops further damage while keeping enough evidence to investigate.',
            },
            {
              question: 'What does a chain of custody protect?',
              options: [
                {
                  text: 'The integrity and admissibility of evidence',
                  isCorrect: true,
                },
                { text: 'The network firewall', isCorrect: false },
                { text: 'Password strength', isCorrect: false },
                { text: 'Employee performance', isCorrect: false },
              ],
              explanation:
                'Chain of custody records who handled evidence and when, protecting its integrity.',
            },
            {
              question: 'Why are tabletop exercises valuable?',
              options: [
                {
                  text: 'They rehearse the response and reveal gaps without a real incident',
                  isCorrect: true,
                },
                { text: 'They replace real detection', isCorrect: false },
                { text: 'They only test IT skills', isCorrect: false },
                { text: 'They are only for compliance', isCorrect: false },
              ],
              explanation:
                'Tabletop exercises practice decision-making and surface weaknesses in plans before a real crisis.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Incident response follows a lifecycle: prepare, detect, contain, eradicate, recover, learn.',
            'Containment balances speed against evidence preservation.',
            'Collect volatile evidence before non-volatile.',
            'Preserve evidence and maintain a chain of custody.',
            'Root cause analysis and lessons learned prevent recurrence.',
            'Rehearse with tabletop exercises so the real response is not improvised.',
          ],
        },
      },
    ],
  },
];
