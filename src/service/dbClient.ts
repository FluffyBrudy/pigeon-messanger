import { PrismaClient } from "@prisma/client";

class DBClient extends PrismaClient {
  constructor() {
    super();
  }
}

const dbClient = new DBClient();
export { dbClient };
