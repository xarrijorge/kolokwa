/**
 * Next.js Instrumentation API
 *
 * This file runs once when the Next.js server starts.
 * It's used to initialize database tables and seed initial data.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server-side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Check if DB credentials are available

    if (!process.env.TURSO_DB_URL || !process.env.TURSO_DB_TOKEN) {
      console.log(
        "⚠️  Database credentials not found in environment variables",
      );
      console.log(
        "⚠️  Skipping database initialization. Set TURSO_DB_URL and TURSO_DB_TOKEN to enable database features.",
      );
      return;
    }

    try {
      console.log("🚀 Initializing database...");

      const {
        ensureTables,
        ensureStaffTable,
        ensurePartnersTable,
        seedSuperAdmin,
        seedIfEmpty,
      } = await import("./lib/db/client");

      // Run all table migrations
      await ensureTables();
      await ensureStaffTable();
      await ensurePartnersTable();

      console.log("✅ Database tables created/verified");

      // Run seeders
      await seedSuperAdmin();
      await seedIfEmpty();

      console.log("✅ Database initialization complete");
    } catch (error: any) {
      console.error("❌ Database initialization failed:", error.message);

      if (error.message?.includes("401") || error.code === "SERVER_ERROR") {
        console.error(
          "💡 This appears to be an authentication error. Your database token may be expired or invalid.",
        );
        console.error(
          "💡 Please check your TURSO_DB_TOKEN in the .env file and regenerate if necessary.",
        );
      }

      // Don't throw - allow server to start even if DB init fails
      // This prevents crashes in dev mode or when DB credentials are invalid
    }
  }
}
