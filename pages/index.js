import { useState } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import AyaTranslations from '../components/translations'
import mixpanel from 'mixpanel-browser';
import Head from 'next/head'
import { ConfigProvider } from 'antd'
mixpanel.init('c8410392727607e9cb045c0145343357', {debug: true});

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const [markAya, setMarkAya] = useState(null)
  const [scale, setScale] = useState(1)
  const pages = []
  for(let i = 1; i < 605; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} {...{ setSelectedAya, markAya, scale }} />)
  }
  const highlightAya = (key) => {
    setMarkAya(key)
    setTimeout(() => {
      setMarkAya(null)
    }, 15000)
  }
  return (
    <>
    <Head>
      <meta 
          name='viewport' 
          content='width=device-width' 
      />
    </Head>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#275B3C',
          },
        }}
      >
      <div className={scale > 1 ? 'scaled' : null}>
        <Nav {...{ initers, setIniters, highlightAya, scale, setScale }} />
        {pages}
        <AyaTranslations {...{ selectedAya, setSelectedAya }} />
      </div>
      </ConfigProvider>
    </>
  )
}

