"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEAK_PASSWOR_ERROR = exports.INVALID_EMAIL_FORMAT = exports.DOESNT_EXIST_ERROR = exports.MAX_PASSWORD_LENGTH = exports.MIN_PASSWORD_LENGTH = exports.MAX_USERNAME_LENGTH = exports.MIN_USERNAME_LENGTH = exports.EMAIL = exports.PASSWORD = exports.USERNAME = void 0;
// FIELDNAMES
exports.USERNAME = "username";
exports.PASSWORD = "password";
exports.EMAIL = "email";
// LENGTH
exports.MIN_USERNAME_LENGTH = 3;
exports.MAX_USERNAME_LENGTH = 50;
exports.MIN_PASSWORD_LENGTH = 8;
exports.MAX_PASSWORD_LENGTH = 16;
// MESSAGES
exports.DOESNT_EXIST_ERROR = "doesnt exist";
exports.INVALID_EMAIL_FORMAT = "Invalid email format";
exports.WEAK_PASSWOR_ERROR = "Weak password, password must contain at least one alphabet, number and symbol";
