import { useRouter } from 'next/navigation';
import useLocalizedPath from './useLocalizedPath';

export const useErrorRedirect = () => {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  return (url: string) => {
    router.push(localizedPath(url));
  };
};
