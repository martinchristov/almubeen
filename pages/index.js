import { Button } from 'antd'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import surat from '../assets/surat.json'
// import Test from '../app/test'

export default function Home() {
  const [page, setPage] = useState(1)
  const [initers, setIniters] = useState([true, true, true, true])
  const pages = []
  const pageh = 865.39;
  for(let i = 1; i < 604; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} />)
  }
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const pageYPos = Math.floor(window.scrollY / pageh)
      if(pageYPos !== page){
        setPage(pageYPos + 1)
        if(!initers[pageYPos] || !initers[pageYPos + 1] || !initers[pageYPos + 2]){
          const cp = [...initers]
          cp[pageYPos] = true
          cp[pageYPos + 1] = true
          cp[pageYPos + 2] = true
          setIniters(cp)
        }
      }
    })
  }, [])
  return (
    <div>
      
      <Nav {...{ page, setPage, pageh}} />
      {/* <div className="page-nav">
        <div>
          <Button onClick={handleNextPage(-2)}>&lt;</Button>
          <input value={page} onChange={e => setPage(Number(e.target.value))} />
          <Button onClick={handleNextPage(2)}>&gt;</Button>
        </div>
      </div> */}
      {pages}

    </div>
  )
}


// const SuraTitles = () => {
//   const si = 59648
//   const ret = []
//   for(let i = si; i <= si + 115; i += 1){
//     ret.push(<div>
//       <span>{String.fromCharCode(i)}</span>
//       <small>{i}</small>
//     </div>)
//   }
//   return (
//     <div className="surah-title">
//       {ret}
//     </div>
//   )
// }
