import classNames from 'classnames'
import { useEffect, useState } from 'react'

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
            {pageAyat?.verses.map(verse =>
              <span className="aya" key={verse.id}>{verse.words.map(word => <><span className="kalima" key={word.id}>{word.code_v2}</span> </>)}</span>
            )}
          </p>
        </div>
      </div>
      <div className="pnum">{p}</div>
    </div>
  )
}

export default Safha
