import { Button } from 'antd'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Safha from '../components/safha'
// import Test from '../app/test'

export default function Home() {
  const [page, setPage] = useState()
  const pages = []
  for(let i = 1; i < 20; i += 1){
    pages.push(<Safha p={i} key={i} />)
  }
  const handleNextPage = (ind) => () => {
    setPage(page + ind)
  }
  return (
    <div>
      <Image src="/bismillah.svg" alt="Bismillah" width={600} height={100} />
      <div className="page-nav">
        <div>
          <Button onClick={handleNextPage(-1)}>&lt;</Button>
          <input value={page} onChange={e => setPage(Number(e.target.value))} />
          <Button onClick={handleNextPage(1)}>&gt;</Button>
        </div>
      </div>
      {/* <Safha p={1} />
      <Safha p={2} /> */}
      {/* <Safha p={3} />
      <Safha p={4} />
      <Safha p={5} />
      <Safha p={6} />
      <Safha p={7} />
      <Safha p={8} /> */}
      {/* <Safha p={21} /> */}
      {page != null ? 
        <>
          <Safha p={page} key={page} />
          <Safha p={page + 1} key={page + 1} />
        </> : 
        pages
      }

    </div>
  )
}
