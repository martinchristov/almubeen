import { useState } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import translation from '../assets/translations/eng-muhammadasad.json'
import { Modal } from 'antd'

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const pages = []
  for(let i = 1; i < 604; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} {...{setSelectedAya}} />)
  }
  return (
    <div>
      <Nav {...{ initers, setIniters }} />
      {pages}
      <Modal open={selectedAya != null} onCancel={() => { setSelectedAya(null) }} footer={null}>
        <AyaTranslations {...{ selectedAya }} />
      </Modal>
    </div>
  )
}

const getTranslation = (chapter, verse) => {
  const ret = translation.quran.find(it => it.chapter === Number(chapter) && it.verse === Number(verse))
  return ret?.text
}

const AyaTranslations = ({ selectedAya }) => {
  const keys = selectedAya.split(':')
  const translated = getTranslation(keys[0], keys[1])
  return (
    <div>
      <h3>{selectedAya}</h3>
      <p>{translated}</p>
    </div>
  )
}
