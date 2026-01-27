export interface Finding {
  id: string;
  category: 'phi' | 'encryption' | 'audit' | 'access' | 'retention';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  hipaaReference: string;
  remediation: string;
  matchedText: string;
}

interface Pattern {
  regex: RegExp;
  category: Finding['category'];
  severity: Finding['severity'];
  message: string;
  hipaaReference: string;
  remediation: string;
}

const patterns: Pattern[] = [
  // PHI Detection
  {
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    category: 'phi',
    severity: 'HIGH',
    message: 'Social Security Number pattern detected',
    hipaaReference: '§164.514',
    remediation: 'Remove hardcoded SSN. Use environment variables or secure storage.',
  },
  {
    regex: /\b\d{9}\b(?=.*ssn|.*social)/gi,
    category: 'phi',
    severity: 'MEDIUM',
    message: 'Potential SSN (9 consecutive digits near SSN keyword)',
    hipaaReference: '§164.514',
    remediation: 'Verify if this is a Social Security Number and remove if so.',
  },
  {
    regex: /\bMRN[:\s-]?\d{5,10}\b/gi,
    category: 'phi',
    severity: 'HIGH',
    message: 'Medical Record Number pattern detected',
    hipaaReference: '§164.514',
    remediation: 'Remove hardcoded MRN. Load from secure database.',
  },
  {
    regex: /\b(patient|user)\.?(ssn|socialSecurity|social_security)\b/gi,
    category: 'phi',
    severity: 'MEDIUM',
    message: 'PHI field access detected - ensure proper logging',
    hipaaReference: '§164.312(b)',
    remediation: 'Add audit logging when accessing PHI fields.',
  },
  {
    regex: /["']\d{4}-\d{2}-\d{2}["']|new Date\(["']\d{2}\/\d{2}\/\d{4}["']\)/g,
    category: 'phi',
    severity: 'LOW',
    message: 'Hardcoded date - may be PHI if birth/admission date',
    hipaaReference: '§164.514',
    remediation: 'Ensure this is not a patient birth date or admission date.',
  },
  {
    regex: /\b[A-Z]\d{2}(\.\d{1,4})?\b/g,
    category: 'phi',
    severity: 'LOW',
    message: 'Potential ICD-10 code pattern',
    hipaaReference: '§164.514',
    remediation: 'ICD-10 codes may be PHI when linked to patient data.',
  },

  // Encryption
  {
    regex: /createHash\s*\(\s*['"]md5['"]\s*\)/gi,
    category: 'encryption',
    severity: 'CRITICAL',
    message: 'MD5 hash algorithm is cryptographically broken',
    hipaaReference: '§164.312(a)(2)(iv)',
    remediation: 'Replace with SHA-256 or stronger: createHash("sha256")',
  },
  {
    regex: /createHash\s*\(\s*['"]sha1['"]\s*\)/gi,
    category: 'encryption',
    severity: 'HIGH',
    message: 'SHA-1 is deprecated and insecure',
    hipaaReference: '§164.312(a)(2)(iv)',
    remediation: 'Replace with SHA-256: createHash("sha256")',
  },
  {
    regex: /createCipheriv\s*\(\s*['"]des['"]/gi,
    category: 'encryption',
    severity: 'CRITICAL',
    message: 'DES encryption is broken',
    hipaaReference: '§164.312(a)(2)(iv)',
    remediation: 'Use AES-256-GCM: createCipheriv("aes-256-gcm", ...)',
  },
  {
    regex: /['"]http:\/\/(?!localhost|127\.0\.0\.1)[^'"]+['"]/gi,
    category: 'encryption',
    severity: 'HIGH',
    message: 'Unencrypted HTTP URL detected',
    hipaaReference: '§164.312(e)(1)',
    remediation: 'Use HTTPS for all external connections.',
  },
  {
    regex: /Math\.random\s*\(\s*\)/g,
    category: 'encryption',
    severity: 'MEDIUM',
    message: 'Math.random() is not cryptographically secure',
    hipaaReference: '§164.312(a)(2)(iv)',
    remediation: 'Use crypto.randomBytes() for security-sensitive operations.',
  },
  {
    regex: /aes-\d+-ecb/gi,
    category: 'encryption',
    severity: 'HIGH',
    message: 'ECB mode is insecure - patterns in data are preserved',
    hipaaReference: '§164.312(a)(2)(iv)',
    remediation: 'Use GCM or CBC mode: aes-256-gcm',
  },

  // Access Control
  {
    regex: /['"][a-zA-Z0-9_-]{20,}['"]\s*(?:;|,|\))/g,
    category: 'access',
    severity: 'CRITICAL',
    message: 'Potential hardcoded API key or secret',
    hipaaReference: '§164.312(d)',
    remediation: 'Move secrets to environment variables: process.env.API_KEY',
  },
  {
    regex: /password\s*[:=]\s*['"][^'"]+['"]/gi,
    category: 'access',
    severity: 'CRITICAL',
    message: 'Hardcoded password detected',
    hipaaReference: '§164.312(d)',
    remediation: 'Use environment variables for credentials.',
  },
  {
    regex: /cors\s*\(\s*\{\s*origin\s*:\s*['"]\*['"]/gi,
    category: 'access',
    severity: 'HIGH',
    message: 'CORS allows any origin - security risk',
    hipaaReference: '§164.312(a)(1)',
    remediation: 'Specify allowed origins explicitly.',
  },
  {
    regex: /\.get\s*\(\s*['"]\/api\/(patient|health|medical|record)/gi,
    category: 'access',
    severity: 'MEDIUM',
    message: 'PHI endpoint - verify authentication middleware',
    hipaaReference: '§164.312(a)(1)',
    remediation: 'Ensure authentication middleware is applied to PHI endpoints.',
  },
  {
    regex: /if\s*\(\s*(user|req\.user)\.email\s*===?\s*['"][^'"]+['"]\s*\)/gi,
    category: 'access',
    severity: 'MEDIUM',
    message: 'Hardcoded email check for authorization',
    hipaaReference: '§164.312(a)(1)',
    remediation: 'Use role-based access control instead of email checks.',
  },

  // Audit Logging
  {
    regex: /console\.(log|info|warn|error)\s*\([^)]*\b(patient|ssn|mrn|diagnosis)\b/gi,
    category: 'audit',
    severity: 'HIGH',
    message: 'PHI may be logged to console',
    hipaaReference: '§164.312(b)',
    remediation: 'Use a secure audit logger instead of console.log for PHI.',
  },
  {
    regex: /\.find(One|ById|Many)?\s*\(\s*\{[^}]*patient/gi,
    category: 'audit',
    severity: 'LOW',
    message: 'PHI database query - ensure audit logging',
    hipaaReference: '§164.312(b)',
    remediation: 'Add audit logging for PHI database access.',
  },

  // Data Retention
  {
    regex: /\.delete(One|Many)?\s*\(\s*\{[^}]*(patient|record|medical)/gi,
    category: 'retention',
    severity: 'MEDIUM',
    message: 'PHI deletion - ensure retention policy compliance',
    hipaaReference: '§164.530(j)',
    remediation: 'Use soft delete and verify 6-year retention requirement.',
  },
  {
    regex: /ON\s+DELETE\s+CASCADE/gi,
    category: 'retention',
    severity: 'HIGH',
    message: 'CASCADE DELETE may violate retention requirements',
    hipaaReference: '§164.530(j)',
    remediation: 'Use ON DELETE RESTRICT and implement soft deletes.',
  },
];

export function scanCode(code: string): Finding[] {
  const findings: Finding[] = [];
  const lines = code.split('\n');

  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

    while ((match = regex.exec(code)) !== null) {
      // Calculate line and column
      const beforeMatch = code.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const lastNewline = beforeMatch.lastIndexOf('\n');
      const column = match.index - lastNewline;

      // Calculate end position
      const matchEnd = match.index + match[0].length;
      const beforeEnd = code.substring(0, matchEnd);
      const endLine = beforeEnd.split('\n').length;
      const lastNewlineEnd = beforeEnd.lastIndexOf('\n');
      const endColumn = matchEnd - lastNewlineEnd;

      findings.push({
        id: `${pattern.category}-${match.index}`,
        category: pattern.category,
        severity: pattern.severity,
        message: pattern.message,
        line: lineNumber,
        column,
        endLine,
        endColumn,
        hipaaReference: pattern.hipaaReference,
        remediation: pattern.remediation,
        matchedText: match[0],
      });
    }
  });

  // Sort by line number
  findings.sort((a, b) => a.line - b.line);

  return findings;
}

export function getSeverityColor(severity: Finding['severity']): string {
  switch (severity) {
    case 'CRITICAL':
      return '#DC2626';
    case 'HIGH':
      return '#EA580C';
    case 'MEDIUM':
      return '#CA8A04';
    case 'LOW':
      return '#2563EB';
    default:
      return '#6B7280';
  }
}

export function getCategoryIcon(category: Finding['category']): string {
  switch (category) {
    case 'phi':
      return '🔐';
    case 'encryption':
      return '🔒';
    case 'audit':
      return '📋';
    case 'access':
      return '🔑';
    case 'retention':
      return '🗄️';
    default:
      return '⚠️';
  }
}
