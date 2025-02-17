"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbClient = void 0;
const client_1 = require("@prisma/client");
const databaseUrl = process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;
class DBClient extends client_1.PrismaClient {
    constructor() {
        super({ datasources: { db: { url: databaseUrl } } });
    }
}
const dbClient = new DBClient();
exports.dbClient = dbClient;
