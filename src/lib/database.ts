import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export interface Contact {
  id: string;
  name: string;
  type: string;
  password: string;
}

export interface AccessLog {
  date: string;
  id: string;
  name?: string;
  password: string;
  type: string;
}

export type AccessType = 'TeamViewer' | 'AnyDesk' | 'RDP' | 'RustDesk';

class Database {
  private db: any = null;

  async init() {
    if (this.db) return this.db;

    const dbPath = path.join(process.cwd(), 'contatos.db');
    
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await this.createTables();
    return this.db;
  }

  private async createTables() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS contatos (
        contato TEXT,
        id TEXT,
        tipo TEXT,
        password TEXT
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS acessos (
        data DATETIME,
        id TEXT,
        tipo TEXT,
        password TEXT
      )
    `);
  }

  async addContact(contact: Contact) {
    const db = await this.init();
    await db.run(
      'INSERT INTO contatos (contato, id, tipo, password) VALUES (?, ?, ?, ?)',
      [contact.name, contact.id, contact.type, contact.password]
    );
  }

  async updateContact(oldId: string, contact: Contact) {
    const db = await this.init();
    await db.run(
      'UPDATE contatos SET contato = ?, id = ?, tipo = ?, password = ? WHERE id = ?',
      [contact.name, contact.id, contact.type, contact.password, oldId]
    );
  }

  async deleteContact(id: string) {
    const db = await this.init();
    await db.run('DELETE FROM contatos WHERE id = ?', [id]);
  }

  async getContacts(): Promise<Contact[]> {
    const db = await this.init();
    const rows = await db.all('SELECT contato as name, id, tipo as type, password FROM contatos');
    return rows;
  }

  async logAccess(id: string, type: AccessType, password: string) {
    const db = await this.init();
    await db.run(
      'INSERT INTO acessos (data, id, tipo, password) VALUES (?, ?, ?, ?)',
      [new Date().toISOString(), id, type, password]
    );
  }

  async getAccessLogs(): Promise<AccessLog[]> {
    const db = await this.init();
    const rows = await db.all(`
      SELECT 
        ac.data as date,
        ct.contato as name,
        ac.id,
        ac.password,
        ac.tipo as type
      FROM acessos ac
      LEFT JOIN contatos ct ON ac.id = ct.id
      ORDER BY ac.data DESC
    `);
    return rows;
  }
}

export const database = new Database();

