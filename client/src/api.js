/**
 * API Service
 * 
 * Supports multiple backend types:
 * - REST API (default)
 * - Supabase
 * - Firebase
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BACKEND_TYPE = import.meta.env.VITE_BACKEND_TYPE || 'rest';

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let backendClient = null;

// Initialize backend client based on type
export const initializeBackend = async () => {
  switch (BACKEND_TYPE.toLowerCase()) {
    case 'supabase':
      return initializeSupabase();
    case 'firebase':
      return initializeFirebase();
    case 'rest':
    default:
      return null; // REST doesn't need client initialization
  }
};

// Supabase client initialization
const initializeSupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  backendClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized');
  return backendClient;
};

// Firebase client initialization
const initializeFirebase = async () => {
  const { initializeApp } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');
  
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  backendClient = { app, auth, db };
  console.log('Firebase client initialized');
  return backendClient;
};

// REST API methods
const restApi = {
  async getHealth() {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },

  async getUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`);
    return res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async updateUser(id, userData) {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Supabase API methods
const supabaseApi = {
  async getHealth() {
    const { data, error } = await backendClient.from('_ping').select('*').limit(1);
    if (error) throw error;
    return { status: 'ok' };
  },

  async getUsers() {
    const { data, error } = await backendClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getUser(id) {
    const { data, error } = await backendClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createUser(userData) {
    const { data, error } = await backendClient
      .from('users')
      .insert([{ ...userData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(id, userData) {
    const { data, error } = await backendClient
      .from('users')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteUser(id) {
    const { error } = await backendClient
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }
};

// Firebase API methods
const firebaseApi = {
  async getHealth() {
    const { db } = backendClient;
    await db.collection('_test').limit(1).get();
    return { status: 'ok' };
  },

  async getUsers() {
    const { db } = backendClient;
    const snapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    const users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    return users;
  },

  async getUser(id) {
    const { db } = backendClient;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async createUser(userData) {
    const { db } = backendClient;
    const ref = await db.collection('users').add({
      ...userData,
      createdAt: new Date().toISOString()
    });
    return { id: ref.id, ...userData };
  },

  async updateUser(id, userData) {
    const { db } = backendClient;
    await db.collection('users').doc(id).update({
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return true;
  },

  async deleteUser(id) {
    const { db } = backendClient;
    await db.collection('users').doc(id).delete();
    return { deleted: true };
  }
};

// Export API based on backend type
export const api = {
  initialize: initializeBackend,
  
  getHealth: async () => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.getHealth();
      case 'firebase': return firebaseApi.getHealth();
      default: return restApi.getHealth();
    }
  },

  getUsers: async () => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.getUsers();
      case 'firebase': return firebaseApi.getUsers();
      default: return restApi.getUsers();
    }
  },

  getUser: async (id) => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.getUser(id);
      case 'firebase': return firebaseApi.getUser(id);
      default: return restApi.getUser(id);
    }
  },

  createUser: async (userData) => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.createUser(userData);
      case 'firebase': return firebaseApi.createUser(userData);
      default: return restApi.createUser(userData);
    }
  },

  updateUser: async (id, userData) => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.updateUser(id, userData);
      case 'firebase': return firebaseApi.updateUser(id, userData);
      default: return restApi.updateUser(id, userData);
    }
  },

  deleteUser: async (id) => {
    switch (BACKEND_TYPE.toLowerCase()) {
      case 'supabase': return supabaseApi.deleteUser(id);
      case 'firebase': return firebaseApi.deleteUser(id);
      default: return restApi.deleteUser(id);
    }
  }
};

export const getBackendType = () => BACKEND_TYPE;