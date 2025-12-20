declare module "@libsql/client" {
  /**
   * Options for creating a libsql / Turso client.
   */
  export interface CreateClientOptions {
    url: string
    auth?: {
      token?: string
      // some runtimes accept 'type' or other fields; keep flexible
      [key: string]: any
    }
    // Optional fetch or other runtime overrides
    fetch?: typeof fetch
    // Any additional implementation-specific options
    [key: string]: any
  }

  /**
   * Result of executing a SQL statement.
   * - `rows` is an array of objects for SELECT queries (each object maps column name -> value).
   * - `columns` is an array of column names in the same order as the rows.
   * - `rowsAffected` (or `changes`) and `lastInsertRowid` may be provided for DML.
   */
  export interface ExecuteResult<Row = any> {
    rows?: Row[]
    columns?: string[]
    // number of rows affected for insert/update/delete where provided
    rowsAffected?: number
    // last inserted row id (if provided by the driver)
    lastInsertRowid?: number
    // driver might use `changes` instead of rowsAffected
    changes?: number
    // raw driver-specific fields
    [key: string]: any
  }

  /**
   * A prepared statement wrapper, if the client supports prepare/step/finalize.
   */
  export interface PreparedStatement {
    bind: (params: any[] | Record<string, any>) => Promise<void>
    step: () => Promise<ExecuteResult>
    finalize: () => Promise<void>
  }

  /**
   * Client instance returned by `createClient`.
   * The actual libsql client exposes several methods; we include the common ones used
   * in server-side examples and keep the shape flexible to accommodate variations.
   */
  export interface Client {
    /**
     * Execute a SQL statement. For parameterized queries, provide `params`.
     * Returns a promise resolving to an ExecuteResult.
     */
    execute: (sql: string, params?: any[] | Record<string, any>) => Promise<ExecuteResult>

    /**
     * Run a statement without returning rows (some drivers provide `run`).
     */
    run?: (sql: string, params?: any[] | Record<string, any>) => Promise<ExecuteResult>

    /**
     * Fetch a single row / value (optional helper).
     */
    get?: (sql: string, params?: any[] | Record<string, any>) => Promise<any>

    /**
     * Prepare a statement for repeated execution (if supported).
     */
    prepare?: (sql: string) => Promise<PreparedStatement>

    /**
     * Close the client / release resources (if supported).
     */
    close?: () => Promise<void> | void

    /**
     * Execute a batch of statements (some clients expose this).
     */
    batch?: (sqls: string[] | { sql: string; params?: any[] }[]) => Promise<ExecuteResult[]>

    // any additional driver-specific methods
    [key: string]: any
  }

  /**
   * Create and return a libsql client.
   *
   * Example:
   *   import { createClient } from "@libsql/client"
   *   const client = createClient({ url: process.env.TURSO_DB_URL, auth: { token: process.env.TURSO_DB_TOKEN }})
   */
  export function createClient(opts: CreateClientOptions): Client

  // Provide a default export for older usage patterns if necessary
  export default createClient
}
