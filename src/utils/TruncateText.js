export function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

export function trimwords(str, num, readmore) {
  if (readmore) {
    return str;
  }
  const truncatedStr = str.slice(0, num);
  const period = truncatedStr.lastIndexOf(".");
  const comma = truncatedStr.lastIndexOf(",");
  if (str.length <= num) {
    return str;
  }
  const periodRes = truncatedStr.slice(0, period + 1);
  const commaRes = truncatedStr.slice(0, comma + 1);
  if (periodRes.length === 0 || commaRes.length === 0) {
    const truncatedStr1 = str.slice(num);
    const period = truncatedStr1.indexOf(".");
    const comma = truncatedStr1.indexOf(",");
    const periodRes = truncatedStr1.slice(0, period + 1);
    const commaRes = truncatedStr1.slice(0, comma + 1);
    if (periodRes.length < commaRes.length) {
      if (periodRes.length !== 0) {
        return truncatedStr + periodRes;
      }
      return truncatedStr + commaRes;
    }
    if (commaRes.length !== 0) {
      return truncatedStr + commaRes;
    }
    return truncatedStr + periodRes;
  }
  if (periodRes.length < commaRes.length) {
    return periodRes;
  }
  return commaRes;
}
