export const formatValue = (num: number | undefined, precision: number = 3, currency: boolean = false) => {
  if (!num) return 'N/A';
  const prefix = currency ? '$' : '';
  if (num >= 1e9) {
    return precision === 0
      ? `${prefix}${Math.round(num / 1e9)} GWh`
      : `${prefix}${(num / 1e9).toPrecision(precision)} GWh`;
  } else if (num >= 1e6) {
    return precision === 0
      ? `${prefix}${Math.round(num / 1e6)} MWh`
      : `${prefix}${(num / 1e6).toPrecision(precision)} MWh`;
  } else if (num >= 1e3){
    return precision === 0
      ? `${prefix}${Math.round(num / 1e3)} kWh`
      : `${prefix}${(num / 1e3).toPrecision(precision)} kWh`;
  } else if (num >= 1000) {
    return `${prefix}${num.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh`;
  } else {
    return precision === 0
      ? `${prefix}${Math.round(num)} kWh`
      : `${prefix}${num.toPrecision(precision)} kWh`;
}
};