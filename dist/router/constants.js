"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SILENT = exports.PREFERENCE = exports.CHAT = exports.SOCIAL = exports.AUTH = exports.API = void 0;
var API;
(function (API) {
    API["ROOT"] = "/api";
})(API || (exports.API = API = {}));
var AUTH;
(function (AUTH) {
    AUTH["ROOT"] = "/auth";
    AUTH["REGISTER"] = "/register";
    AUTH["LOGIN"] = "/login";
})(AUTH || (exports.AUTH = AUTH = {}));
var SOCIAL;
(function (SOCIAL) {
    SOCIAL["ROOT"] = "/social";
    SOCIAL["FRIENDS_SEARCH"] = "/friends/search";
    SOCIAL["FRIEND_REQUEST"] = "/friends/requests";
    SOCIAL["PENDING_REQUESTS"] = "/friends/requests/pending";
    SOCIAL["ACCEPTED_REQUESTS"] = "/friends/requests/accepted";
    SOCIAL["ACCEPT_REQUEST"] = "/friends/requests/accept";
    SOCIAL["REJECT_REQUEST"] = "/friends/requests/reject";
    SOCIAL["FRIEND_SUGGESTION"] = "/friends/suggestion/";
})(SOCIAL || (exports.SOCIAL = SOCIAL = {}));
var CHAT;
(function (CHAT) {
    CHAT["ROOT"] = "/chat";
    CHAT["MESSAGE_CREATE"] = "/message/create";
    CHAT["MESSAGE_FETCH"] = "/message/fetch";
    CHAT["MESSAGE_SINGLE"] = "/message/fetch/latest";
})(CHAT || (exports.CHAT = CHAT = {}));
var PREFERENCE;
(function (PREFERENCE) {
    PREFERENCE["ROOT"] = "/preference";
    PREFERENCE["PREF_PROFILE_SIGNATURE"] = "/profile/signature";
    PREFERENCE["PREF_PROFILE_IMAGE"] = "/profile/image";
})(PREFERENCE || (exports.PREFERENCE = PREFERENCE = {}));
var SILENT;
(function (SILENT) {
    SILENT["ROOT"] = "/silent";
    SILENT["LOGIN"] = "/login";
})(SILENT || (exports.SILENT = SILENT = {}));
