import versesRaw from 'quranjson/source/pages.json'
import page2surah from '../assets/page2surah.json'
import humps from 'humps'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

const versesJson = humps.camelizeKeys(versesRaw)

const startI = 64337 // do 64433; ot 64467 (add 34)
const Safha = ({ p = 2 }) => {
  const [text, setText] = useState('')
  
  useEffect(() => {
    const renderText = async () => {
      const surahRaw = await require(`quranjson/source/surah/surah_${String(page2surah[p]).padStart(3, '0')}.json`)
      const surah = humps.camelizeKeys(surahRaw)

      const pageVerses = []
      const minI = p === 1 ? 1 : 0
      versesJson.filter(v => v.pageNumber === p).forEach((verse, i) => {
        const vk = verse.verseKey.split(':')
        pageVerses.push({...verse, surah: Number(vk[0]), text: surah.verse[`verse${verse.verseNumber - minI}`]})
      })

      let text = ''
      let pageContentLength = 0
      pageVerses.forEach((verse) => {
        pageContentLength += verse.text.split(' ').filter(v => v.length > 0).length + 1
      })
      if(p > 2){
        pageContentLength -= 1; // TODO: this is a quick fix to an bug with text length calculation; the fix doesn't work for every page. Needs more in-depth investigation
      }
      for(let i = startI; i < startI + pageContentLength; i += 1){
        let index = i
        if(index > 64432) index += 34
        text = `${text}${String.fromCharCode(index)}`
      }
      setText(text)
    }
    renderText()
  }, [])
  
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        {text}
      </div>
    </div>
  )
}

export default Safha
