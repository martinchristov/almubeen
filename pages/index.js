import { useState, memo } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import { Modal } from 'antd'
import AyaTranslations from '../components/translations'
import mixpanel from 'mixpanel-browser';
mixpanel.init('c8410392727607e9cb045c0145343357', {debug: true});

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const pages = []
  for(let i = 1; i < 605; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} {...{setSelectedAya}} />)
  }
  console.log('home')
  return (
    <div>
      <Nav {...{ initers, setIniters }} />
      {pages}
      <AyaTranslations {...{ selectedAya, setSelectedAya }} />
    </div>
  )
}
