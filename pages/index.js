import { useEffect, useState } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const pages = []
  for(let i = 1; i < 604; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} />)
  }
  return (
    <div>
      <Nav {...{ initers, setIniters }} />
      {pages}
    </div>
  )
}
