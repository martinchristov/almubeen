import surahRaw from 'quranjson/source/surah/surah_002.json'
import pagesRaw from 'quranjson/source/pages.json'
import humps from 'humps'

const pagesJson = humps.camelizeKeys(pagesRaw)
const surah = humps.camelizeKeys(surahRaw)

const pages = {}
pagesJson.forEach((verse, i) => {
  if(pages[pagesJson[i].pageNumber] == null){
    pages[pagesJson[i].pageNumber] = []
  }
  pages[pagesJson[i].pageNumber].push({...verse, text: surah.verse[`verse${verse.verseNumber}`]})
})
const startI = 64337 // do 64433; ot 64467 (add 34)
const Page = ({ p = 2 }) => {
  let text = ''
  let pageContentLength = 0
  pages[p].forEach((verse) => {
    pageContentLength += verse.text.split(' ').filter(v => v.length > 0).length + 1
  })
  for(let i = startI; i < startI + pageContentLength; i += 1){
    let index = i
    if(index > 64432) index += 34
    text = `${text}${String.fromCharCode(index)}`
  }
  
  return (
    <div className="page">
      <div className="content">
        {text}
      </div>
    </div>
  )
}

export default Page
