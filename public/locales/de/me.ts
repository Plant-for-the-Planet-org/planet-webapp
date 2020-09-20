import { ILocaleObject, ILocaleParams } from './../localeInterfaces';

const me: ILocaleObject = {
  treesPlanted: 'Bäume gepflanzt',
  target: 'Ziel',
  share: 'Aktie',
  registerTrees: 'Bäume registrieren',
  redeem: 'Einlösen',
  myForest: 'Mein Wald',
  giftToGiftee: ({ gifteeName }: ILocaleParams) => `Geschenk an ${gifteeName}`,
  description: 'My name is Norbert',
};

export default me;
