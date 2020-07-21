import Layout from '../src/features/common/Layout'
import dynamic from 'next/dynamic'
import React from 'react'
const SimpleExample = dynamic(
  () => import('../src/features/public/Donations/screens/Maps'),
  { ssr: false }
)

export default function Mappage() {
  return (
    <Layout>
      <SimpleExample/>
    </Layout>
  )
}
