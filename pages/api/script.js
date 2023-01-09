const fs = require('fs');
// import fetch from 'node-fetch'
// const fetch = require('node-fetch');
import humps from 'humps'
import pagesData from '../../assets/pages.json'

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  await new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(path);
    res.body.pipe(dest);
    res.body.on("end", () => resolve("it worked"));
    dest.on("error", reject);
  })
});

const getJSON = (async (url) => {
  const res = await fetch(url);
  // console.log(res)
  const json = await res.json()
  // console.log(json)
  return json
})

const makeLoop = (async () => {
  const resp = []
  for(var i = 1; i < 115; i += 1){
    // console.log(`req ${i}`);
    const json = await getJSON(`http://localhost:3000/surat/s${i}.json`)
    resp.push(json.verses)
  }
  await new Promise((resolve, reject) => {
    fs.writeFile('./assets/surat2.json', JSON.stringify(resp), err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  })
})

// makeLoop()

const genPages = (async () => {
  const res = await fetch('http://localhost:3000/surat2.json')
  const suratWords = await res.json()
  const pages = []
  for(let i = 0; i < 604; i += 1){
    pages[i] = []
  }
  suratWords.forEach(sura => {
    sura.forEach(aya => {
      pages[aya.page_number - 1].push(aya)
    })
  })
  await new Promise((resolve, reject) => {
    fs.writeFile('./assets/pages.json', JSON.stringify(pages), err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  })
})

// genPages()

export default function handler(req, res) {
  // const pagesD = humps.camelizeKeys(pagesData)
  // fs.writeFile('./pages2.json', JSON.stringify(pagesD), err => {
  //     if (err) {
  //       console.error(err)
  //       return
  //     }
  //     //file written successfully
  //   })
  res.status(200).json({ok: true})
}