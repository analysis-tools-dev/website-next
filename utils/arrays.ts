// check if array a contains array b
export function containsArray(a: any[], b: any[]) {
    return b.every((v) => a.includes(v));
}
