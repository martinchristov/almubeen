import { Modal } from "antd"
import { useState, useEffect } from "react"
import surat from '../assets/surat.json'
import page2sura from '../assets/page2surah.json'

const pageh = 860;
const marginY = 48

const Nav = ({ initers, setIniters }) => {
  const [page, setPage] = useState(1)
  const [suraModalVisible, setSuraModalVisible] = useState(false)
  const [currentSura, setCurrentSura] = useState('الفتحة')
  const handlePageClick = () => {
    const inp = prompt('Jump to page', page)
    if(inp != null){
      window.scrollTo({ top: document.getElementsByClassName('page')[Number(inp)].offsetTop - 50 })
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const pageYPos = Math.floor((window.scrollY + marginY) / pageh)
      if(pageYPos + 1 !== page){
        setPage(pageYPos + 1)
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
          <div className="page" onClick={handlePageClick}>{ConvertToArabicNumbers(page)}</div>
          <div className="juz caption">الجزء ١</div>
        </div>
      </nav>
      <SuraModal open={suraModalVisible} onCancel={() => { setSuraModalVisible(false)}} />
    </>
  )
}
const SuraModal = ({ open, onCancel }) => {
  const handleClickSurah = (sura, index) => () => {
    onCancel()
    window.scrollTo({ top: document.getElementsByClassName('page')[sura.pages[0]].offsetTop - 50 })
  }
  return (
    <Modal open={open} onCancel={onCancel} title="Surah List" footer={null} className="sura-modal">
      <ul>
        {surat.chapters.map((sura, ind) =>
        <li key={sura.id} onClick={handleClickSurah(sura, ind + 1)}>
          <h3>{ind + 1}. {sura.name_simple}</h3>
          <div className="ar">{ConvertToArabicNumbers(ind + 1)} - {sura.name_arabic}</div>
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
