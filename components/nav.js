import { Input, Modal } from "antd"
import { useState, useEffect } from "react"
import surat from '../assets/surat.json'
import page2sura from '../assets/page2surah.json'

const pageh = 860;
const mobilePageh = 740
const marginY = 48

const Nav = ({ initers, setIniters }) => {
  const [page, setPage] = useState(1)
  const [juz, setJuz] = useState(1)
  const [suraModalVisible, setSuraModalVisible] = useState(false)
  const [juzModalVisible, setJuzModalVisible] = useState(false)
  const [currentSura, setCurrentSura] = useState('الفتحة')
  const handlePageClick = () => {
    const inp = prompt('Jump to page', page)
    if(inp != null){
      window.scrollTo({ top: document.getElementsByClassName('page')[Number(inp) - 1].offsetTop - 50 })
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const ph = window.innerWidth < 640 ? mobilePageh : pageh
      const pageYPos = Math.floor((window.scrollY + marginY) / ph)
      if(pageYPos + 1 !== page){
        setPage(pageYPos + 1)
        setJuz(getJuzFromPage(pageYPos + 1))
        setCurrentSura(surat.chapters[page2sura[pageYPos + 1] - 1].name_arabic)
        if(!initers[pageYPos] || !initers[pageYPos + 1] || !initers[pageYPos + 2]){
          const cp = [...initers]
          cp[pageYPos] = true
          cp[pageYPos + 1] = true
          cp[pageYPos + 2] = true
          if(cp.length !== initers.length){
            setIniters(cp)
          }
        }
      }
    })
  }, [])
  return (
    <>
      <nav>
        <div className="page-contain">
          <div className="surah caption" onClick={() => setSuraModalVisible(true)}>{currentSura}</div>
          <div className="pagen" onClick={handlePageClick}>{ConvertToArabicNumbers(page)}</div>
          <div className="juz caption" onClick={() => setJuzModalVisible(true)}>الجزء {ConvertToArabicNumbers(juz)}</div>
        </div>
      </nav>
      <SuraModal open={suraModalVisible} onCancel={() => { setSuraModalVisible(false)}} />
      <JuzModal open={juzModalVisible} onCancel={() => { setJuzModalVisible(false)}} />
    </>
  )
}
const SuraModal = ({ open, onCancel }) => {
  const [src, setSrc] = useState('')
  const handleClickSurah = (sura, index) => () => {
    onCancel()
    window.scrollTo({ top: document.getElementsByClassName('page')[sura.pages[0] - 1].offsetTop - 50 })
  }
  const filterSrc = it => { 
    if(src === '') return true
    return it.name_simple.toLowerCase().indexOf(src.toLowerCase()) !== -1 ||
          it.name_arabic.indexOf(src) !== -1
  }
  return (
    <Modal open={open} onCancel={onCancel} title="Surah List" footer={null} className="sura-modal">
      <div className="src">
        <Input placeholder="Search | ابحث" value={src} onChange={(e) => setSrc(e.target.value)} />
      </div>
      <ul>
        {surat.chapters.filter(filterSrc).map((sura) =>
        <li key={sura.id} onClick={handleClickSurah(sura)}>
          <h3>{sura.id}. {sura.name_simple}</h3>
          <div className="ar">{ConvertToArabicNumbers(sura.id)} - {sura.name_arabic}</div>
        </li>
        )}
      </ul>
    </Modal>
  )
}
const juz2page = [1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582]
const getJuzFromPage = (page) => {
  let juz = 0
  while(juz2page[juz + 1] <= page) juz += 1
  return juz + 1
}
const JuzModal = ({ open, onCancel }) => {
  const handleClickJuz = (ind) => () => {
    onCancel()
    window.scrollTo({ top: document.getElementsByClassName('page')[juz2page[ind] - 1].offsetTop - 45 })
  }
  return (
    <Modal {...{ open, onCancel }} title="Go to Juz" className="sura-modal juz-modal" footer={null}>
      <ul>
        {[...Array(30)].map((i, ind) =>
          <li key={ind} onClick={handleClickJuz(ind)}>
            <span>Juz {ind + 1}</span>
            <div className="ar">الجوز - {ConvertToArabicNumbers(ind + 1)}</div>
          </li>
        )}
      </ul>
    </Modal>
  )
}

const ConvertToArabicNumbers = (num) => {
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
 return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
}

export default Nav
