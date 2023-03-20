import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import mixpanel from 'mixpanel-browser';
import Head from 'next/head'
import { Alert, Button, ConfigProvider, Input, Modal } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons';
import smartlookClient from 'smartlook-client'
import Safha from '../components/safha'
import Nav from '../components/nav'
import AyaTranslations from '../components/translations'
mixpanel.init('c8410392727607e9cb045c0145343357', {debug: true});

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const [markAya, setMarkAya] = useState(null)
  const [scale, setScale] = useState(1)
  const [iframe, setIframe] = useState(null)
  const { data: session, status: authStatus } = useSession()
  const pages = []
  for(let i = 1; i < 605; i += 1){
    pages.push(<Safha p={i} key={i} init={initers[i - 1]} {...{ setSelectedAya, markAya, scale, setIframe }} />)
  }
  const highlightAya = (key) => {
    setMarkAya(key)
    setTimeout(() => {
      setMarkAya(null)
    }, 20000)
  }
  useEffect(() => {
    if(window.location.href.indexOf('localhost') !== -1){
      smartlookClient.init('7e0e68377f7697cb8fb21a46ad6a70dd89b9f982', { region: 'eu' })
    }
    if(!session){
      // signIn()
    }
    // console.log(session, status)
  }, [])
  useEffect(() => {
    // console.log(session, status)
    if(authStatus !== 'loading' && !session){
      // signIn('email')
      // signIn()
    }
  }, [session, authStatus])
  return (
    <>
    <Head>
      <meta 
          name='viewport' 
          content='width=device-width' 
      />
      <meta name="application-name" content="Al Mubeen" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Al Mubeen | المبين" />
      <meta name="description" content="A fine digital mushaf for students of Arabic and The Quran" />
      <meta name="theme-color" content="#04703D" />
      <link rel="manifest" href="./manifest.json" />
      <link rel="apple-touch-icon" href="./icon-192.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="./icon-152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="./icon-180.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="./icon-167.png" />

      <title>Al Mubeen | المبين</title>
    </Head>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#275B3C',
          },
        }}
      >
      <div className={scale > 1 ? 'scaled' : null}>
        <Nav {...{ initers, setIniters, highlightAya, scale, setScale, authStatus }} />
        {pages}
        <AyaTranslations {...{ selectedAya, setSelectedAya }} />
        <IframeView {...{ iframe, setIframe }} />
      </div>
      </ConfigProvider>
    </>
  )
}


const IframeView = ({ iframe, setIframe }) => {
  return (
    <Modal footer={null} title={<><span>Root dictionary search</span><Button href={iframe} target="_blank" type="link"><ArrowRightOutlined /></Button></>} className="iframe-modal" wrapClassName="iframe-modal" open={iframe != null} onCancel={() => { setIframe(null) }}>
      {/* <Alert message="Below you fill find the best arabic-english dictionaries opened at the page where the root appears. You will have to find it yourself though :)" type="info" showIcon closable /> */}
      <iframe width="100%" height="100%" src={iframe} />
    </Modal>
  )
}
