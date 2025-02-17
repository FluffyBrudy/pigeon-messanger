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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const dbClient_1 = require("../../service/dbClient");
const constants_1 = require("../../validator/social/constants");
const constants_2 = require("../../controller/social/constants");
const authUtils_1 = require("../testUtils/authUtils");
const constants_3 = require("../../router/constants");
describe("Must return us", () => {
    const findFriendRoute = constants_3.API.ROOT + constants_3.SOCIAL.ROOT + constants_3.SOCIAL.FRIENDS_SEARCH;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.$connect();
        const users = [
            { username: "Sam", email: "apple@gmail.com", password: "Applefruit#12" },
            {
                username: "John",
                email: "banana@example.com",
                password: "Applefruit#12",
            },
            {
                username: "Emily",
                email: "cherry@test.com",
                password: "Applefruit#12",
            },
        ];
        const res = yield (0, authUtils_1.registerUsers)(users);
        expect(res === null || res === void 0 ? void 0 : res.length).toBe(users.length);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.user.deleteMany();
    }));
    test("Must return john on keyword starting with j with letter case ignored", () => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield (0, authUtils_1.loginUser)("apple@gmail.com", "Applefruit#12");
        expect(data.accessToken).not.toBeFalsy();
        const res = yield (0, supertest_1.default)(app_1.app)
            .post(findFriendRoute)
            .set("Authorization", `Bearer ${data.accessToken}`)
            .type("json")
            .send({ [constants_1.SEARCH_TERM]: "j", [constants_2.FILTER]: constants_2.UNKNOWN });
        expect(res.status).toBe(200);
    }));
});
