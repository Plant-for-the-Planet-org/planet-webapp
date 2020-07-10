import Layout from '../src/features/common/Layout'
import HomePage from '../src/features/public/Home'
import {useDispatch} from 'react-redux'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// This is just to test the env vairables
console.log('API ENDPOINT',publicRuntimeConfig.API_ENDPOINT);

export default function Home() {

  const dispatch = useDispatch()
  return (
    <Layout>
      <HomePage/>
    </Layout>
  )
}
