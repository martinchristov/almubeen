import Head from 'next/head'
import Image from 'next/image'
import Safha from '../components/safha'
// import Test from '../app/test'

export default function Home() {
  const pages = []
  for(let i = 3; i < 20; i += 1){
    pages.push(<Safha p={i} />)
  }
  return (
    <div>
      <Image src="/bismillah.svg" alt="Bismillah" width={600} height={100} />
      <Safha p={1} />
      <Safha p={2} />
      {/* <Safha p={3} />
      <Safha p={4} />
      <Safha p={5} />
      <Safha p={6} />
      <Safha p={7} />
      <Safha p={8} /> */}
      {/* <Safha p={21} /> */}
      {pages}

    </div>
  )
}
