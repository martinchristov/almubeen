import classNames from 'classnames'
import { memo, useContext, useEffect, useState } from 'react'
import { Popover } from 'antd';
import surat from '../assets/surat.json'
import surahChars from '../assets/surah-chars.json'
import pageData from '../assets/pages.json'
import morpho from '../assets/morph.json'
import bt2utf from '../assets/bt2utf';
import AyahMarker from '../assets/ayah-marker.svg'
import { ConvertToArabicNumbers, trackEvent } from '../assets/utils';
import { CollectionsContext } from './context';

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

const Lines = ({ p, setSelectedAya, markAya, setIframe }) => {
  const { collections } = useContext(CollectionsContext)
  const lines = transformJSON(pageData[p - 1])
  const ret = []
  const handleClickAya = (word) => () => {
    setSelectedAya(word.verseKey)
    trackEvent('Aya Popup')
  }
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
        kalima = <Popover destroyTooltipOnHide content={<PopupContent {...{ word, setIframe }} />} trigger="click" autoAdjustOverflow>{kalima}</Popover>
      } else {
        if(word.verseKey === markAya){
          console.log(word)
        }
        kalima = (
        <span key={`k${word.id}`} className={classNames('marker', { marked: word.verseKey === markAya, bookmarked: collections.length > 0 && collections[0].keys.indexOf(word.verseKey) !== -1 })} onClick={handleClickAya(word)}>
          <i>{ConvertToArabicNumbers(word.verseKey.split(':')[1])}</i>
          <AyahMarker />
        </span>)
      }
      return <>
        {kalima}{' '}
      </>
    })
    ret.push(<li key={`l-${line[0].id}`}>{lineContent}</li>)

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

const PopupContent = ({ word, setIframe }) => {
  const keys = word.verseKey.split(':')
  const morphs = morpho[Number(keys[0])][Number(keys[1])][word.position]
  const morphWord = []
  let ind = 0
  morphs.forEach((part, pi) => {
    morphWord.push(<><b className={`m-${part[1]}`}>{`${word.textUthmani.slice(ind, ind + part[0].length)}${pi < morphs.length - 1 ? String.fromCharCode(8205) : ''}`}</b></>)
    ind += part[0].length
  })
  const morphz = []
  const let2word = (letter) => {
    const dict = {N: 'Noun', V: 'Verb', PRON: 'Pronoun', P: 'Preposition', ADJ: 'Adjective', PN: 'Proper Noun', NEG: 'Negative', CONJ: 'Conjunction', REL: 'Relative Pronoun', REM: 'Resumption Prt.', EQ: 'Equalization Prt.', CIRC: 'Circumstantial Prt.', DEM: 'Demonstr. Pron.', INTG: 'Interrogative'}
    if(dict.hasOwnProperty(letter)) return dict[letter]
    return letter
  }
  let lem
  morphs.forEach((part, partIndex) => {
    // console.log(part)
    if(part[1] === 'DET') return
    const sub = part[2].split('|')
    let extra
    if(part[1] === 'V'){
      if(sub[3].indexOf('LEM') === -1){
        extra = ` ${sub[3]}`
      }
    }
    morphz.push(<small className={`m-${part[1]}`}>{let2word(part[1])}{extra}</small>)
    const lemIndex = sub.findIndex(it => it.indexOf('LEM') !== -1)
    if(lemIndex !== -1) {
      lem = sub[lemIndex].substr(4)
      morphWord[partIndex] = <Popover content={<div className="lem-popup">{lem.split('').map(it => bt2utf[it]).join('')}</div>}>{morphWord[partIndex]}</Popover>
    }
  })
  const koklu = morphs.find(it => it[1] === 'N' || it[1] === 'V' || it[1] === 'T' || it[1] === 'ADJ')
  let kok
  let kokJSX
  if(koklu != null){
    const ROOTpos = koklu[2].indexOf('ROOT:')
    kok = koklu[2].substr(ROOTpos + 5, 3)
    kokJSX = (<strong>{`${bt2utf[kok[0]]}${bt2utf[kok[1]]}${bt2utf[kok[2]]}`}</strong>)
  }
  trackEvent('Word Popup')
  return (
    <div className="popup-content">
      <span className="arabic">{morphWord}</span>
      <span className="morpho">{morphz}</span>
      <span className="transliteration">{word.transliteration.text}</span>
      {/* {lem && <span className="lem">{lem.split('').map(it => bt2utf[it]).join('')}</span>} */}
      <span className="translation">{word.translation.text}</span>
      {/* {koklu && <span className="kok"><small>ROOT: </small><a onClick={() => setIframe(`https://ejtaal.net/aa#bwq=${kok}`)}>{kokJSX}</a></span>} */}
      {koklu && <span className="kok"><small>ROOT: </small><a onClick={() => { setIframe(`https://ejtaal.net/aa/#bwq=${kok}`) }}>{kokJSX}</a></span>}
    </div>
  )
}

const Safha = ({ p, init = false, setSelectedAya, markAya, scale, setIframe }) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let intid = setInterval(() => {
      if(document.fonts.check(`12px page${p}`)){
        clearInterval(intid)
        setLoaded(true)
      }
    }, 100)
  }, [])
  return (
    <div className={classNames('page', `page${p}`, { loaded })} style={init ? { fontFamily: `page${p}` } : null}>
      <div className="sticky-page"><div>{ConvertToArabicNumbers(p)}</div></div>
      <div className="content" style={{ fontSize: `${2 * scale}em`}}>
        <div className="inner">
          {(p === 1 || p === 2) && (
            <div className="surah-title" key={`vt-${p - 1}`}>
              <span>{surahChars[p - 1]}</span>
            </div>
          )}
          {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
          {init && <Lines {...{ setSelectedAya, p, markAya, setIframe }} />}
        </div>
      </div>
    </div>
  )
}

export default memo(Safha)
