"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var constant = require("../common/constant");
var Eth = /** @class */ (function (_super) {
    __extends(Eth, _super);
    function Eth() {
        var _this = _super.call(this, constant.mongo.eth.name) || this;
        _this.dbName = "eth";
        return _this;
    }
    return Eth;
}(base_1.default));
exports.default = Eth;
//# sourceMappingURL=eth.js.map