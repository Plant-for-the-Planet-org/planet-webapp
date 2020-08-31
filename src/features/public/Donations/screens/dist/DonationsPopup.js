"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var ContactDetails_1 = require("../components/ContactDetails");
var PaymentDetails_1 = require("../components/PaymentDetails");
var ThankYou_1 = require("../components/ThankYou");
var TreeDonation_1 = require("../components/TreeDonation");
function DonationsPopup(_a) {
    var onClose = _a.onClose, project = _a.project;
    var _b = react_1["default"].useState(50), treeCount = _b[0], setTreeCount = _b[1];
    var _c = react_1["default"].useState(false), isGift = _c[0], setIsGift = _c[1];
    var _d = react_1["default"].useState(project.treeCost), treeCost = _d[0], setTreeCost = _d[1];
    var _e = react_1["default"].useState(), paymentSetup = _e[0], setPaymentSetup = _e[1];
    // for tax deduction part
    var _f = react_1["default"].useState(false), isTaxDeductible = _f[0], setIsTaxDeductible = _f[1];
    // modal for selecting currency
    var _g = react_1["default"].useState(project.currency), currency = _g[0], setCurrency = _g[1];
    var _h = react_1["default"].useState(localStorage.getItem('countryCode')), country = _h[0], setCountry = _h[1];
    var _j = react_1["default"].useState(''), paymentType = _j[0], setPaymentType = _j[1];
    // to get country and currency from local storage
    // React.useEffect(() => {
    //   async function loadData() {
    //     if (typeof Storage !== 'undefined') {
    //       if (localStorage.getItem('countryCode')) {
    //         setCountry(localStorage.getItem('countryCode'));
    //       }
    //     }
    //   }
    //   loadData();
    // }, []);
    //  to load payment data
    react_1["default"].useEffect(function () {
        function loadPaymentSetup() {
            return __awaiter(this, void 0, void 0, function () {
                var res, paymentSetupData, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch(process.env.API_ENDPOINT + "/app/projects/" + project.id + "/paymentOptions?country=" + country)];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            paymentSetupData = _a.sent();
                            if (paymentSetupData) {
                                setPaymentSetup(paymentSetupData);
                                setTreeCost(paymentSetupData.treeCost);
                                setCurrency(paymentSetupData.currency);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            console.log(err_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        loadPaymentSetup();
    }, [project, country]);
    var _k = react_1["default"].useState(4), donationStep = _k[0], setDonationStep = _k[1];
    var _l = react_1["default"].useState({
        firstName: '',
        lastName: '',
        email: '',
        giftMessage: ''
    }), giftDetails = _l[0], setGiftDetails = _l[1];
    var _m = react_1["default"].useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        companyName: ''
    }), contactDetails = _m[0], setContactDetails = _m[1];
    var TreeDonationProps = {
        project: project,
        onClose: onClose,
        treeCount: treeCount,
        setTreeCount: setTreeCount,
        isGift: isGift,
        setIsGift: setIsGift,
        treeCost: treeCost,
        paymentSetup: paymentSetup,
        isTaxDeductible: isTaxDeductible,
        setIsTaxDeductible: setIsTaxDeductible,
        currency: currency,
        setCurrency: setCurrency,
        country: country,
        setCountry: setCountry,
        setDonationStep: setDonationStep,
        giftDetails: giftDetails,
        setGiftDetails: setGiftDetails,
        paymentType: paymentType,
        setPaymentType: setPaymentType
    };
    var ContactDetailsProps = {
        treeCount: treeCount,
        treeCost: treeCost,
        currency: currency,
        setDonationStep: setDonationStep,
        contactDetails: contactDetails,
        setContactDetails: setContactDetails
    };
    var PaymentDetailsProps = {
        project: project,
        treeCount: treeCount,
        treeCost: treeCost,
        currency: currency,
        setDonationStep: setDonationStep,
        contactDetails: contactDetails,
        isGift: isGift,
        giftDetails: giftDetails,
        paymentSetup: paymentSetup,
        paymentType: paymentType,
        setPaymentType: setPaymentType
    };
    var ThankYouProps = {
        project: project,
        treeCount: treeCount,
        treeCost: treeCost,
        currency: currency,
        setDonationStep: setDonationStep,
        contactDetails: contactDetails,
        isGift: isGift,
        giftDetails: giftDetails,
        onClose: onClose,
        paymentType: paymentType
    };
    switch (donationStep) {
        case 1:
            return (react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    scale: [0.94, 1.05, 1]
                }, transition: { duration: 0.8 } },
                react_1["default"].createElement(TreeDonation_1["default"], __assign({}, TreeDonationProps))));
        case 2:
            return (react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    scale: [0.94, 1.04, 1]
                }, transition: { duration: 0.8 } },
                react_1["default"].createElement(ContactDetails_1["default"], __assign({}, ContactDetailsProps))));
        case 3:
            return (react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    scale: [0.94, 1.05, 1]
                }, transition: { duration: 0.8 } },
                react_1["default"].createElement(PaymentDetails_1["default"], __assign({}, PaymentDetailsProps))));
        case 4:
            return (react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    scale: [0.94, 1.04, 1],
                    rotate: [-15, 5, 0]
                }, transition: { duration: 0.8 } },
                react_1["default"].createElement(ThankYou_1["default"], __assign({}, ThankYouProps))));
        default:
            return (react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    scale: [0.94, 1.05, 1]
                }, transition: { duration: 0.8 } },
                react_1["default"].createElement(TreeDonation_1["default"], __assign({}, TreeDonationProps))));
    }
}
exports["default"] = DonationsPopup;
