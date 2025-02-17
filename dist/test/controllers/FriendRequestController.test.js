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
const dbClient_1 = require("../../service/dbClient");
const authUtils_1 = require("../testUtils/authUtils");
const app_1 = require("../../app");
const constants_1 = require("../../validator/social/constants");
const constants_2 = require("../../router/constants");
describe("FriendRequest test", () => {
    const friendRequestRoute = constants_2.API.ROOT + constants_2.SOCIAL.ROOT + constants_2.SOCIAL.FRIEND_REQUEST;
    const pendingRequestsRoute = constants_2.API.ROOT + constants_2.SOCIAL.ROOT + constants_2.SOCIAL.PENDING_REQUESTS;
    const acceptRequestRoute = constants_2.API.ROOT + constants_2.SOCIAL.ROOT + constants_2.SOCIAL.ACCEPT_REQUEST;
    const sender = {
        username: "Sam",
        email: "apple@gmail.com",
        password: "Applefruit#12",
    };
    const recvr = {
        username: "ball",
        email: "ball@gmail.com",
        password: "Applefruit#12",
    };
    let id1, id2, accessToken1, accessToken2, friendshipId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.$connect();
        const users = [sender, recvr];
        const res = yield (0, authUtils_1.registerUsers)(users);
        expect(res.length).toBe(users.length);
        const login = yield (0, authUtils_1.loginUser)(sender.email, sender.password);
        const friendLogin = yield (0, authUtils_1.loginUser)(recvr.email, recvr.password);
        expect(login.data).toHaveProperty("id");
        expect(friendLogin.data).toHaveProperty("id");
        id1 = login.data.id;
        id2 = friendLogin.data.id;
        accessToken1 = login.data.accessToken;
        accessToken2 = login.data.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient_1.dbClient.user.deleteMany();
    }));
    test("Must give 200 status code after sending friend request ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .post(friendRequestRoute)
            .set("Authorization", `Bearer ${accessToken1}`)
            .type("json")
            .send({ [constants_1.FRIEND_ID]: id2 });
        expect(response.status).toBe(200);
    }));
    test("Must give 200 status code after pending friend request lookup", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .get(pendingRequestsRoute)
            .set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
    }));
    test("Must give 200 status code and truthy with data truthy boolean value", () => __awaiter(void 0, void 0, void 0, function* () {
        const respones = yield (0, supertest_1.default)(app_1.app)
            .post(acceptRequestRoute)
            .set("Authorization", `Bearer ${accessToken1}`)
            .type("json")
            .send({ [constants_1.FRIEND_ID]: id2 });
        console.log(accessToken1);
        expect(respones.status).toBe(200);
        expect(respones.body.data).toBeTruthy();
    }));
    test("Must give empty array as data after friend request accepted", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .get(pendingRequestsRoute)
            .set("Authorization", `Bearer ${accessToken1}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(0);
    }));
});
