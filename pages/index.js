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
          <Button onClick={handleNextPage(-2)}>&lt;</Button>
          <input value={page} onChange={e => setPage(Number(e.target.value))} />
          <Button onClick={handleNextPage(2)}>&gt;</Button>
        </div>
      </div>
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
