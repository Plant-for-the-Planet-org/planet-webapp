export default function Page({ params }: { params: { slug: string } }) {
  return <div>Dummy type 1 page: {params.slug}</div>;
}
