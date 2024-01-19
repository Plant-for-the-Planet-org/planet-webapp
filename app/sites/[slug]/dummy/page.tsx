export default function DummyPage({ params }: { params: { slug: string } }) {
  return <div>Dummy page: {params.slug}</div>;
}
