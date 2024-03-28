import Custom404Image from '../public/assets/images/Custom404Image';
import { useRouter } from 'next/router';
import Footer from '../src/features/common/Layout/Footer';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { AbstractIntlMessages } from 'next-intl';
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

  return (
    <>
      <div style={styles}>
        <h2>{router.query.error}</h2>
        <div style={{ width: '300px', height: '175px' }}>
          <Custom404Image />
        </div>
      </div>
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
