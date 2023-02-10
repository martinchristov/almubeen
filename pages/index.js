import { useState, memo, useEffect, useRef } from 'react'
import Safha from '../components/safha'
import Nav from '../components/nav'
import AyaTranslations from '../components/translations'
import mixpanel from 'mixpanel-browser';
import smartlookClient from 'smartlook-client'
import Head from 'next/head'
mixpanel.init('c8410392727607e9cb045c0145343357', {debug: true});

export default function Home() {
  const [initers, setIniters] = useState([true, true, true, true])
  const [selectedAya, setSelectedAya] = useState(null)
  const [markAya, setMarkAya] = useState(null)
  const [scale, setScale] = useState(1)
  const [scalev, setScalev] = useState(1)
  const scaleRef = useRef()
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
  const setScaleVisual = (e) => {
    setScalev(s => {
      const val = scaleRef.current * Math.cbrt(s * e.scale)
        if(val > 1.7) return 1.7
        if(val < 1) return 1
        return val
      })
  }
  useEffect(() => {
    scaleRef.current = scale
  }, [scale])
  useEffect(() => {
    smartlookClient.init('7e0e68377f7697cb8fb21a46ad6a70dd89b9f982', { region: 'eu' })
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault()
    }, false);
    document.addEventListener('gesturechange', function(e) {
      setScaleVisual(e)
    }, false);
    document.addEventListener('gestureend', function(e) {
      setScale(scalev)
      setScalev(sv => {
        setScale(sv)
        return sv
      })
    }, false);
  }, [])
  return (
    <>
    <Head>
      <meta 
          name='viewport' 
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' 
      />
    </Head>
      <div className={scale > 1 ? 'scaled' : null}>
        <Nav {...{ initers, setIniters, highlightAya, scale, setScale }} />
        <ScaleBar {...{ scalev }} />
        {pages}
        <AyaTranslations {...{ selectedAya, setSelectedAya }} />
      </div>
    </>
  )
}

let tmid
const ScaleBar = ({ scalev }) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    setVisible(true)
    clearTimeout(tmid)
    tmid = setTimeout(() => {
      setVisible(false)
    }, 5000)
  }, [scalev])
  return (
    <>
      {visible && <div className="scale-bar">{Math.round(scalev * 100)}%</div>}
    </>
  )
}
