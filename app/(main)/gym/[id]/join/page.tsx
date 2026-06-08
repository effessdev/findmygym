export default async function JoinPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return <p>{id}</p>
}
