// polyfill for Object.values
const objectToValuesPolyfill = (object) => {
  return Object.keys(object).map(key => object[key]);
};
Object.values = Object.values || objectToValuesPolyfill;

// build a 'comparator' object for various comparison checks
const comparator = {
    '<': function(a, b) { return a < b; },
    '<=': function(a, b) { return a <= b; },
    '>': function(a, b) { return a > b; },
    '>=': function(a, b) { return a >= b; }
};

// helper function which compares a version to a range
function compareVersion(version: string, range: string) {
    const string = (range + '');
    const n = +(string.match(/\d+/) || NaN);
    const op = string.match(/^[<>]=?|/)[0];
    return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
}

// check for safari version
function safari(range: string, userAgent: string) {
  const match = userAgent.match(/version\/(\d+).+?safari/);
  return match !== null && compareVersion(match[1], range);
}

// check for samsung version
function samsung(range: string, userAgent: string) {
  const match = userAgent.match(/samsungbrowser\/(\d+)/);
  return match !== null && compareVersion(match[1], range);
}

export function browserNotCompatible() {
  const userAgent = (window.navigator.userAgent || '').toLowerCase();
  return safari('<13', userAgent) || samsung('<9', userAgent) || !Object.values || !window.Intl || !window.crypto;
}
