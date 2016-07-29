import constant from "./constant";

export function interpolateNumber(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}

export function interpolateRound(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
}

export function interpolateValue(a, b) {
  var t = typeof b, c;
  if (t === "number" && !isNaN(b)) return interpolateNumber(a, b)
  else return constant(b)
}
