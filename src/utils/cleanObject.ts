type ObjectValue =
  | number
  | string
  | boolean
  | GeneralArray
  | GeneralObject
  | undefined
  | null;

type GeneralObject = { [key: string]: ObjectValue };
type GeneralArray = Array<ObjectValue>;

/**
 * Removes all null, empty objects, empty strings, and undefined values from the object
 * while preserving the original type of the input
 */
function cleanObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const shouldRemove = (value: unknown) =>
    (value && typeof value === 'object' && !Object.keys(value).length) ||
    value === null ||
    value === undefined ||
    value === '';

  Object.entries(obj as GeneralObject).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      cleanObject(value);
    }
    if (shouldRemove(value)) {
      if (Array.isArray(obj)) {
        delete obj[Number(key)];
      } else {
        delete (obj as GeneralObject)[key];
      }
    }
  });

  // For arrays, we need to clean up the empty slots left by delete
  if (Array.isArray(obj)) {
    // Filter out empty slots and recreate the array
    const cleaned = obj.filter(() => true);
    obj.length = 0;
    obj.push(...cleaned);
  }

  return obj;
}

export default cleanObject;
