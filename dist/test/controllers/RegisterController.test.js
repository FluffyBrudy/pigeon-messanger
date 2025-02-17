"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("../../controller/auth/constants");
const dbClient_1 = require("../../service/dbClient");
const constants_2 = require("../../router/constants");
describe("Register registerRoute", () => {
    const registerRoute = constants_2.API.ROOT + constants_2.AUTH.ROOT + constants_2.AUTH.REGISTER;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.$connect();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.user.deleteMany();
        yield dbClient_1.dbClient.$disconnect();
    }));
    test("Must return status 200 on creating user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post(registerRoute).type("json").send({
            username: "Sam",
            email: "apple@gmail.com",
            password: "Applefruit#12",
        });
        expect(res.status).toBe(200);
        expect(res.body.data).toBe(constants_1.USER_SUCCESSFULLY_CREATED);
    }));
    test("Must return status 400 on username less than 3 characters long", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post(registerRoute).type("json").send({
            username: "Sa",
            email: "apple@gmail.com",
            password: "Applefruit#12",
        });
        expect(res.status).toBe(400);
    }));
});
