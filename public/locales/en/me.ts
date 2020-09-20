import { ILocaleObject, ILocaleParams } from './../localeInterfaces';

const me: ILocaleObject = {
  treesPlanted: 'Trees Planted',
  target: 'Target',
  share: 'Share',
  registerTrees: 'Register Trees',
  redeem: 'Redeem',
  myForest: 'My Forest',
  giftToGiftee: ({ gifteeName }: ILocaleParams) => `Gift to ${gifteeName}`,
  description: 'My name is Norbert',
};

export default me;
