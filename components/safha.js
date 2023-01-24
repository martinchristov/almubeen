import classNames from 'classnames'
import { memo, useEffect } from 'react'
import { Popover } from 'antd';
import surat from '../assets/surat.json'
import surahChars from '../assets/surah-chars.json'
import pageData from '../assets/pages.json'
import morpho from '../assets/morph.json'
import bt2utf from '../assets/bt2utf';

function transformJSON(input) {
    const lines = {};
    input.forEach(verse => {
        verse.words.forEach(word => {
            if (!lines[word.lineNumber]) {
                lines[word.lineNumber] = [];
            }
            lines[word.lineNumber].push({...word, verseNumber: verse.verseNumber, verseKey: verse.verseKey});
        });
    });
    return Object.values(lines);
}

const Lines = ({ p, setSelectedAya }) => {
  const lines = transformJSON(pageData[p - 1])
  const ret = []
  lines.map((line, lineIndex) => {
    let surahIndex
    if(line[0].verseNumber === 1 && p > 2){
      if(!(lineIndex > 0 && lines[lineIndex - 1][0].verseNumber === 1)){ // additional check for cases when the first verse may be on multiple lines
        surahIndex = Number(line[0].verseKey.split(':')[0]) - 1
        if(line[0].lineNumber > 2 || p === 187){
          ret.push(
            <div className="surah-title" key={`vt-${surahIndex}`}>
              <span>{surahChars[surahIndex]}</span>
            </div>
          )
        }
        if(p !== 187){
          ret.push(<span key="bismillah" className="bismillah">
            <span>{String.fromCharCode(64337)}</span>
            <span>{String.fromCharCode(64338)}</span>
            <span>{String.fromCharCode(64339)}</span>
            <span>{String.fromCharCode(64340)}</span>
          </span>)
        }
      }
    }
    const lineContent = line.map(word => {
      let kalima = <span className={`kalima l-${word.lineNumber} id-${word.id} t-${word.charTypeName}`} key={word.id}>{word.codeV2}</span>
      if(word.charTypeName === 'word'){
        kalima = <Popover destroyTooltipOnHide content={<PopupContent word={word} />} trigger="click" autoAdjustOverflow>{kalima}</Popover>
      } else {
        kalima = <span onClick={() => setSelectedAya(word.verseKey)}>{kalima}</span>
      }
      return <>
        {kalima}{' '}
      </>
    })

    ret.push(<li>{lineContent}</li>)

    if(lineIndex === lines.length - 1){
      surahIndex = Number(line[line.length - 1].verseKey.split(':')[0]) - 1
      if(line[line.length - 1].verseNumber === surat.chapters[surahIndex].verses_count){
        if(line[line.length - 1].lineNumber === 14){
          ret.push(
            <div className="surah-title" key={`vt-${surahIndex + 1}`}>
              <span>{surahChars[surahIndex + 1]}</span>
            </div>
          )
        }
      }
    }
  })
  return <ul>{ret}</ul>
}

const PopupContent = ({ word }) => {
  const keys = word.verseKey.split(':')
  const morphs = morpho[Number(keys[0])][Number(keys[1])][word.position]
  const morphWord = []
  let ind = 0
  morphs.forEach(part => {
    morphWord.push(<b className={`m-${part[1]}`}>{word.textUthmani.slice(ind, ind + part[0].length)}</b>)
    ind += part[0].length
  })
  const morphz = []
  morphs.forEach(part => {
    morphz.push(<small className={`m-${part[1]}`}>{part[1]}<br />{part[2].split('|')[0]}</small>)
  })
  const koklu = morphs.find(it => it[1] === 'N' || it[1] === 'V' || it[1] === 'ADJ')
  let kok
  let kokJSX
  if(koklu != null){
    const ROOTpos = koklu[2].indexOf('ROOT:')
    kok = koklu[2].substr(ROOTpos + 5, 3)
    kokJSX = (<strong>{bt2utf[kok[0]]} {bt2utf[kok[1]]} {bt2utf[kok[2]]}</strong>)
  }
  return (
    <div className="popup-content">
      <span className="transliteration">{word.transliteration.text}</span>
      <span className="arabic">{morphWord}</span>
      <span className="morpho">{morphz}</span>
      {/* <span className="morpho">{morpho[Number(keys[0])][Number(keys[1])][word.position][0][0]}</span> */}
      <span className="translation">{word.translation.text}</span>
      {koklu && <span className="kok"><small>ROOT: </small><a href={`https://ejtaal.net/aa#bwq=${kok}`} target="_blank" rel="noreferrer">{kokJSX}</a></span>}
    </div>
  )
}

const Safha = ({ p, init = false, setSelectedAya }) => {
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
          {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
          {init && <Lines {...{ setSelectedAya, p }} />}
        </div>
      </div>
    </div>
  )
}

const Safha2 = ({ p, init = false }) => {
  
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
            {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
            {init && pageData[p - 1].map((verse, verseIndex) => {
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
              if(p > 2 && verseIndex > 0 && verse.verseNumber > 1){
                const prevVerse = pageData[p - 1][verseIndex - 1]
                if(prevVerse.words[prevVerse.words.length - 1].lineNumber < verse.words[0].lineNumber){
                  ret.push(<br />)
                }
              }
              ret.push(
                <span className={`aya id-${verse.id}`} key={verse.id}>
                  {verse.words.map(word => {
                    const popupContent = (
                      <div className="popup-content">
                        <span className="translation">{word.translation.text}</span>
                        <span className="transliteration">{word.transliteration.text}</span>
                      </div>
                    )
                    return <>
                      <Popover content={popupContent} trigger="click" autoAdjustOverflow>
                        <span className={`kalima l-${word.lineNumber} id-${word.id}`} key={word.id}>{word.codeV2}</span>
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
