import { Button, Checkbox, Collapse, Divider, Modal, Select, Spin } from 'antd'
import { LeftOutlined, RightOutlined, StarOutlined, UnorderedListOutlined } from '@ant-design/icons'
import sources from '../assets/translation-sources2.json'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import surat from '../assets/surat.json'
import pageData from '../assets/pages.json'
import { AuthContext, CollectionsContext } from './context'
const CollapsePanel = Collapse.Panel

const getTranslation = (translation, chapter, verse) => {
  const ret = translation.quran.find(it => it.chapter === Number(chapter) && it.verse === Number(verse))
  return ret?.text
}

const AyaModal = ({ selectedAya, setSelectedAya, page, setLoginModalOpen }) => {
  return (
    <Modal className='aya-modal' open={selectedAya != null} onCancel={() => { setSelectedAya(null) }} destroyOnClose footer={null}>
      <ModalContent {...{ selectedAya, setSelectedAya, page, setLoginModalOpen }} />
    </Modal>
  )
}

const ModalContent = ({ selectedAya, setSelectedAya, page, setLoginModalOpen }) => {
  const { authStatus, session } = useContext(AuthContext)
  const { collections, setCollections } = useContext(CollectionsContext)
  const keys = selectedAya.split(':')
  const [translated, setTranslated] = useState([])
  const _selected = localStorage.getItem('selected-translations') ? JSON.parse(localStorage.getItem('selected-translations')) : []
  const [mode, setMode] = useState(_selected.length > 0 ? 'view' : 'edit')
  const [selected, setSelected] = useState(_selected)
  const [loading, setLoading] = useState(true)
  const prev = useRef()
  const prevAya = useRef(selectedAya)
  const loadTranslations = ($selected) => {
    const SS = $selected != null ? $selected : selected
    SS.forEach((key, ind) => {
      fetch(sources[key].linkmin)
      .then(d => d.json())
      .then(d => {
        if(ind === SS.length - 1) setLoading(false)
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
  useEffect(() => {
    if(prevAya.current !== selectedAya){
      loadTranslations()
      prevAya.current = selectedAya
    }
  }, [selectedAya])
  const handleChangeSources = (_selected) => {
    setLoading(true)
    setMode('view')
    setSelected(_selected)
    setTranslated([])
    localStorage.setItem('selected-translations', JSON.stringify(_selected));
    loadTranslations(_selected)
  }
  const handleClickNext = () => {
    setSelectedAya(`${keys[0]}:${Number(keys[1]) + 1}`)
  }
  const handleClickPrev = () => {
    setSelectedAya(`${keys[0]}:${Number(keys[1]) - 1}`)
  }
  const handleCheck = (collection) => (e) => {
    const updated = [...collections]
    const ind = updated.findIndex(it => collection.id === it.id)
    let newKeys = [...collection.keys]
    if(e.target.checked){
      newKeys.push(selectedAya)
      fetch(`/api/collections/${collection.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: selectedAya })
      })
    }
    else {
      newKeys = newKeys.filter(it => it !== selectedAya)
      fetch(`/api/collections/${collection.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: selectedAya })
      })
    }
    setCollections([...updated.slice(0, ind), { ...collection, keys: newKeys }, ...updated.slice(ind + 1)])
  }
  return (
    <div>
      {mode === 'view' &&
      <>
      <div className="aya-title">
        <Button disabled={Number(keys[1]) < 2} className="prev" type="link" size="large" onClick={handleClickPrev}>
          <LeftOutlined />
        </Button>
        <h3>{selectedAya}</h3>
        <Button disabled={Number(keys[1]) > surat.chapters[Number(keys[0]) - 1].verses_count - 1} className="next" type="link" size="large" onClick={handleClickNext}>
          <RightOutlined />
        </Button>
      </div>
      <div className="aya-arabic">
        {selectedAya && pageData[page]?.find(it => it.verseKey === selectedAya)?.words?.map(it => <span key={it.id}>{it.textUthmani} </span>)}
      </div>
      {session != null &&
      <div className="collection">
        <div className="label">Add to:</div>
        <ul>
          {collections.map(it =>
          <li key={it.id}><Checkbox value={it.id} checked={it.keys.indexOf(selectedAya) !== -1} onChange={handleCheck(it, keys)}>{it.title}</Checkbox></li>
          )}
          {/* <li className="edit-collections"><Button type="link"><UnorderedListOutlined /> Edit Collections</Button></li> */}
        </ul>
      </div>
      }
      {session == null && authStatus !== 'loading' && (
        <div className="collection">
          <Button className="login-btn" type="link" onClick={() => setLoginModalOpen(true)}>Login to bookmark</Button>
        </div>
      )}
      <ul>
        {translated.map((item, ind) =>
          <li key={sources[ind]} className={selected[ind].substr(0, 3)}>
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
        <h3>Setup your preferred translations</h3>
        <p><i>You only need to do this once</i></p>
        <EditSources {...{ handleChangeSources }} />
      </>
      }
    </div>
  )
}

const allLangs = ['English', 'Arabic', 'Achinese', 'Afar', 'Afrikaans', 'Albanian', 'Amharic', 'Assamese', 'Azerbaijani', 'Bambara', 'Bengali', 'Berber', 'Bosnian', 'Bulgarian', 'Burmese', 'Catalan', 'Chichewa', 'Chinese(simplified)', 'Chinese(traditional)', 'Croatian', 'Czech', 'Dagbani', 'Danish', 'Dari', 'Divehi', 'Dutch', 'Esperanto', 'Filipino', 'Finnish', 'French', 'Fulah', 'Ganda', 'German', 'Gujarati', 'Hausa', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Iranun', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Kendayan', 'Khmer', 'Kinyarwanda', 'Kirghiz', 'Korean', 'Kurdish', 'Kurmanji', 'Latin', 'Lingala', 'Luyia', 'Macedonian', 'Malay', 'Malayalam', 'Maltese', 'Maranao', 'Marathi', 'Nepali', 'Norwegian', 'Oromo', 'Panjabi', 'Persian', 'Polish', 'Portuguese', 'Pushto', 'Romanian', 'Rundi', 'Russian', 'Serbian', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Somali', 'Sotho', 'Spanish', 'Swahili', 'Swedish', 'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Twi', 'Uighur', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Xhosa', 'Yau', 'Yoruba', 'Zulu']

const EditSources = ({ handleChangeSources }) => {
  const [selected, setSelected] = useState(localStorage.getItem('selected-translations') ? JSON.parse(localStorage.getItem('selected-translations')) : [])
  let sourcesByLang = {}
  allLangs.forEach(lang => { sourcesByLang[lang] = [] })
  Object.keys(sources).forEach(key => {
    sourcesByLang[sources[key].language].push({...sources[key], key})
  })
  const handleDoneClick = () => {
    handleChangeSources(selected)
  }
  const handleChangeCheck = (source) => (e) => {
    setSelected(val => {
      if(e.target.checked){
        if(val.indexOf(source.key) === -1) return [...val, source.key]
        return val
      }
      if(val.indexOf(source.key) !== -1) return val.filter(it => it !== source.key)
      return val
    })
  }
  return (
    <div>
      <Collapse defaultActiveKey={['English']}>
        {allLangs.map(lang =>
        <CollapsePanel header={lang} key={lang}>
          <ul>
            {sourcesByLang[lang].map(source =>
            <li key={source.key}>
              <Checkbox checked={selected.indexOf(source.key) !== -1} onChange={handleChangeCheck(source)}>{source.author}</Checkbox>
            </li>
            )}
          </ul>
        </CollapsePanel>
        )}
      </Collapse>
      <div className="sticky-footer">
        <Button disabled={selected.length === 0} size="large" type="primary" onClick={handleDoneClick}>Done</Button>
      </div>
    </div>
  )
}

export default memo(AyaModal)