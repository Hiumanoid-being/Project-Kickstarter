/**
 * MongoDB Database Service
 * 
 * This is a placeholder for MongoDB-specific database operations.
 * Add your MongoDB queries and models here.
 */

import { getDb } from './database.js';

export const mongodbService = {
  // User operations
  async createUser(userData) {
    const { db } = getDb();
    const result = await db.collection('users').insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { _id: result.insertedId, ...userData };
  },

  async getUserById(id) {
    const { db } = getDb();
    const { ObjectId } = await import('mongodb');
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  },

  async getAllUsers() {
    const { db } = getDb();
    return await db.collection('users').find().sort({ createdAt: -1 }).toArray();
  },

  async updateUser(id, userData) {
    const { db } = getDb();
    const { ObjectId } = await import('mongodb');
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...userData, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  },

  async deleteUser(id) {
    const { db } = getDb();
    const { ObjectId } = await import('mongodb');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return { deleted: result.deletedCount > 0 };
  },

  // Initialize database schema (create indexes, etc.)
  async initializeSchema() {
    const { db } = getDb();
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    console.log('MongoDB schema initialized');
  }
};