/**
 * Firebase Database Service
 * 
 * This is a placeholder for Firebase-specific database operations.
 * Add your Firebase queries and models here.
 */

import { getDb } from './database.js';

export const firebaseService = {
  // User operations
  async createUser(userData) {
    const { db } = getDb();
    const userRef = await db.collection('users').add({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: userRef.id, ...userData };
  },

  async getUserById(id) {
    const { db } = getDb();
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async getAllUsers() {
    const { db } = getDb();
    const snapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  },

  async updateUser(id, userData) {
    const { db } = getDb();
    await db.collection('users').doc(id).update({
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return true;
  },

  async deleteUser(id) {
    const { db } = getDb();
    await db.collection('users').doc(id).delete();
    return { deleted: true };
  },

  // Initialize database schema (create indexes, etc.)
  async initializeSchema() {
    const { db } = getDb();
    
    // Note: Firebase indexes are managed through Firebase Console or firebase.json
    console.log('Firebase schema initialized (manage indexes via Firebase Console)');
  }
};