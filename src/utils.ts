export const removeUndefinedAndNulls = <T>(
  arr: (T | undefined | null)[],
): T[] => {
  return arr.filter((item): item is T => item != undefined);
};

export const removeDuplicatesInPlace = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
