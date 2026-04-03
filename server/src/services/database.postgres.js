/**
 * PostgreSQL Database Service
 * 
 * This is a placeholder for PostgreSQL-specific database operations.
 * Add your PostgreSQL queries and models here.
 */

import { getDb } from './database.js';

export const postgresService = {
  // User operations
  async createUser(userData) {
    const db = getDb();
    const { rows } = await db.query(
      'INSERT INTO users (name, email, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [userData.name, userData.email]
    );
    return rows[0];
  },

  async getUserById(id) {
    const db = getDb();
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },

  async getAllUsers() {
    const db = getDb();
    const { rows } = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  },

  async updateUser(id, userData) {
    const db = getDb();
    const { rows } = await db.query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [userData.name, userData.email, id]
    );
    return rows[0];
  },

  async deleteUser(id) {
    const db = getDb();
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return { deleted: true };
  },

  // Initialize database schema
  async initializeSchema() {
    const db = getDb();
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('PostgreSQL schema initialized');
  }
};