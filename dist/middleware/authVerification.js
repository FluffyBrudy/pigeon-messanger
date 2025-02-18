"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const error_1 = require("../error/error");
const verifyAuth = () => {
    const middleware = (req, res, next) => {
        return passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err)
                return next(err);
            if (!user) {
                return next(new error_1.ApiError(401, "User"));
            }
            req.user = user;
            next();
        })(req, res, next);
    };
    return middleware;
};
exports.verifyAuth = verifyAuth;
