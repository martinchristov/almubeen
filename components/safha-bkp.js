import versesRaw from 'quranjson/source/pages.json'
import page2surah from '../assets/page2surah.json'
// import quran from '../assets/quran.json'
import surah2 from '../assets/surah-2.json'
import humps from 'humps'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
console.log(surah2)

const versesJson = humps.camelizeKeys(versesRaw)

const startI = 64337 // do 64433; ot 64467 (add 34)
const Safha = ({ p }) => {
  const [content, setContent] = useState([])
  
  useEffect(() => {
    const renderText = async () => {
      const surahRaw = await require(`quranjson/source/surah/surah_${String(page2surah[p]).padStart(3, '0')}.json`)
      const surah = humps.camelizeKeys(surahRaw)
      const ayatR = await fetch(`https://api.quran.com/api/v4/verses/by_page/${p}?language=en&words=true`)
      const ayat = await ayatR.json()
      // ayaat.then().json()
      console.log(ayat)

      const pageVerses = []
      const minI = p === 1 ? 1 : 0 // compensate for discrepecy for "bismillahirahmanirrahim" lacking in font after 1st surah
      versesJson.filter(v => v.pageNumber === p).forEach((verse, i) => {
        const vk = verse.verseKey.split(':')
        // console.log(surah2.verses[verse.verseNumber - minI])
        pageVerses.push({
          ...verse,
          surah: Number(vk[0]),
          // text: surah.verse[`verse${verse.verseNumber - minI}`]
          text: surah2.verses[verse.verseNumber - 1].text_uthmani
        })
        // console.log(surah2.verses[verse.verseNumber - minI]?.text_uthmani)
      })

      const content = []
      let pageContentLength = 0
      let offsetI = startI
      pageVerses.forEach((verse) => {
        // if(verse.verseNumber === 138 && verse.pageNumber === 21){
          // console.log(verse.text.split(' ').filter(v => v.length > 0))
          // console.log(verse.text)
        // }
        let verseCharLength = verse.text.split(' ').filter(v => v.length > 0).length + 1
        const kalimat = []
        let charI = 0
        while(charI < verseCharLength){
          let index = offsetI + charI
          if(index > 64433) index += 33
          if(p === 87 && index === 64347) {index += 1; charI += 1; verseCharLength += 1}
          kalimat.push(<span className="kalima">{String.fromCharCode(index)}</span>)
          charI += 1
        }
        offsetI += verseCharLength
        content.push(<span className="aya">{kalimat}</span>)
      })
      if(p === 2){
        content.unshift((<span key="bismillah" className="bismillah">{`${String.fromCharCode(startI)}${String.fromCharCode(startI + 1)}${String.fromCharCode(startI + 2)}${String.fromCharCode(startI + 3)}`}</span>))
      }
      setContent(content)
      if(p > 2){
        pageContentLength -= 1; // TODO: this is a quick fix to an bug with text length calculation; the fix doesn't work for every page. Needs more in-depth investigation
      }
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