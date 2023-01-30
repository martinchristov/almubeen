import { Button, Divider, Modal, Select, Spin } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
// import translation from '../assets/translations/eng-muhammadasad.json'
import sources from '../assets/translation-sources2.json'
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
  const [translated, setTranslated] = useState([])
  const _selected = localStorage.getItem('selected-translations') ? JSON.parse(localStorage.getItem('selected-translations')) : []
  const [mode, setMode] = useState(_selected.length > 0 ? 'view' : 'edit')
  const [selected, setSelected] = useState(_selected)
  const [loading, setLoading] = useState(true)
  const prev = useRef()
  const loadTranslations = () => {
    selected.forEach((key, ind) => {
        fetch(sources[key].linkmin)
        .then(d => d.json())
        .then(d => {
          if(ind === selected.length - 1) setLoading(false)
          setTranslated(($translated) => {
            const _translated = [...$translated]
            _translated[ind] = getTranslation(d, keys[0], keys[1])
            return _translated
          })
        })
      })
  }
  
  useEffect(() => {
    if(prev.current !== selected){
      loadTranslations()
    }
    prev.current = selected
  }, [])
  const handleChangeSources = () => {
    setLoading(true)
    setTranslated([])
    loadTranslations()
    setMode('view')
    localStorage.setItem('selected-translations', JSON.stringify(selected));
  }
  return (
    <div>
      <h3>{selectedAya}</h3>
      {mode === 'view' &&
      <>
      <ul>
        {translated.map((item, ind) =>
          <li key={sources[ind]}>
            <p>{item}</p>
            <small><i>{sources[selected[ind]]?.author}</i></small>
          </li>
        )}
      </ul>
      {loading && <Spin />}
      <Divider />
      <Button onClick={() => setMode('edit')}><UnorderedListOutlined />Choose Translations</Button>
      </>
      }
      {mode === 'edit' &&
      <>
        <Select
          value={selected}
          onChange={(val) => { setSelected(val) }}
          className='select-sources'
          showSearch
          mode="multiple"
          placeholder="Select translations"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label.toLocaleLowerCase() ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={Object.keys(sources).map(key => ({ value: key, label: `${sources[key].language} - ${sources[key].author}`}))}
        />
        <Button type="primary" onClick={handleChangeSources}>Done</Button>
      </>
      }
    </div>
  )
}

export default memo(AyaTranslations)