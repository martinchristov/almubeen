import { useEffect, useState } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'

export default function Home() {
  const [page, setPage] = useState(1)
  const [initers, setIniters] = useState([true, true, true, true])
  const pages = []
  const pageh = 860;
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
      {pages}
    </div>
  )
}
