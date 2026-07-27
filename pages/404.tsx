import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import Custom404Image from '../public/assets/images/Custom404Image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Footer from '../src/features/common/Layout/Footer';
import getMessagesForPage from '../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Custom404({ pageProps }: Props) {
  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as const;
  const router = useRouter();
  const t = useTranslations('Common');
  const error =
    typeof router.query.error === 'string' ? router.query.error : undefined;

  return (
    <>
      <Head>
        <title>{t('pageNotFound')}</title>
      </Head>
      <main style={styles}>
        <h1>{error || t('pageNotFound')}</h1>
        <div style={{ width: '300px', height: '175px' }}>
          <Custom404Image />
        </div>
      </main>
      <Footer />
    </>
  );
}

interface PageProps {
  messages: AbstractIntlMessages;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  return {
    props: {
      messages,
    },
  };
};
