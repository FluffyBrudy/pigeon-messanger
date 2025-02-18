"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrCancelPendingRequestValidation = exports.accetpFriendValidation = exports.addFriendValidation = exports.findFriendsValidator = void 0;
const validatorHelper_1 = require("../validatorHelper");
const constants_1 = require("./constants");
const validatorBody_1 = require("./validatorBody");
exports.findFriendsValidator = [
    (0, validatorHelper_1.idValidation)(constants_1.CURSOR, true),
    validatorBody_1.searchTermBody,
];
exports.addFriendValidation = [(0, validatorHelper_1.idValidation)(constants_1.FRIEND_ID)];
exports.accetpFriendValidation = exports.addFriendValidation;
exports.deleteOrCancelPendingRequestValidation = exports.addFriendValidation;
