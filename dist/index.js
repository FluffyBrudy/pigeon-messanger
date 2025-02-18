"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen(3000, () => {
    console.log("Listening at: http://localhost:3000");
});
exports.default = app_1.app;
