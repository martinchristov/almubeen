import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Popover } from 'antd';

const Safha = ({ p }) => {
  const [pageAyat, setPageAyat] = useState()
  
  useEffect(() => {
    const renderText = async () => {
      const ayatR = await fetch(`https://api.quran.com/api/v4/verses/by_page/${p}?language=en&words=true&word_fields=code_v2`)
      const ayat = await ayatR.json()
      setPageAyat(ayat)
    }
    renderText()
  }, [])
  
  return (
    <div className={classNames('page', `page${p}`)} style={{ fontFamily: `page${p}`}}>
      <div className="content">
        <div className="inner">
          <p>
            {p === 2 && <span key="bismillah" className="bismillah">ﱁ ﱂ ﱃ ﱄ</span>}
            {pageAyat?.verses?.map(verse =>
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
                      <span className="kalima" key={word.id}>{word.code_v2}</span>
                    </Popover>{' '}
                  </>
                })}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="pnum">{p}</div>
    </div>
  )
}

export default Safha
