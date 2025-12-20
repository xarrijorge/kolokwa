/**
 * Turso / LibSQL helper client
 *
 * Exports:
 * - getClient(): returns a singleton libsql client
 * - ensureTables(): creates the `events` table if missing
 * - getEvents(), getEventById(), createEvent(), updateEvent(), deleteEvent()
 *
 * Environment variables required:
 * - TURSO_DB_URL
 * - TURSO_DB_TOKEN
 *
 * Notes:
 * - This file uses `@libsql/client`'s `createClient`. The client is lazily
 *   initialized and reused.
 * - `ensureTables()` is called by the CRUD helpers to make sure the table
 *   exists; this keeps first-time setup automatic. For production you may
 *   prefer to run an explicit migration instead.
 */

import { createClient } from "@libsql/client";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

type DbEvent = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null; // ISO string
  image?: string | null;
  tag?: string | null;
  created_at?: string | null;
};

let client: ReturnType<typeof createClient> | null = null;
let didEnsureTables = false;

function getClient() {
  if (client) return client;

  const url = process.env.TURSO_DB_URL;
  const authToken = process.env.TURSO_DB_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      "Turso DB environment variables not set. Please provide TURSO_DB_URL and TURSO_DB_TOKEN.",
    );
  }

  client = createClient({
    url,
    authToken,
  });

  return client;
}

/**
 * Create the events table if it doesn't exist.
 * Columns:
 * - id TEXT PRIMARY KEY
 * - title TEXT NOT NULL
 * - description TEXT
 * - date TEXT (ISO)
 * - image TEXT
 * - tag TEXT
 * - created_at TEXT
 */
export async function ensureTables() {
  if (didEnsureTables) return;
  const c = getClient();

  // Use a safe CREATE TABLE IF NOT EXISTS. The schema is intentionally small
  // and flexible for easy iteration.
  const createSql = `
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      image TEXT,
      tag TEXT,
      created_at TEXT
    );
  `;

  // The libsql client exposes `execute`. The signature differs between versions,
  // but calling `.execute(sql, params?)` is the common approach. We don't rely on
  // driver-specific features here beyond execute.
  await c.execute(createSql);
  didEnsureTables = true;
}

/**
 * Fetch all events, ordered by date (if present) then creation time.
 */
export async function getEvents(): Promise<DbEvent[]> {
  await ensureTables();
  const c = getClient();

  const sql = `
    SELECT id, title, description, date, image, tag, created_at
    FROM events
    ORDER BY
      CASE WHEN date IS NULL THEN 1 ELSE 0 END,
      date ASC,
      created_at ASC;
  `;
  const res = await c.execute(sql);
  // The result shape contains `rows` which is an array of objects.
  // Return as-is while ensuring type alignment.
  return res.rows ?? [];
}

/**
 * Fetch a single event by id.
 */
export async function getEventById(id: string): Promise<DbEvent | null> {
  await ensureTables();
  const c = getClient();

  const sql = `SELECT id, title, description, date, image, tag, created_at FROM events WHERE id = ? LIMIT 1`;
  const res = await c.execute(sql, [id]);
  const rows = res.rows ?? [];
  return rows.length ? rows[0] : null;
}

export type CreateEventInput = {
  title: string;
  description?: string;
  date?: string;
  image?: string;
  tag?: string;
};

/**
 * Create a new event. Returns the created event.
 */
