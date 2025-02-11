"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeeTier = exports.getFeeRates = exports.supportsSrmFeeDiscounts = void 0;
const tokens_and_markets_1 = require("./tokens_and_markets");
function supportsSrmFeeDiscounts(programId) {
    return tokens_and_markets_1.getLayoutVersion(programId) > 1;
}
exports.supportsSrmFeeDiscounts = supportsSrmFeeDiscounts;
function getFeeRates(feeTier) {
    if (feeTier === 1) {
        // SRM2
        return { taker: 0.002, maker: -0.0003 };
    }
    else if (feeTier === 2) {
        // SRM3
        return { taker: 0.0018, maker: -0.0003 };
    }
    else if (feeTier === 3) {
        // SRM4
        return { taker: 0.0016, maker: -0.0003 };
    }
    else if (feeTier === 4) {
        // SRM5
        return { taker: 0.0014, maker: -0.0003 };
    }
    else if (feeTier === 5) {
        // SRM6
        return { taker: 0.0012, maker: -0.0003 };
    }
    else if (feeTier === 6) {
        // MSRM
        return { taker: 0.001, maker: -0.0005 };
    }
    // Base
    return { taker: 0.0022, maker: -0.0003 };
}
exports.getFeeRates = getFeeRates;
function getFeeTier(msrmBalance, srmBalance) {
    if (msrmBalance >= 1) {
        return 6;
    }
    else if (srmBalance >= 1000000) {
        return 5;
    }
    else if (srmBalance >= 100000) {
        return 4;
    }
    else if (srmBalance >= 10000) {
        return 3;
    }
    else if (srmBalance >= 1000) {
        return 2;
    }
    else if (srmBalance >= 100) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.getFeeTier = getFeeTier;
//# sourceMappingURL=fees.js.map