"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//https://github.com/alsotang/is-chinese
const chineseRange = [
    [0x4e00, 0x9fff],
    [0x3400, 0x4dbf],
    [0x20000, 0x2a6df],
    [0x2a700, 0x2b73f],
    [0x2b740, 0x2b81f],
    [0x2b820, 0x2ceaf],
    [0xf900, 0xfaff],
    [0x3300, 0x33ff],
    [0xfe30, 0xfe4f],
    [0xf900, 0xfaff],
    [0x2f800, 0x2fa1f],
];
//https://github.com/mathiasbynens/String.prototype.codePointAt/blob/master/codepointat.js
function codePointAt(str, position) {
    var size = str.length;
    // `ToInteger`
    var index = position ? Number(position) : 0;
    if (index != index) {
        index = 0;
    }
    // Account for out-of-bounds indices:
    if (index < 0 || index >= size) {
        return undefined;
    }
    // Get the first code unit
    var first = str.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > index + 1 // there is a next code unit
    ) {
        second = str.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
    }
    return first;
}
;
function isChinese(str) {
    var charCode;
    var flag;
    var range;
    for (var i = 0; i < str.length;) {
        charCode = codePointAt(str, i);
        flag = false;
        for (var j = 0; j < chineseRange.length; j++) {
            range = chineseRange[j];
            if (charCode >= range[0] && charCode <= range[1]) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            return false;
        }
        if (charCode <= 0xffff) {
            i++;
        }
        else {
            i += 2;
        }
    }
    return true;
}
exports.isChinese = isChinese;
//# sourceMappingURL=chinese.js.map