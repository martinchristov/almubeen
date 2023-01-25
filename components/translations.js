import { Modal, Spin } from 'antd'
// import translation from '../assets/translations/eng-muhammadasad.json'
import sources from '../assets/translation-sources.json'
import { memo, useEffect, useRef, useState } from 'react'

const getTranslation = (translation, chapter, verse) => {
  const ret = translation.quran.find(it => it.chapter === Number(chapter) && it.verse === Number(verse))
  return ret?.text
}

const AyaTranslations = ({ selectedAya, setSelectedAya }) => {
  return (
    <Modal className='aya-modal' open={selectedAya != null} onCancel={() => { setSelectedAya(null) }} destroyOnClose footer={null}>
      <ModalContent selectedAya={selectedAya} />
    </Modal>
  )
}

const ModalContent = ({ selectedAya }) => {
  const keys = selectedAya.split(':')
  // const translated = getTranslation(keys[0], keys[1])
  const [translated, setTranslated] = useState([])
  const [selected, setSelected] = useState(['eng_mohammedmarmadu', 'eng_muhammadasad', 'bul_tzvetantheophan'])
  const [loading, setLoading] = useState(true)
  const prev = useRef()
  useEffect(() => {
    if(prev.current !== selected){
      selected.forEach((key, ind) => {
        fetch(sources[key].linkmin)
        .then(d => d.json())
        .then(d => {
          setLoading(false)
          setTranslated(($translated) => {
            const _translated = [...$translated]
            _translated[ind] = getTranslation(d, keys[0], keys[1])
            return _translated
          })
        })
      })
    }
    prev.current = selected
  }, [selected])
  return (
    <div>
      <h3>{selectedAya}</h3>
      {loading && <Spin />}
      <ul>
        {translated.map((item, ind) =>
          <li key={item}>
            <p>{item}</p>
            <i>{sources[selected[ind]].author}</i>
          </li>
        )}
      </ul>
      {/* <p>{translated}</p> */}
    </div>
  )
}

export default memo(AyaTranslations)