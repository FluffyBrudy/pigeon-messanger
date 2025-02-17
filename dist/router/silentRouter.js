"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.silentRouter = void 0;
const express_1 = require("express");
const constants_1 = require("./constants");
const silentRouter = (0, express_1.Router)();
exports.silentRouter = silentRouter;
silentRouter.post(constants_1.SILENT.LOGIN, (req, res) => {
    const id = req.user.id;
    res.json({ data: { id } });
});
