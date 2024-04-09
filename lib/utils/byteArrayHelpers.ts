export function byteArrToStr(byteArr:number[]): string {
  return byteArr.map((b: number) => b.toString(16).padStart(2, '0')).join('');;
}

export function convertByteArrayStringToArray(byteArrayString: string): number[]{
  // Remove the square brackets and split the string into an array of strings
  const byteStringArray = byteArrayString.slice(1, -1).split(' ');
  // Map each string in the array to a number and filter out any empty strings
  const byteArray = byteStringArray
    .filter(byte => byte.trim() !== '')
    .map(byte => parseInt(byte, 10))
  return byteArray;
}

export function invertObject(obj: Record<string, string>): Record<string, string> {
  if (!obj) {
    return {};
  }
  const invertedObject: Record<string, string> = {};
  Object.entries(obj).forEach(([key, value]) => {
    const byteArr = convertByteArrayStringToArray(key)
    invertedObject[value] = byteArrToStr(byteArr);
  });
  return invertedObject;
}