export async function createEvent(input: CreateEventInput): Promise<DbEvent> {
  await ensureTables();
  const c = getClient();

  const id = randomUUID();
  const created_at = new Date().toISOString();

  const sql = `
    INSERT INTO events (id, title, description, date, image, tag, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await c.execute(sql, [
    id,
    input.title,
    input.description ?? null,
    input.date ?? null,
    input.image ?? null,
    input.tag ?? null,
    created_at,
  ]);

  return {
    id,
    title: input.title,
    description: input.description ?? null,
    date: input.date ?? null,
    image: input.image ?? null,
    tag: input.tag ?? null,
    created_at,
  };
}

export type UpdateEventInput = Partial<CreateEventInput> & { id: string };

/**
 * Update an event. Only provided fields will be updated.
 * Returns the updated row.
 */
export async function updateEvent(
  input: UpdateEventInput,
): Promise<DbEvent | null> {
  await ensureTables();
  const c = getClient();

  // Build a dynamic SET clause for only provided fields.
  const fields: string[] = [];
  const args: any[] = [];

  if (input.title !== undefined) {
    fields.push("title = ?");
    args.push(input.title);
  }
  if (input.description !== undefined) {
    fields.push("description = ?");
    args.push(input.description);
  }
  if (input.date !== undefined) {
    fields.push("date = ?");
    args.push(input.date);
  }
  if (input.image !== undefined) {
    fields.push("image = ?");
    args.push(input.image);
  }
  if (input.tag !== undefined) {
    fields.push("tag = ?");
    args.push(input.tag);
  }

  if (fields.length === 0) {
    // Nothing to update; return current record
    return getEventById(input.id);
  }

  const sql = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;
  args.push(input.id);

  await c.execute(sql, args);

  return getEventById(input.id);
}

/**
 * Delete an event by id. Returns true when rows were deleted.
 */
export async function deleteEvent(id: string): Promise<boolean> {
  await ensureTables();
  const c = getClient();

  const sql = `DELETE FROM events WHERE id = ?`;
  const res = await c.execute(sql, [id]);
  // Some clients return changes/rowsAffected; for simplicity fetch the row to confirm deletion.
  const exists = await getEventById(id);
  return exists === null;
}

/**
 * Simple helper that seeds the DB with a sample event if no events exist.
 * This is optional but useful on first-run demos.
 */
export async function seedIfEmpty() {
  await ensureTables();
  const events = await getEvents();
  if (events.length > 0) return;

  await createEvent({
    title: "Welcome: KoloKwa Launch",
    description:
      "Celebrating the launch of KoloKwa — building community and a tech ecosystem together.",
    date: new Date().toISOString(),
    image: "/images/cocktails.png",
    tag: "launch",
  });
}

/**
 * STAFF USERS helpers
 *
 * Adds a `staff_users` table and common CRUD helpers used by the admin/auth APIs.
 *
 * Columns:
 * - id TEXT PRIMARY KEY
 * - email TEXT UNIQUE NOT NULL
 * - password TEXT NOT NULL   -- NOTE: store hashed passwords in production
 * - role TEXT
 * - created_at TEXT
 */
export async function ensureStaffTable() {
  const c = getClient();
  const sql = `
    CREATE TABLE IF NOT EXISTS staff_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT,
      created_at TEXT
    );
  `;
  await c.execute(sql);

  // Create index on email for faster lookups (if not exists)
  const indexSql = `
    CREATE INDEX IF NOT EXISTS idx_staff_users_email ON staff_users(email);
  `;
  await c.execute(indexSql);
}

/**
 * Get a staff user by email
 */
export async function getStaffByEmail(email: string) {
  await ensureStaffTable();
  const c = getClient();
  const sql = `SELECT id, email, password, role, created_at FROM staff_users WHERE email = ? LIMIT 1`;
  const res = await c.execute(sql, [email]);
  const rows = res.rows ?? [];
  return rows.length ? rows[0] : null;
}

/**
 * Verify a password against a hashed password
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Create a new staff user (returns created user)
 * Automatically hashes the password using bcrypt before storing.
 */
export async function createStaff(input: {
  email: string;
  password: string;
  role?: string;
}) {
  await ensureStaffTable();
  const c = getClient();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  // Hash the password with bcrypt (salt rounds: 10)
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const sql = `
    INSERT INTO staff_users (id, email, password, role, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  await c.execute(sql, [
    id,
    input.email,
    hashedPassword,
    input.role ?? "staff",
    created_at,
  ]);
  return {
    id,
    email: input.email,
    role: input.role ?? "staff",
    created_at,
  };
}

/**
 * List staff users (minimal fields)
 */
export async function listStaff() {
  await ensureStaffTable();
  const c = getClient();
  const sql = `SELECT id, email, role, created_at FROM staff_users ORDER BY created_at DESC`;
  const res = await c.execute(sql);
  return res.rows ?? [];
}

/**
 * Delete a staff user by id
 */
export async function deleteStaff(id: string) {
  await ensureStaffTable();
  const c = getClient();
  await c.execute(`DELETE FROM staff_users WHERE id = ?`, [id]);
  const exists = await getStaffByEmail(id); // will return null, but we attempt to confirm
  // return true if row doesn't exist; best-effort check
  const check = await c.execute(
    `SELECT id FROM staff_users WHERE id = ? LIMIT 1`,
    [id],
  );
  return (check.rows ?? []).length === 0;
}

/**
 * Seed super admin user for production
 * Creates a super admin with email: cnah27@gmail.com
 * This should be called once on initial setup
 */
export async function seedSuperAdmin() {
  await ensureStaffTable();

  const superAdminEmail = "cnah27@gmail.com";
  const superAdminPassword = "xmas@2025";

  // Check if super admin already exists
  const existing = await getStaffByEmail(superAdminEmail);
  if (existing) {
    console.log("Super admin already exists, skipping seed.");
    return existing;
  }

  // Create super admin with hashed password
  const superAdmin = await createStaff({
    email: superAdminEmail,
    password: superAdminPassword,
    role: "admin",
  });

  console.log("Super admin created successfully:", superAdminEmail);
  return superAdmin;
}

/**
 * PARTNERS helpers
 *
 * Adds a `partners` table and simple helpers for creating/listing partners.
 *
 * Columns:
 * - id TEXT PRIMARY KEY
 * - name TEXT NOT NULL
 * - website TEXT
 * - logo TEXT   -- path or URL
 * - created_at TEXT
 */
export async function ensurePartnersTable() {
  const c = getClient();
  const sql = `
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      website TEXT,
      logo TEXT,
      created_at TEXT
    );
  `;
  await c.execute(sql);
}

/**
 * Create a partner
 */
export async function createPartner(input: {
  name: string;
  website?: string;
  logo?: string;
}) {
  await ensurePartnersTable();
  const c = getClient();
  const id = randomUUID();
  const created_at = new Date().toISOString();
  const sql = `
    INSERT INTO partners (id, name, website, logo, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  await c.execute(sql, [
    id,
    input.name,
    input.website ?? null,
    input.logo ?? null,
    created_at,
  ]);
  return {
    id,
    name: input.name,
    website: input.website ?? null,
    logo: input.logo ?? null,
    created_at,
  };
}

/**
 * List partners
 */
export async function listPartners() {
  await ensurePartnersTable();
  const c = getClient();
  const sql = `SELECT id, name, website, logo, created_at FROM partners ORDER BY created_at DESC`;
  const res = await c.execute(sql);
  return res.rows ?? [];
}

/**
 * Delete partner
 */
export async function deletePartner(id: string) {
  await ensurePartnersTable();
  const c = getClient();
  await c.execute(`DELETE FROM partners WHERE id = ?`, [id]);
  const check = await c.execute(
    `SELECT id FROM partners WHERE id = ? LIMIT 1`,
    [id],
  );
  return (check.rows ?? []).length === 0;
}
