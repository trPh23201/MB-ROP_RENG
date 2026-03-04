import * as SQLite from 'expo-sqlite';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React from 'react';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  
  // Cart items table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      menu_item_id INTEGER DEFAULT 0,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      UNIQUE(user_id, store_id, product_id)
    );
  `);
  
  // Index for fast queries
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cart_user_store ON cart_items(user_id, store_id);
  `);
}

export function DatabaseProvider({ children }: React.PropsWithChildren) {
  return (
    <SQLiteProvider databaseName="ropreng.db" onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
}

export function useDb() {
  return useSQLiteContext();
}