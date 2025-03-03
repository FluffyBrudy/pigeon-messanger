"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileSignature = void 0;
const imageClient_1 = require("../../service/imageClient");
const createProfileSignature = () => {
    return imageClient_1.imageClient.createSignature();
};
exports.createProfileSignature = createProfileSignature;
