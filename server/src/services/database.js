/**
 * Database Service
 * 
 * Supports multiple database backends:
 * - PostgreSQL (default)
 * - MongoDB
 * - Supabase
 * - Firebase
 */

const DB_TYPE = process.env.DB_TYPE || 'postgres';

let dbInstance = null;

export const initializeDatabase = async () => {
  console.log(`Initializing ${DB_TYPE} database...`);
  
  switch (DB_TYPE.toLowerCase()) {
    case 'postgres':
      return initializePostgres();
    case 'mongodb':
      return initializeMongoDB();
    case 'supabase':
      return initializeSupabase();
    case 'firebase':
      return initializeFirebase();
    default:
      throw new Error(`Unsupported database type: ${DB_TYPE}`);
  }
};

// PostgreSQL Implementation
const initializePostgres = async () => {
  const { Pool } = await import('pg');
  
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'app',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  // Test connection
  const client = await pool.connect();
  await client.query('SELECT NOW()');
  client.release();
  
  dbInstance = pool;
  console.log('PostgreSQL connected successfully');
  return pool;
};

// MongoDB Implementation
const initializeMongoDB = async () => {
  const { MongoClient } = await import('mongodb');
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/app';
  const client = new MongoClient(uri);
  
  await client.connect();
  const db = client.db();
  
  // Test connection
  await db.command({ ping: 1 });
  
  dbInstance = { client, db };
  console.log('MongoDB connected successfully');
  return dbInstance;
};

// Supabase Implementation
const initializeSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test connection
  const { data, error } = await supabase.from('_ping').select('*').limit(1);
  
  if (error && error.code !== 'PGRST102') {
    throw error;
  }
  
  dbInstance = supabase;
  console.log('Supabase connected successfully');
  return supabase;
};

// Firebase Implementation
const initializeFirebase = async () => {
  const admin = await import('firebase-admin');
  
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  const db = admin.firestore();
  
  // Test connection
  await db.collection('_test').limit(1).get();
  
  dbInstance = { admin, db };
  console.log('Firebase connected successfully');
  return dbInstance;
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
};

export const getDbType = () => DB_TYPE;