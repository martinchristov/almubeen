import { useState, memo } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import { Modal } from 'antd'
import AyaTranslations from '../components/translations'
import mixpanel from 'mixpanel-browser';
import smartlookClient from 'smartlook-client'
mixpanel.init('c8410392727607e9cb045c0145343357', {debug: true});
smartlookClient.init('7e0e68377f7697cb8fb21a46ad6a70dd89b9f982', { region: 'eu' })

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const [markAya, setMarkAya] = useState(null)
  const pages = []
  for(let i = 1; i < 605; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} {...{setSelectedAya, markAya}} />)
  }
  const highlightAya = (key) => {
    setMarkAya(key)
    setTimeout(() => {
      setMarkAya(null)
    }, 15000)
  }
  return (
    <div>
      <Nav {...{ initers, setIniters, highlightAya }} />
      {pages}
      <AyaTranslations {...{ selectedAya, setSelectedAya }} />
    </div>
  )
}
