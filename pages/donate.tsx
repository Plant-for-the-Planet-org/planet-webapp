import Layout from '../src/features/common/Layout'
import DonateComponent from './../src/features/public/Donations'
import Head from 'next/head'

export default function Donate() {
  return (
    <Layout>
      {/* <Head>
        <script src="https://www.paypalobjects.com/api/checkout.js" />
      </Head> */}
      <DonateComponent />
    </Layout>
  )
}
