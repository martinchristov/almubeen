import { Input, Modal } from "antd"
import { useState, useEffect, useRef } from "react"
import mixpanel from 'mixpanel-browser';
import { SearchOutlined } from '@ant-design/icons'
import surat from '../assets/surat.json'
import page2sura from '../assets/page2surah.json'
import pageData from '../assets/pages.json'

let pageh = 860;
const marginY = 48

const Nav = ({ initers, setIniters, highlightAya, scale, setScale }) => {
  const [page, setPage] = useState(1)
  const [juz, setJuz] = useState(1)
  const [suraModalVisible, setSuraModalVisible] = useState(false)
  const [juzModalVisible, setJuzModalVisible] = useState(false)
  const [currentSura, setCurrentSura] = useState('الفاتحة')
  const pages = useRef()
  const handlePageClick = () => {
    const inp = prompt('Jump to page', page)
    if(inp != null){
      window.scrollTo({ top: pages.current[Number(inp) - 1].offsetTop - 50 })
      mixpanel.track('Go to page')
    }
  }
  const calcPageH = () => {
    const pagew = window.innerWidth > 512 ? 512 : window.innerWidth
    setScale((_scale) => {
      const fontSize = ((pagew - 40) / 34.77) * 2 /*em*/ * _scale
      if(_scale === 1){
        pageh = fontSize * 1.9 /*l.h*/ * 15 + 30 /* padding */ + 20 /* margin */
        for(let i = 0; i < 604; i += 1){
          pages.current[i].style.height = null
        }
      } else {
        const lineHeight = fontSize * 1.9
        pageh = pages.current[2].clientHeight + lineHeight /* add extra line */
        pages.current[0].style.height = `${pageh}px`
        pages.current[1].style.height = `${pageh}px`
        for(let i = 3; i < 604; i += 1){
          pages.current[i].style.height = `${pageh}px`
        }
      }
      return _scale
    })
    setPage((_page) => {
      setTimeout(() => {
        window.scrollTo({ top: pages.current[_page - 1].offsetTop - 50 })
      }, 100)
      return _page
    })
  }

  useEffect(() => {
    pages.current = document.getElementsByClassName('page')
    const resizeObserver = new ResizeObserver((entries) => {
      calcPageH()
    });
    
    resizeObserver.observe(pages.current[2]);
    document.addEventListener('scroll', () => {
      const pageYPos = Math.floor((window.scrollY + marginY) / pageh)
      setPage(page => {
        if(pageYPos > -1 && pageYPos + 1 !== page){
          setJuz(getJuzFromPage(pageYPos + 1))
          setCurrentSura(surat.chapters[page2sura[pageYPos + 1] - 1]?.name_arabic)
          if(!initers[pageYPos] || !initers[pageYPos + 1] || !initers[pageYPos + 2]){
            
            setIniters((_cp) => {
              const cp = [..._cp]
              cp[pageYPos] = true
              cp[pageYPos + 1] = true
              cp[pageYPos + 2] = true
              return cp
            })
          }
          return pageYPos + 1
        }
        return page
      })
    })
  }, [])
  const handleSrcClick = () => {
    mixpanel.track('Search click')
    alert('Coming soon')
  }
  const handleGotoayaClick = () => {
    mixpanel.track('Go to ayah')
    const inp = prompt('Jump to ayah', '2:255')
    if(inp){
      const keys = inp.split(':')
      const tsura = surat.chapters.find(it => it.id === Number(keys[0]))
      if(tsura){
        const suraPages = pageData.slice(tsura.pages[0] - 1, tsura.pages[1])
        const tverse = suraPages.map(verses => verses.find(it => it.verseKey === inp)).filter(it => it != null)
        if(tverse.length > 0) {
          window.scrollTo({ top: document.getElementsByClassName('page')[tverse[0].pageNumber - 1].offsetTop - 50 })
          highlightAya(inp)
        }
      }
    }
  }
  return (
    <>
      <nav>
        <div className="page-contain">
          <div className="src" onClick={handleSrcClick}>
            <SearchOutlined />
          </div>
          <div className="surah caption" onClick={() => setSuraModalVisible(true)}>{currentSura}</div>
          <div className="pagen" onClick={handlePageClick}>{ConvertToArabicNumbers(page)}</div>
          <div className="juz caption" onClick={() => setJuzModalVisible(true)}>الجزء {ConvertToArabicNumbers(juz)}</div>
          <div className="gotoaya" onClick={handleGotoayaClick}>{String.fromCharCode(1757)}</div>
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
    mixpanel.track('Go to Sura')
  }
  const filterSrc = it => { 
    if(src === '') return true
    return it.name_simple.toLowerCase().indexOf(src.toLowerCase()) !== -1 ||
          it.name_arabic.indexOf(src) !== -1
  }
  return (
    <Modal open={open} onCancel={onCancel} title="Surah List" footer={null} className="sura-modal">
      <div className="src">
        <Input allowClear placeholder="Search | ابحث" value={src} onChange={(e) => setSrc(e.target.value)} />
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
    mixpanel.track('Go to Juz')
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
