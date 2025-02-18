"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = () => {
    const middleware = (error, req, res, next) => {
        res.status(error.status || 500).json({ error: error.message });
    };
    return middleware;
};
exports.errorMiddleware = errorMiddleware;
