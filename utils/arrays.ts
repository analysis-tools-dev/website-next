// check if an array contains another array
export const checkArraysIntersect = (superset: string[], subset: string[]) => {
    if (0 === subset.length) {
        return false;
    }
    return subset.every((value) => superset.includes(value));
};
