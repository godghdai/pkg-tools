function a(r : any, o : any) {
  for (var t = 0; t < o.length - 2; t += 3) {
    var a = o.charAt(t + 2);
    a = a >= "a"
      ? a.charCodeAt(0) - 87
      : Number(a),
    a = "+" === o.charAt(t + 1)
      ? r >>> a
      : r << a,
    r = "+" === o.charAt(t)
      ? r + a & 4294967295
      : r ^ a
  }
  return r
}

export function n(r : any, gtk : any) {
  var o = r.length;
  o > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(o / 2) - 5, 10) + r.substr(-10, 10));
  var t : any = void 0,
    n = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
  t = gtk || "320305.131321201";
  for (var e = t.split("."), h = Number(e[0]) || 0, i = Number(e[1]) || 0, d = [], f = 0, g = 0; g < r.length; g++) {
    var m = r.charCodeAt(g);
    128 > m
      ? d[f++] = m
      : (2048 > m
        ? d[f++] = m >> 6 | 192
        : (55296 === (64512 & m) && g + 1 < r.length && 56320 === (64512 & r.charCodeAt(g + 1))
          ? (m = 65536 + ((1023 & m) << 10) + (1023 & r.charCodeAt(++g)), d[f++] = m >> 18 | 240, d[f++] = m >> 12 & 63 | 128)
          : d[f++] = m >> 12 | 224, d[f++] = m >> 6 & 63 | 128), d[f++] = 63 & m | 128)
  }
  for (var S = h, u = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), l = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), s = 0; s < d.length; s++)
    S += d[s],
    S = a(S, u);
  return S = a(S, l),
  S ^= i,
  0 > S && (S = (2147483647 & S) + 2147483648),
  S %= 1e6,
  S.toString() + "." + (S ^ h)
}
