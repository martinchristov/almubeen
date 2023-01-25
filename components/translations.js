import { Modal } from 'antd'
import translation from '../assets/translations/eng-muhammadasad.json'

const getTranslation = (chapter, verse) => {
  const ret = translation.quran.find(it => it.chapter === Number(chapter) && it.verse === Number(verse))
  return ret?.text
}

const AyaTranslations = ({ selectedAya, setSelectedAya }) => {
  return (
    <Modal open={selectedAya != null} onCancel={() => { setSelectedAya(null) }} destroyOnClose footer={null}>
      <ModalContent selectedAya={selectedAya} />
    </Modal>
  )
}

const ModalContent = ({ selectedAya }) => {
  const keys = selectedAya.split(':')
  const translated = getTranslation(keys[0], keys[1])
  return (
    <div>
      <h3>{selectedAya}</h3>
      <p>{translated}</p>
    </div>
  )
}

export default AyaTranslations