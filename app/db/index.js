"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tron = exports.eth = exports.sero = void 0;
var sero_1 = require("./sero");
var eth_1 = require("./eth");
var tron_1 = require("./tron");
var sero = new sero_1.default();
exports.sero = sero;
var eth = new eth_1.default();
exports.eth = eth;
var tron = new tron_1.default();
exports.tron = tron;
//# sourceMappingURL=index.js.map