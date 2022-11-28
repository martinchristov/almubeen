// import versesRaw from 'quranjson/source/pages.json'
import page2surah from '../assets/page2surah.json'
// import quran from '../assets/quran.json'
// import surah2 from '../assets/surah-2.json'
import humps from 'humps'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
// console.log(surah2)

// const versesJson = humps.camelizeKeys(versesRaw)

const startI = 64337 // do 64433; ot 64467 (add 34)
const Safha = ({ p }) => {
  const [content, setContent] = useState([])
  
  useEffect(() => {
    const renderText = async () => {
      const ayatR = await fetch(`https://api.quran.com/api/v4/verses/by_page/${p}?language=en&words=true&word_fields=code_v2`)
      const ayat = await ayatR.json()

      const content = []
      ayat.verses.forEach(verse => {
        content.push(<span className="aya">{verse.words.map(word => <><span className="kalima" key={word.id}>{word.code_v2}</span> </>)}</span>)
      })
      console.log(p, ayat)
      if(p === 2){
        content.unshift((<span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>))
      }
      setContent(content)
    }
    renderText()
  }, [])
  
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
          <p>
            {content}
          </p>
        </div>
      </div>
      <div className="pnum">{p}</div>
    </div>
  )
}

export default Safha
