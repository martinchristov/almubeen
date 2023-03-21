import { Button, Drawer, Input, Modal, Slider, Spin } from "antd"
import { useState, useEffect, useRef } from "react"
import mixpanel from 'mixpanel-browser';
import { ArrowRightOutlined, ArrowUpOutlined, LoadingOutlined } from '@ant-design/icons'
import surat from '../assets/surat.json'
import page2sura from '../assets/page2surah.json'
import Pointer from '../assets/pointer.svg'
import pageData from '../assets/pages.json'
import { ConvertToArabicNumbers } from "../assets/utils";
import classNames from "classnames";

const { Search } = Input

let pageh = 860;
const marginY = 48
let coverPageOffset = 922

let lrid
const setLastRead = () => {
  clearTimeout(lrid)
  lrid = setTimeout(() => {
    localStorage.setItem("lastRead", window.scrollY);
  }, 3000)
}

const Nav = ({ initers, setIniters, highlightAya, scale, setScale }) => {
  const [page, setPage] = useState(1)
  const [juz, setJuz] = useState(1)
  const [suraModalVisible, setSuraModalVisible] = useState(false)
  const [juzModalVisible, setJuzModalVisible] = useState(false)
  const [currentSura, setCurrentSura] = useState('الفاتحة')
  const [search, setSearch] = useState()
  const pages = useRef()
  const displayModeRef = useRef()
  const prevScrollY = useRef(0)
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const handlePageClick = () => {
    const inp = prompt('Jump to page', page)
    if(inp != null){
      window.scrollTo({ top: pages.current[Number(inp)].offsetTop - 50 })
      mixpanel.track('Go to page')
    }
  }
  const calcPageH = () => {
    const pagew = window.innerWidth > 572 ? 572 : window.innerWidth
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
    
    resizeObserver.observe(pages.current[3]);
    const lastRead = localStorage.getItem('lastRead')

    coverPageOffset = pages.current[0].clientHeight
    document.addEventListener('resize', () => {
      coverPageOffset = pages.current[0].clientHeight
    })

    document.addEventListener('scroll', () => {
      const pageYPos = Math.floor((window.scrollY - coverPageOffset + marginY) / pageh)
      setPage(page => {
        if(pageYPos > -1 && pageYPos + 1 !== page){
          setJuz(getJuzFromPage(pageYPos + 1))
          setCurrentSura(surat.chapters[page2sura[pageYPos + 1] - 1]?.name_arabic)
          if(!displayModeRef.current && !initers[pageYPos] || !initers[pageYPos + 1] || !initers[pageYPos + 2]){
            
            setIniters((_cp) => {
              const cp = [..._cp]
              if(pageYPos > 1) cp[pageYPos - 1] = true
              if(pageYPos > 2) cp[pageYPos - 2] = true
              cp[pageYPos] = true
              if(pageYPos < 602) cp[pageYPos + 1] = true
              if(pageYPos < 601) cp[pageYPos + 2] = true
              return cp
            })
          }
          return pageYPos + 1
        }
        return page
      })
      if(window.innerWidth < 640){
        setCollapsed(true)
        // console.log(prevScrollY.current, window.scrollY)
        // if(prevScrollY.current < window.scrollY - 7){
        //   console.log('COLLAPSE')
        //   setCollapsed(true)
        //   prevScrollY.current = window.scrollY
        // } else if(prevScrollY.current > window.scrollY + 5) {
        //   console.log('EXPAND')
        //   setCollapsed(false)
        //   prevScrollY.current = window.scrollY
        // }
      }
      setLastRead()
    })
    if(lastRead){
      setTimeout(() => {
        window.scrollTo({ top: lastRead })
      }, 3000)
    }
  }, [])
  const handleGotoaya = (inp) => {
    mixpanel.track('Go to ayah')
    if(inp){
      const keys = inp.split(':')
      const tsura = surat.chapters.find(it => it.id === Number(keys[0]))
      if(tsura){
        setOpen(false)
        const suraPages = pageData.slice(tsura.pages[0] - 1, tsura.pages[1])
        const tverse = suraPages.map(verses => verses.find(it => it.verseKey === inp)).filter(it => it != null)
        if(tverse.length > 0) {
          window.scrollTo({ top: document.getElementsByClassName('page')[tverse[0].pageNumber].offsetTop - 50 })
          highlightAya(inp)
        }
      }
    }
  }
  const onChangeScale = (value) => {
    setScale(value / 100)
  }
  const handleSearch = (inp) => {
    setSearch(inp)
    setOpen(false)
  }
  return (
    <>
      <nav className={classNames({ collapsed })}>
        <div className="page-contain">
          <div className="collapsible left">
            <div className="pointer hbtn" onClick={() => setOpen(true)}>
              <Pointer />
            </div>
          </div>
          <div className="surah caption" onClick={() => setSuraModalVisible(true)}><span>{currentSura}</span></div>
          <div className="pagen" onClick={handlePageClick}>{ConvertToArabicNumbers(page)}</div>
          <div className="juz caption" onClick={() => setJuzModalVisible(true)}><span>الجزء</span> {ConvertToArabicNumbers(juz)}</div>
          <div className="collapsible right">
            {/* <div className="btn aa">
              <FontSize />
            </div> */}
            {/* <div className="btn dots">
              <Dots />
            </div> */}
          </div>
        </div>
      </nav>
      <SuraModal open={suraModalVisible} onCancel={() => { setSuraModalVisible(false)}} />
      <JuzModal open={juzModalVisible} onCancel={() => { setJuzModalVisible(false)}} />
      <Drawer closable={false} height={300} className="drawer-nav" placement="top" onClose={() => { setOpen(false) }} open={open}>
        <div className="page-contain">
          <div className="pointer hbtn" onClick={() => setOpen(false)}>
            <Pointer />
          </div>
          <ul>
            <li>
              <Search
                className="src"
                enterButton={<Button><ArrowRightOutlined /></Button>}
                size="large"
                placeholder="Search the Quran |  ابحث القران"
                onSearch={handleSearch}
              />
            </li>
            <li>
              <span className="label">Go to ayah</span>
              <div>
                <Search
                  className="gotoayah"
                  placeholder="2:255"
                  enterButton={<Button><ArrowRightOutlined /></Button>}
                  size="large"
                  onSearch={handleGotoaya}
                />
              </div>
            </li>
            <li>
              <span className="label">Font size</span>
              <Slider
                min={100} max={170}
                defaultValue={100}
                step={10}
                tooltip={{ formatter: (val) => `${val}%`}}
                onAfterChange={(val) => {
                  onChangeScale(val)
                }}
              />
            </li>
          </ul>
        </div>
      </Drawer>
      <SearchModal {...{ search, setSearch, handleGotoaya }} />
    </>
  )
}
// const FontSizePopover = ()
const SuraModal = ({ open, onCancel }) => {
  const [src, setSrc] = useState('')
  const handleClickSurah = (sura, index) => () => {
    onCancel()
    window.scrollTo({ top: document.getElementsByClassName('page')[sura.pages[0]].offsetTop - 50 })
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
          <div className="ar">{ConvertToArabicNumbers(sura.id)} - <span>{sura.name_arabic}</span></div>
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
            <div className="ar"><span>الجزء</span> {ConvertToArabicNumbers(ind + 1)}</div>
          </li>
        )}
      </ul>
    </Modal>
  )
}
const SearchModal = ({ search, setSearch, handleGotoaya }) => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  useEffect(() => {
    if(search){
      setLoading(true)
      fetch(`https://api.quran.com/api/v4/search?size=20&page=0&language=en&q=${search}`)
      .then(d => d.json())
      .then(d => {
        setLoading(false)
        setResults(d.search.results)
      })
    }
  }, [search])
  const handleClickRes = (res) => () => {
    setSearch(null)
    handleGotoaya(res.verse_key)
  }
  return (
    <Modal className="search-modal" open={search != null && search !== ''} onCancel={() => setSearch(null)} footer={null}>
      {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
      {!loading && (
        <>
        <ul>
          {results.map(res =>
          <li key={res.verse_id} onClick={handleClickRes(res)}>
            {res.words.map(word => {
              if(word.highlight) return <><b>{word.text}</b>{" "}</>
              if(word.char_type === 'end') return <><br /><span className="key">{res.verse_key}</span></>
              return <><span key={`${res.verse_key}-${word.text}`}>{word.text}</span>{' '}</>
            })}
          </li>
          )}
        </ul>
        </>
      )}
    </Modal>
  )
}

export default Nav
