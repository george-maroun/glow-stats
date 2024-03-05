const getPastMonthValues = (input:number[]) => {
  if (input.length < 4) {
    return 0;
  }
  let pastMonthValue = 0;
  for (let i = input.length - 5; i < input.length - 1; i++) {
    pastMonthValue += Number(input[i]);
  }

  return pastMonthValue;
}

export default getPastMonthValues;