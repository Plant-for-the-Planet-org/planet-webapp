// polyfill for Object.values
const objectToValuesPolyfill = (object: Record<string, unknown>) => {
  return Object.keys(object).map((key) => object[key]);
};
Object.values = Object.values || objectToValuesPolyfill;

// build a 'comparator' object for various comparison checks
const comparator: { [key: string]: (a: number, b: number) => boolean } = {
  '<': function (a: number, b: number) {
    return a < b;
  },
  '<=': function (a: number, b: number) {
    return a <= b;
  },
  '>': function (a: number, b: number) {
    return a > b;
  },
  '>=': function (a: number, b: number) {
    return a >= b;
  },
};

// helper function which compares a version to a range
function compareVersion(version: string, range: string) {
  const string = range + '';
  const n = +(string.match(/\d+/) || NaN);
  const matchOp = string.match(/^[<>]=?|/);
  const op = matchOp ? matchOp[0] : '';
  const versionNumber = parseFloat(version); // Convert version to a number

  return comparator[op]
    ? comparator[op](versionNumber, n)
    : versionNumber === n || n !== n;
}
// check for safari version, but not if Android device
function safari(range: string, userAgent: string) {
  const match = userAgent.match(/version\/(\d+).+?safari/);
  const matchAndroid = userAgent.match(/android/);
  return (
    match !== null && matchAndroid === null && compareVersion(match[1], range)
  );
}

// check for samsung version
function samsung(range: string, userAgent: string) {
  const match = userAgent.match(/samsungbrowser\/(\d+)/);
  return match !== null && compareVersion(match[1], range);
}

export function browserNotCompatible() {
  const userAgent = (window.navigator.userAgent || '').toLowerCase();
  return (
    safari('<13', userAgent) ||
    samsung('<9', userAgent) ||
    !Object.values ||
    !window.Intl ||
    !window.crypto
  );
}
