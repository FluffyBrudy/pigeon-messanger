import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL!
    : process.env.DATABASE_URL!;

class DBClient extends PrismaClient {
  constructor() {
    super({ datasources: { db: { url: databaseUrl } } });
  }
}

const dbClient = new DBClient();
export { dbClient };
