"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereum_1 = require("./ethereum/");
var sero_1 = require("./sero/");
var event_1 = require("./tron/event");
var gasTracker_1 = require("../api/gasTracker");
var constant = require("../common/constant");
var Threads = /** @class */ (function () {
    function Threads() {
        var _this = this;
        this.run = function () {
            _this.startSero();
            _this.startEth();
            _this.startGasTracker();
            _this.startSyncPendingEth();
            _this.startSyncPendingSero();
            _this.startTronEvent();
            _this.startTronEventApi();
        };
        this.startGasTracker = function () {
            gasTracker_1.default.gasTrackerCache().then(function () {
                console.info("gasTracker, sleep 5s...");
                setTimeout(function () {
                    _this.startGasTracker();
                }, _this.timeSyncBlock * 2);
            }).catch(function (e) {
                console.error("gasTracker err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startGasTracker();
                }, _this.timeSyncBlock * 2);
            });
        };
        this.startSero = function () {
            // this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO,177128)
            console.info("sero sync start...");
            _this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO, constant.THREAD_CONFIG.LIMIT.SERO).then(function () {
                console.info("sero sync end, sleep 5s...");
                setTimeout(function () {
                    _this.startSero();
                }, _this.timeSyncBlock);
            }).catch(function (e) {
                console.error("sero sync err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startSero();
                }, _this.timeSyncBlock);
            });
        };
        this.startEth = function () {
            console.info("eth sync start...");
            var begin = Date.now();
            _this.syncEth.syncTransactions(constant.THREAD_CONFIG.START_AT.ETH, constant.THREAD_CONFIG.LIMIT.ETH).then(function () {
                console.info("eth sync end, cost: " + Math.floor((Date.now() - begin) / 1000) + " seconds, sleep 5s");
                setTimeout(function () {
                    _this.startEth();
                }, _this.timeSyncBlock);
            }).catch(function (e) {
                console.error("eth sync err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startEth();
                }, _this.timeSyncBlock);
            });
        };
        this.startSyncPendingEth = function () {
            _this.syncEth.syncPendingTransactions().then(function () {
                setTimeout(function () {
                    _this.startSyncPendingEth();
                }, _this.timeSyncBlock);
            }).catch(function (e) {
                console.error("eth sync pending err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startSyncPendingEth();
                }, _this.timeSyncBlock);
            });
        };
        this.startSyncPendingSero = function () {
            _this.syncSero.syncPendingTransactions().then(function () {
                setTimeout(function () {
                    _this.startSyncPendingSero();
                }, _this.timeSyncBlock);
            }).catch(function (e) {
                console.error("sero sync pending err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startSyncPendingSero();
                }, _this.timeSyncBlock);
            });
        };
        this.startTronEvent = function () {
            _this.tronEvent.runByNum().then(function () {
                console.info("startTronEvent, sleep 5s...");
                setTimeout(function () {
                    _this.startTronEvent();
                }, _this.timeSyncBlock / 5000);
            }).catch(function (e) {
                console.error("startTronEvent err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startTronEvent();
                }, _this.timeSyncBlock / 5);
            });
        };
        this.startTronEventApi = function () {
            _this.tronEvent.runByEventApi().then(function () {
                console.info("startTronEventApi, sleep 5s...");
                setTimeout(function () {
                    _this.startTronEventApi();
                }, _this.timeSyncBlock * 2);
            }).catch(function (e) {
                console.error("startTronEventApi err: ", e, " restart 5s later...");
                setTimeout(function () {
                    _this.startTronEventApi();
                }, _this.timeSyncBlock);
            });
        };
        this.timeSyncBlock = 1000 * 5;
        this.syncSero = new sero_1.default();
        this.syncEth = new ethereum_1.default();
        this.tronEvent = new event_1.default();
    }
    return Threads;
}());
exports.default = Threads;
//# sourceMappingURL=index.js.map