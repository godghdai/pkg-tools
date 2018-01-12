//https://github.com/alsotang/is-chinese
const chineseRange = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
  [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
  [0x2a700, 0x2b73f], // CJK Unified Ideographs Extension C
  [0x2b740, 0x2b81f], // CJK Unified Ideographs Extension D
  [0x2b820, 0x2ceaf], // CJK Unified Ideographs Extension E
  [0xf900, 0xfaff], // CJK Compatibility Ideographs

  [0x3300, 0x33ff], // https://en.wikipedia.org/wiki/CJK_Compatibility
  [0xfe30, 0xfe4f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Forms
  [0xf900, 0xfaff], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
  [0x2f800, 0x2fa1f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs_Supplement
]

//https://github.com/mathiasbynens/String.prototype.codePointAt/blob/master/codepointat.js
function codePointAt(str:string,position:Number) {

  var size = str.length;
  // `ToInteger`
  var index = position ? Number(position) : 0;
  if (index != index) { // better `isNaN`
    index = 0;
  }
  // Account for out-of-bounds indices:
  if (index < 0 || index >= size) {
    return undefined;
  }
  // Get the first code unit
  var first = str.charCodeAt(index);
  var second;
  if ( // check if it’s the start of a surrogate pair
    first >= 0xD800 && first <= 0xDBFF && // high surrogate
    size > index + 1 // there is a next code unit
  ) {
    second = str.charCodeAt(index + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
};


export function isChinese(str:string) {

  var charCode;
  var flag;
  var range;

  for (var i = 0; i < str.length;) {
    charCode = codePointAt(str,i);
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
      i++
    } else {
      i += 2
    }
  }

  return true;
}
