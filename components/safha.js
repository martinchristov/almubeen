import classNames from 'classnames'
import { memo } from 'react'
import { Popover } from 'antd';
import surat from '../assets/surat.json'
import surahChars from '../assets/surah-chars.json'
import pageData from '../assets/pages.json'

const Safha = ({ p, init = false }) => {
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
            {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
            {init && pageData[p - 1].map(verse => {
              const ret = []
              const surahIndex = Number(verse.verseKey.split(':')[0]) - 1
              if(verse.verseNumber === 1 && p !== 1 && p !== 2){
                if(verse.words[0].lineNumber > 2){
                  ret.push(
                    <div className="surah-title" key={`vt-${surahIndex}`}>
                      <span>{surahChars[surahIndex]}</span>
                    </div>
                  )
                }
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
              if(verse.verseNumber === surat.chapters[surahIndex].verses_count){
                if(verse.words[verse.words.length - 1].lineNumber === 14){
                  ret.push(
                    <div className="surah-title" key={`vt-${surahIndex + 1}`}>
                      <span>{surahChars[surahIndex + 1]}</span>
                    </div>
                  )
                }
              }
              return ret
            })}
        </div>
      </div>
    </div>
  )
}

export default memo(Safha)
