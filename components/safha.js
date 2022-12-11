import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Popover } from 'antd';
import surat from '../assets/surat.json'
import surahChars from '../assets/surah-chars.json'
import humps from 'humps'
console.log(surat)

const Safha = ({ p }) => {
  const [pageAyat, setPageAyat] = useState()
  
  useEffect(() => {
    const renderText = async () => {
      const ayatR = await fetch(`https://api.quran.com/api/v4/verses/by_page/${p}?language=en&words=true&word_fields=code_v2`)
      const ayat = await ayatR.json()
      setPageAyat(humps.camelizeKeys(ayat))
    }
    renderText()
  }, [])
  
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
            {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
            {pageAyat?.verses?.map(verse => {
              const ret = []
              if(verse.verseNumber === 1 && p !== 1 && p !== 2){
                const surahIndex = Number(verse.verseKey.split(':')[0]) - 1
                ret.push(
                  <div className="surah-title" key={`vt-${surahIndex}`}>
                    <span>{surahChars[surahIndex]}</span>
                  </div>
                )
                ret.push(<span key="bismillah" className="bismillah">
                  <span>{String.fromCharCode(64337)}</span>
                  <span>{String.fromCharCode(64338)}</span>
                  <span>{String.fromCharCode(64339)}</span>
                  <span>{String.fromCharCode(64340)}</span>
                </span>)
              }
              ret.push(
                <span className="aya" key={verse.id}>
                  {verse.words.map(word => {
                    const popupContent = (
                      <div className="popup-content">
                        <span className="translation">{word.translation.text}</span>
                        <span className="transliteration">{word.transliteration.text}</span>
                      </div>
                    )
                    return <>
                      <Popover content={popupContent} trigger="click" autoAdjustOverflow>
                        <span className="kalima" key={word.id}>{word.codeV2}</span>
                      </Popover>{' '}
                    </>
                  })}
                </span>
              )
              return ret
            })}
        </div>
      </div>
    </div>
  )
}

export default Safha
