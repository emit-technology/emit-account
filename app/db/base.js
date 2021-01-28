"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var bignumber_js_1 = require("bignumber.js");
var constant = require("../common/constant");
var myPool = require('../db/mongodb');
var Base = /** @class */ (function () {
    function Base(dbName) {
        var _this = this;
        this.client = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.balance = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('balance')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.balanceRecords = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('balanceRecords')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.txInfo = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('txInfo')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.addressTx = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('addressTx')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.blockNum = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('blockNum')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.versions = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('versions')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.events = function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db(this.dbName).collection('events')];
                    case 1: 
                    // if (!client) {
                    //     client = await this.client();
                    // }
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.insertTxInfos = function (txInfos, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.txInfo(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.insertMany(txInfos, { session: session })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.insertTxInfo = function (hash, t) { return __awaiter(_this, void 0, void 0, function () {
            var client, session, err, timestamp_1, info_1, records_1, transactionResults, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1:
                        client = _a.sent();
                        session = client.startSession();
                        err = null;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 7]);
                        timestamp_1 = Math.ceil(Date.now() / 1000);
                        info_1 = {
                            fromAddress: t.from,
                            toAddress: [t.to],
                            gas: t.gas ? t.gas : "21000",
                            gasUsed: t.gas ? t.gas : "21000",
                            gasPrice: t.gasPrice ? t.gasPrice : "0x3b9aca00",
                            fee: t.feeValue ? t.feeValue : "0x" + new bignumber_js_1.default(t.gas ? t.gas : "21000").multipliedBy(new bignumber_js_1.default(t.gasPrice ? t.gasPrice : "0x3b9aca00")).toString(16),
                            feeCy: t.feeCy ? t.feeCy : "",
                            txHash: hash,
                            num: 0,
                            outs: [],
                            ins: [],
                            transactionIndex: "0x0",
                            contract: null,
                            timestamp: timestamp_1
                        };
                        records_1 = [];
                        [t.value].forEach(function (value) {
                            // if (value && new BigNumber(value).toNumber() > 0) {
                            records_1.push({
                                address: t.from,
                                currency: t.cy,
                                amount: new bignumber_js_1.default(value).multipliedBy(-1).toString(10),
                                type: types_1.TxType.OUT,
                                txHash: info_1.txHash,
                                num: 0,
                                timestamp: timestamp_1
                            });
                            records_1.push({
                                address: t.to,
                                currency: t.cy,
                                amount: new bignumber_js_1.default(value).toString(10),
                                type: types_1.TxType.IN,
                                txHash: info_1.txHash,
                                num: 0,
                                timestamp: timestamp_1
                            });
                            // }
                        });
                        return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.insertTxInfos([info_1], session, client)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.insertBalanceRecord(records_1, session, client)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, constant.mongo.eth.transactionOptions)];
                    case 3:
                        transactionResults = _a.sent();
                        if (transactionResults) {
                            console.log("The pending tx was successfully created.");
                        }
                        else {
                            console.log("The pending tx was intentionally aborted.");
                        }
                        return [3 /*break*/, 7];
                    case 4:
                        e_1 = _a.sent();
                        err = e_1;
                        console.error("The pending transaction was aborted due to an unexpected error: ", e_1);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, session.endSession()];
                    case 6:
                        _a.sent();
                        myPool.release(client);
                        return [7 /*endfinally*/];
                    case 7:
                        if (err) {
                            return [2 /*return*/, Promise.reject(err)];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        //balance
        this.insertBalanceRecord = function (records, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.balanceRecords(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.insertMany(records, { session: session })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.insertEvents = function (events, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.events(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.insertMany(events, { session: session })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.insertEventOne = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var client, db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.events(client)];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.insertOne(event)];
                    case 3:
                        _a.sent();
                        this.release(client);
                        return [2 /*return*/];
                }
            });
        }); };
        this.queryEvents = function (txHash, depositNonce, originChainID, resourceID, eventName) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, query, cursor, rests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.events(client)];
                    case 2:
                        db = _a.sent();
                        query = {};
                        if (txHash) {
                            query.txHash = txHash;
                        }
                        if (depositNonce) {
                            query["event.depositNonce"] = depositNonce;
                        }
                        if (originChainID) {
                            query["event.originChainID"] = originChainID;
                        }
                        if (resourceID) {
                            query["event.resourceID"] = resourceID;
                        }
                        if (eventName) {
                            query.eventName = eventName;
                        }
                        return [4 /*yield*/, db.find(query)];
                    case 3:
                        cursor = _a.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 4:
                        rests = _a.sent();
                        this.release(client);
                        return [2 /*return*/, rests];
                }
            });
        }); };
        this.eventExist = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, query, cursor, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.events(client)];
                    case 2:
                        db = _a.sent();
                        query = {};
                        if (txHash) {
                            query.txHash = txHash;
                        }
                        return [4 /*yield*/, db.find(query)];
                    case 3:
                        cursor = _a.sent();
                        return [4 /*yield*/, cursor.count()];
                    case 4:
                        count = _a.sent();
                        this.release(client);
                        return [2 /*return*/, count > 0];
                }
            });
        }); };
        this.queryBalanceRecords = function (address, currency, hash, pageSize, pageNo) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, query, cursor, count, rests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.balanceRecords(client)];
                    case 2:
                        db = _a.sent();
                        query = {};
                        if (address) {
                            query.address = address;
                        }
                        if (currency) {
                            query.currency = currency;
                        }
                        if (hash) {
                            query.txHash = { "$regex": hash };
                        }
                        return [4 /*yield*/, db.find(query, {
                                limit: pageSize,
                                skip: (pageNo - 1) * pageSize,
                                sort: { timestamp: -1 }
                            })];
                    case 3:
                        cursor = _a.sent();
                        return [4 /*yield*/, cursor.count()];
                    case 4:
                        count = _a.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 5:
                        rests = _a.sent();
                        this.release(client);
                        return [2 /*return*/, { total: count, data: rests, pageSize: pageSize, pageNo: pageNo }];
                }
            });
        }); };
        this.upsertBalance = function (record, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db, query, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.balance(client)];
                    case 1:
                        db = _a.sent();
                        query = { "address": record.address, "currency": record.currency };
                        return [4 /*yield*/, db.findOne(query, { session: session })];
                    case 2:
                        balance = _a.sent();
                        if (!balance) return [3 /*break*/, 4];
                        if (record.type == types_1.TxType.IN) {
                            balance.totalIn = new bignumber_js_1.default(balance.totalIn).plus(record.amount).toString(10);
                        }
                        else if (record.type == types_1.TxType.OUT) {
                            balance.totalOut = new bignumber_js_1.default(balance.totalOut).plus(record.amount).toString(10);
                        }
                        return [4 /*yield*/, db.updateOne(query, { "$set": balance }, { session: session })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        balance = {
                            address: record.address,
                            totalIn: record.type == types_1.TxType.IN ? record.amount : "0",
                            totalOut: record.type == types_1.TxType.OUT ? record.amount : "0",
                            totalFrozen: "0",
                            currency: record.currency
                        };
                        return [4 /*yield*/, db.insertOne(balance, { session: session })];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.updateBalance = function (balance, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db, query, balanceDB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.balance(client)];
                    case 1:
                        db = _a.sent();
                        query = { "address": balance.address, "currency": balance.currency };
                        return [4 /*yield*/, db.findOne(query, { session: session })];
                    case 2:
                        balanceDB = _a.sent();
                        if (!balanceDB) return [3 /*break*/, 4];
                        return [4 /*yield*/, db.updateOne(query, { "$set": balance }, { session: session })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, db.insertOne(balance, { session: session })];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.queryBalance = function (address, cy) { return __awaiter(_this, void 0, void 0, function () {
            var self, client, db, query, options, cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.balance(client)];
                    case 2:
                        db = _a.sent();
                        query = { address: address };
                        if (cy) {
                            query.currency = cy;
                        }
                        options = {
                            // "limit": 1,
                            // "skip": 0,
                            "sort": "address"
                        };
                        return [4 /*yield*/, db.find(query, options)];
                    case 3:
                        cursor = _a.sent();
                        // const count = await cursor.count()
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                cursor.toArray(function (err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(res);
                                    }
                                });
                                self.release(client);
                            })];
                }
            });
        }); };
        // tx
        this.insertAddressTx = function (addressTxs, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressTx(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.insertMany(addressTxs, { session: session })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.queryTxByAddress = function (address, currency, pageSize, pageNo) { return __awaiter(_this, void 0, void 0, function () {
            var client, db1, datas, query, cursor, _a, rests, txHashArr, _i, rests_1, d, db, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _c.sent();
                        return [4 /*yield*/, this.addressTx(client)];
                    case 2:
                        db1 = _c.sent();
                        datas = {};
                        query = {};
                        if (address) {
                            query.address = address;
                        }
                        if (currency) {
                            query.currency = currency;
                        }
                        return [4 /*yield*/, db1.find(query, {
                                limit: pageSize,
                                skip: (pageNo - 1) * pageSize,
                                sort: { num: 1 }
                            })];
                    case 3:
                        cursor = _c.sent();
                        _a = datas;
                        return [4 /*yield*/, cursor.count()];
                    case 4:
                        _a.total = _c.sent();
                        datas.pageSize = pageSize;
                        datas.pageNo = pageNo;
                        return [4 /*yield*/, cursor.toArray()];
                    case 5:
                        rests = _c.sent();
                        console.debug("queryTxByAddress>>", rests);
                        txHashArr = [];
                        for (_i = 0, rests_1 = rests; _i < rests_1.length; _i++) {
                            d = rests_1[_i];
                            txHashArr.push(d.txHash);
                        }
                        if (!(txHashArr.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.txInfo(client)];
                    case 6:
                        db = _c.sent();
                        _b = datas;
                        return [4 /*yield*/, db.find({ "txHash": { "$in": txHashArr } }, { sort: { num: -1 } }).toArray()];
                    case 7:
                        _b.txs = _c.sent();
                        _c.label = 8;
                    case 8:
                        this.release(client);
                        return [2 /*return*/, datas];
                }
            });
        }); };
        this.queryTxByHash = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, dbRecord, txInfo, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug(txHash, "queryTxByHash");
                        return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.txInfo(client)];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, this.balanceRecords(client)];
                    case 3:
                        dbRecord = _a.sent();
                        return [4 /*yield*/, db.findOne({ "txHash": txHash }, {
                                projection: {
                                    ins: 0,
                                    outs: 0,
                                    _id: 0
                                }
                            })];
                    case 4:
                        txInfo = _a.sent();
                        return [4 /*yield*/, dbRecord.find({
                                txHash: txHash
                            }, {
                                projection: {
                                    num: 0,
                                    timestamp: 0,
                                    txHash: 0,
                                    type: 0,
                                    _id: 0
                                }
                            }).toArray()];
                    case 5:
                        records = _a.sent();
                        if (records) {
                            txInfo.records = records;
                        }
                        this.release(client);
                        return [2 /*return*/, txInfo];
                }
            });
        }); };
        //block num
        this.upsertLatestBlock = function (num, timestamp, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blockNum(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.findOne({ "tag": "latest" }, { session: session })];
                    case 2:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        return [4 /*yield*/, db.updateOne({ "tag": "latest" }, { "$set": { num: num } }, { session: session })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, db.insertOne({ "tag": "latest", num: num }, { session: session })];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.latestBlock = function () { return __awaiter(_this, void 0, void 0, function () {
            var client, db, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.blockNum(client)];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.findOne({ "tag": "latest" })];
                    case 3:
                        rest = _a.sent();
                        this.release(client);
                        return [2 /*return*/, rest ? rest.num : 0];
                }
            });
        }); };
        this.removePendingTxByHash = function (hashArray, session, client) { return __awaiter(_this, void 0, void 0, function () {
            var db, dbRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.txInfo(client)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, this.balanceRecords(client)];
                    case 2:
                        dbRecord = _a.sent();
                        return [4 /*yield*/, db.deleteMany({ txHash: { "$in": hashArray }, num: 0 }, { session: session })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dbRecord.deleteMany({ txHash: { "$in": hashArray }, num: 0 }, { session: session })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getAppVersion = function (tag, versionNum) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, query, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.versions(client)];
                    case 2:
                        db = _a.sent();
                        query = {};
                        if (tag) {
                            query.tag = tag;
                        }
                        if (versionNum) {
                            query.num = versionNum;
                        }
                        return [4 /*yield*/, db.find(query, {
                                sort: { num: -1 }
                            }).toArray()];
                    case 3:
                        results = _a.sent();
                        this.release(client);
                        return [2 /*return*/, results];
                }
            });
        }); };
        this.countPendingTx = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
            var client, db, query, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, this.balanceRecords(client)];
                    case 2:
                        db = _a.sent();
                        query = {
                            address: address,
                            num: 0,
                            currency: currency
                        };
                        return [4 /*yield*/, db.find(query).count()];
                    case 3:
                        count = _a.sent();
                        this.release(client);
                        return [2 /*return*/, count];
                }
            });
        }); };
        this.dbName = dbName;
    }
    Base.prototype.release = function (client) {
        myPool.release(client);
    };
    return Base;
}());
exports.default = Base;
//# sourceMappingURL=base.js.map