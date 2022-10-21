import Head from 'next/head'
import Image from 'next/image'
import Page from '../components/page'

export default function Home() {
  return (
    <div>
      <Image src="/bismillah.svg" alt="Bismillah" width={600} height={100} />
      <Page />
    </div>
  )
}
