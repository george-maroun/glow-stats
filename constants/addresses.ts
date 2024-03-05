type Keys =
  | 'earlyLiquidity'
  | 'governance'
  | 'glow'
  | 'vetoCouncilContract'
  | 'holdingContract'
  | 'grantsTreasury'
  | 'gcaAndMinerPoolContract'
  | 'gcc'
  | 'batchCommit'
  | 'usdc'
  | 'usdg'
  | 'impactCatalyst'
  | 'carbonCreditAuction'

const a: Record<Keys, `0x${string}`> = {
  earlyLiquidity: '0xD5aBe236d2F2F5D10231c054e078788Ea3447DFc',
  governance: '0x8d01a258bC1ADB728322499E5D84173EA971d665',
  glow: '0xf4fbC617A5733EAAF9af08E1Ab816B103388d8B6',
  vetoCouncilContract: '0xA3A32d3c9a5A593bc35D69BACbe2dF5Ea2C3cF5C',
  holdingContract: '0xd5970622b740a2eA5A5574616c193968b10e1297',
  grantsTreasury: '0x0116DA066517F010E59b32274BF18083aF34e108',
  gcaAndMinerPoolContract: '0x6Fa8C7a89b22bf3212392b778905B12f3dBAF5C4',
  gcc: '0x21C46173591f39AfC1d2B634b74c98F0576A272B',
  batchCommit: '0x33853c50E6D75d6c5543b9E76B9d323d161c2791',
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  usdg: '0xe010ec500720bE9EF3F82129E7eD2Ee1FB7955F2',
  impactCatalyst: '0x552Fbb4E0269fd5036daf72Ec006AAF6C958F4Fa',
  carbonCreditAuction: '0x85fbB04DEBBDEa052a6422E74bFeA57B17e50A80',
}

export const addresses = a