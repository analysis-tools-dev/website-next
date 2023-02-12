// check if array a contains array b
export function containsArray(a: any[], b: any[]) {
    return b.every((v) => a.includes(v));
}

// check if two arrays are equal. The order of the elements does not matter
export function arraysEqual(a: any[], b: any[]) {
    return containsArray(a, b) && containsArray(b, a);
}

// Remove a key from an array
// If the key is not found, the original array is returned
export const arrayDelete = (myArray: string[], key: string): string[] => {
    const index = myArray.indexOf(key, 0);
    if (index > -1) {
        myArray.splice(index, 1);
    }
    return myArray;
};
