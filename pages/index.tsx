import Layout from '../src/features/common/Layout'
import HomePage from '../src/features/public/Home'
import {useDispatch} from 'react-redux'

export default function Home() {

  const dispatch = useDispatch()
  return (
    <Layout>
      <HomePage/>
    </Layout>
  )
}
