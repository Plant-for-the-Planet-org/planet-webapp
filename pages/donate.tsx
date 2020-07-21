import Layout from '../src/features/common/Layout'
import DonateComponent from './../src/features/public/Donations'

export default function Donate({projects}:any) {
  const DonateProps = {
    projects : projects,
  }
  return (
    <Layout>
      <DonateComponent {...DonateProps} />
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://treecounter-development.herokuapp.com/public/v1.3/en/plantProjectMap?country=MX&currency=usd');
  const projects = await res.json()
  return {
    props: {projects}, // will be passed to the page component as props
  }
}