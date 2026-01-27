export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
  expectedFindings: number;
}

export const examples: Example[] = [
  {
    id: 'phi-exposure',
    name: 'PHI Exposure',
    description: 'Code with hardcoded patient data',
    expectedFindings: 4,
    code: `// Patient service with PHI issues
const patientData = {
  name: "John Doe",
  ssn: "123-45-6789",
  mrn: "MRN12345678",
  dateOfBirth: "1985-03-15",
  diagnosis: "E11.9"
};

function getPatientSSN(patient) {
  // Logging PHI to console
  console.log("Fetching SSN for patient:", patient.ssn);
  return patient.ssn;
}

// Accessing PHI without audit logging
async function getPatientRecord(id) {
  const patient = await db.patients.findById(id);
  return patient;
}`,
  },
  {
    id: 'weak-encryption',
    name: 'Weak Encryption',
    description: 'Insecure cryptographic practices',
    expectedFindings: 5,
    code: `import crypto from 'crypto';

// HIPAA Violation: MD5 is cryptographically broken
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// HIPAA Violation: SHA-1 is deprecated
function hashData(data) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

// HIPAA Violation: DES is broken
function encryptPHI(data, key) {
  const cipher = crypto.createCipheriv('des', key, iv);
  return cipher.update(data, 'utf8', 'hex');
}

// HIPAA Violation: HTTP instead of HTTPS
const API_URL = "http://api.healthcare-provider.com/patients";

// HIPAA Violation: Weak random for tokens
function generateToken() {
  return Math.random().toString(36).substring(2);
}`,
  },
  {
    id: 'access-control',
    name: 'Access Control Issues',
    description: 'Authentication and authorization problems',
    expectedFindings: 5,
    code: `import express from 'express';
import cors from 'cors';

const app = express();

// HIPAA Violation: Allows any origin
app.use(cors({ origin: '*' }));

// HIPAA Violation: Hardcoded credentials
const DB_PASSWORD = "super_secret_password_123";
const API_KEY = "sk_live_abc123def456ghi789jkl";

// HIPAA Violation: Email-based authorization
function isAdmin(user) {
  if (user.email === 'admin@hospital.com') {
    return true;
  }
  return false;
}

// PHI endpoint - needs authentication check
app.get('/api/patients/:id', async (req, res) => {
  const patient = await db.patients.findById(req.params.id);
  res.json(patient);
});

// Another PHI endpoint without visible auth
app.get('/api/medical-records', async (req, res) => {
  const records = await db.records.findMany();
  res.json(records);
});`,
  },
  {
    id: 'data-retention',
    name: 'Data Retention Issues',
    description: 'Improper data lifecycle management',
    expectedFindings: 3,
    code: `// HIPAA requires 6-year retention of PHI

// HIPAA Violation: Hard delete of patient records
async function deletePatient(id) {
  await db.patients.deleteOne({ _id: id });
}

// HIPAA Violation: Bulk deletion without soft delete
async function cleanupOldRecords() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  await db.medical_records.deleteMany({
    createdAt: { $lt: oneYearAgo }
  });
}

// Database schema with cascade delete
const schema = \`
  CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis TEXT,
    created_at TIMESTAMP
  );
\`;`,
  },
  {
    id: 'compliant',
    name: 'Compliant Code',
    description: 'Example of HIPAA-compliant patterns',
    expectedFindings: 0,
    code: `import crypto from 'crypto';
import { auditLog } from './audit';

// HIPAA Compliant: Strong encryption
function encryptPHI(data: string, key: Buffer): EncryptedData {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    data: encrypted,
    tag: cipher.getAuthTag().toString('hex')
  };
}

// HIPAA Compliant: Proper password hashing
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// HIPAA Compliant: Audit logging for PHI access
async function getPatient(id: string, userId: string) {
  const patient = await db.patients.findById(id);

  await auditLog.create({
    action: 'PHI_ACCESS',
    resourceType: 'patient',
    resourceId: id,
    userId,
    timestamp: new Date()
  });

  return patient;
}

// HIPAA Compliant: HTTPS and environment variables
const API_URL = process.env.API_URL; // https://...
const API_KEY = process.env.API_KEY;

// HIPAA Compliant: Role-based access control
function hasAccess(user: User, permission: string): boolean {
  return user.roles.some(role =>
    permissions[role]?.includes(permission)
  );
}`,
  },
];
