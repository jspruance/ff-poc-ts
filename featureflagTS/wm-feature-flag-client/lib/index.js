/**
 * @module wm-feature-flag-client
 */
/**
 * Copyright (c) Warner Media. All rights reserved.
 */
'use strict';
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
var crypto = require("crypto");
var uuid_1 = require("uuid");
var winston = require("winston");
var logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});
var FeatureFlagClient = /** @class */ (function () {
    function FeatureFlagClient(userId, appId, config) {
        this.appId = appId;
        this.config = config;
        this.userId = userId;
    }
    FeatureFlagClient.prototype.createHash = function (userId, salt) {
        var hash = crypto.createHmac('sha256', salt);
        hash.update(userId);
        var hashValue = hash.digest('hex');
        return hashValue;
    };
    FeatureFlagClient.prototype.createUserId = function () {
        var userId = uuid_1.v4();
        return userId;
    };
    FeatureFlagClient.prototype.getUserFeatureIndex = function (hash) {
        var hashSegment = parseInt(hash.slice(-2), 16);
        return hashSegment.toString().slice(-2);
    };
    FeatureFlagClient.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        if (!this.config) return [3 /*break*/, 1];
                        _b = this.config;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.loadConfig()];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        _a.config = _b;
                        this.userId = this.userId ? this.userId : this.createUserId();
                        return [2 /*return*/];
                }
            });
        });
    };
    FeatureFlagClient.prototype.loadConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // placeholder for fetching of the app's feature config file from AWS S3
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var testConfig = require('../config/app-a.json');
                        setTimeout(function () { return resolve(testConfig); }, 300);
                    })];
            });
        });
    };
    FeatureFlagClient.prototype.queryFeature = function (featureName) {
        var featureConfig = this.config.features.filter(function (feature) { return feature.name === featureName; });
        var saltKey = featureConfig[0].saltKey;
        var hash = this.createHash(this.userId, saltKey);
        var userFeatureIndex = this.getUserFeatureIndex(hash);
        var enabled = (parseInt(userFeatureIndex, 10) < featureConfig[0].rolloutRate) ? true : false;
        // logging for demo only
        console.log("\n" + featureConfig[0].name);
        console.log("rollout rate: " + featureConfig[0].rolloutRate);
        console.log("user feature index: " + userFeatureIndex);
        return {
            featureName: featureConfig[0].name,
            enabled: enabled,
            userId: this.userId
        };
    };
    FeatureFlagClient.prototype.queryAllFeatures = function () {
        var _this = this;
        var featureFlagResultsMap = [];
        this.config.features.map(function (feature) {
            var featureFlagData = _this.queryFeature(feature.name);
            featureFlagResultsMap.push(featureFlagData);
        });
        return featureFlagResultsMap;
    };
    return FeatureFlagClient;
}());
exports.FeatureFlagClient = FeatureFlagClient;
