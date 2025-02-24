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
exports.app = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const cors_1 = __importDefault(require("cors"));
const dbClient_1 = require("./service/dbClient");
const error_1 = require("./error/error");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const apiRouter_1 = require("./router/apiRouter");
const constants_1 = require("./router/constants");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
exports.app = app;
const expressSessionConfig = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "prod",
        httpOnly: process.env.NODE_ENV === "prod",
    },
});
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const strategy = new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbClient_1.dbClient.user.findUnique({
            where: { id: payload.id },
            select: { id: true, username: true },
        });
        if (!user)
            return done(new error_1.ApiError(404, "User"), false);
        else
            return done(null, user);
    }
    catch (error) {
        return done(new error_1.ApiError(505), false);
    }
}));
app.use((0, cors_1.default)((req, cb) => {
    const origin = req.headers["origin"];
    const frontendUrls = process.env.FRONTEND_URLS.split(",");
    if (!origin)
        cb(null, { origin: false, credentials: false });
    else if (frontendUrls.includes(origin))
        cb(null, { origin: true, credentials: true });
    else
        cb(null, { origin: true, credentials: false });
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(expressSessionConfig);
app.use(passport_1.default.session());
passport_1.default.use(strategy);
app.use(constants_1.API.ROOT, apiRouter_1.apiRouter);
app.use((0, errorMiddleware_1.errorMiddleware)());
if (process.env.NODE_ENV === "dev" && process.env.LOG_ENDPOINTS) {
    console.log(require("express-list-endpoints")(app));
}
