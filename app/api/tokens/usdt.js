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
var ierc20_1 = require("./ierc20");
var constant = require("../../common/constant");
var Usdt = /** @class */ (function (_super) {
    __extends(Usdt, _super);
    function Usdt() {
        var _this = _super.call(this, constant.TOKEN_ADDRESS.USDT) || this;
        _this.address = "";
        _this.address = constant.TOKEN_ADDRESS.USDT;
        return _this;
    }
    return Usdt;
}(ierc20_1.default));
exports.default = Usdt;
//# sourceMappingURL=usdt.js.map