// TODO: this is somewhat of a hack
// This is a mapping of weekly cash rewards for each week starting at week 18 
// (after the suss farms were removed from the protocol)

interface IWeeklyCashRewardsObj {
  [week: number]: number;
}

const weeklyCashRewardsObj: IWeeklyCashRewardsObj = {
  18: 0,
  19: 0,
  20: 15779,
  21: 16049,
  22: 16624,
  23: 16768,
  24: 16949,
  25: 17177,
  26: 18948.615,
  27: 19583.996,
  28: 19933.866,
  29: 20195.9,
  30: 23196.529,
  31: 23212.313,
  32: 23288.117,
  33: 23696.461,
  34: 24250.488,
  35: 24257.985,
  36: 24397.015,
  37: 24408.1,
  38: 24653.214,
  39: 25067.891,
  40: 25078.202,
  41: 25411.597,
  42: 25411.597
};

export default weeklyCashRewardsObj;