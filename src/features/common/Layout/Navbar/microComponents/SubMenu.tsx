import { lang_path } from '../../../../../utils/constants/wpLanguages';
import GetSubMenuIcons from '../getSubMenu';
import { useTranslations, useLocale } from 'next-intl';
import { SubmenuItem } from '@planet-sdk/common';
import Link from 'next/link';

export interface SubMenuProps {
  subMenu: SubmenuItem[] | undefined;
}

type SubmenuTitle =
  | 'overview'
  | 'childrenAndYouth'
  | 'trillionTrees'
  | 'yucatan'
  | 'partners'
  | 'changeChocolate'
  | 'stopTalkingStartPlanting'
  | 'vtoChallenge'
  | 'mangroves';

const SubMenu = ({ subMenu }: SubMenuProps) => {
  const t = useTranslations('Common');
  const locale = useLocale();

  const getLanguagePath = (locale: string) => {
    return lang_path[locale as keyof typeof lang_path] || 'en';
  };

  return (
    <>
      {subMenu &&
        subMenu.map((subMenuItem: SubmenuItem) => {
          if (subMenuItem.onclick.startsWith('/')) {
            return (
              <Link
                className="menuRow"
                key={subMenuItem.title}
                href={subMenuItem.onclick}
              >
                <div className="subMenuContainer">
                  <GetSubMenuIcons title={subMenuItem.title} />
                  <div className="menuText">
                    {t(subMenuItem.title as SubmenuTitle)}
                  </div>
                </div>
              </Link>
            );
          } else {
            const url = new URL(subMenuItem.onclick);
            const path = url.pathname.startsWith('/')
              ? url.pathname.slice(1)
              : url.pathname;

            return (
              <a
                key={subMenuItem.title}
                className="menuRow"
                href={`https://www.plant-for-the-planet.org/${getLanguagePath(
                  locale
                )}/${path}`}
              >
                <div className="subMenuContainer">
                  <GetSubMenuIcons title={subMenuItem.title} />
                  <div className="menuText">
                    {t(subMenuItem.title as SubmenuTitle)}
                  </div>
                </div>
              </a>
            );
          }
        })}
    </>
  );
};

export default SubMenu;
