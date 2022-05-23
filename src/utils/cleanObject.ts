// This function removes all the null,  empty objects, "" (empty string values), undefined values from the object

const cleanObject = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      cleanObject(value);
    }
    if (
      (value && typeof value === 'object' && !Object.keys(value).length) ||
      value === null ||
      value === undefined ||
      value === ''
    ) {
      if (Array.isArray(object)) {
        object.splice(key, 1);
      } else {
        delete object[key];
      }
    }
  });
  return object;
};

export default cleanObject;
