export const checkArraysIntersect = (array1: string[], array2: string[]) => {
    if (!array1?.length || !array2?.length) {
        return 0;
    }
    const filteredArray = array1.filter((value) => array2.includes(value));
    return filteredArray.length;
};
