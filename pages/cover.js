import { ArrowRightOutlined, CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Image from "next/image"
import { useEffect, useState } from "react";
import PointerRead from '../assets/pointer-read.svg'

const Cover = ({ onLoaded, isLoaded }) => {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [lastRead, setLastRead] = useState(null)
  useEffect(() => {
    if(localStorage.getItem('lastRead') > 5){
      setLastRead(localStorage.getItem('lastRead'))
    }
  }, [])
  const handleClickRead = () => {
    window.scrollTo({
      top: document.getElementsByClassName('page')[1].offsetTop - 60,
      behavior: "smooth"
    });
  }
  const handleClickCredits = () => {
    setCreditsOpen(true)
  }
  const handleClickLastRead = () => {
    window.scrollTo({ top: document.getElementsByClassName('page')[Number(localStorage.getItem('lastRead'))].offsetTop - 50 })
  }
  let loaded = 0
  const handleLoadedImage = () => {
    loaded += 1
    if(loaded === 2){
      let intid = setInterval(() => {
        if(document.fonts.check("12px page1") && document.fonts.check("12px page2") && document.fonts.check("12px surah-title")){
          clearInterval(intid)
          onLoaded()
        }
      }, 100)
    }
  }
  return (
    <div className="cover page">
      <div className="content">
        <Image onLoadingComplete={handleLoadedImage} src="/tajmahal.svg" fill alt="" className="taj" />
        <h2><span>al</span>mushaf</h2>
        <h1><span>al</span>mubeen</h1>
        <Image onLoadingComplete={handleLoadedImage} src="/logo.svg" alt="" width={130} height={161} className="logo" />
        <div>
          <h5>a fine digital mushaf<br />for learners of arabic</h5>
        </div>
        {isLoaded &&
        <div className="bottom">
          <div className="btn" onClick={handleClickCredits}>
            <div>credits</div>
          </div>
          <div className="btn read" onClick={handleClickRead}>
            <div>read</div>
            <PointerRead />
          </div>
          {!(lastRead != null && lastRead < 605) &&
          <div className="btn">
            <a href="https://t.me/+kqPyEThUi8QyMWFk" target="_blank" rel="noreferrer">
              <div>community</div>
            </a>
          </div>
          }
          {(lastRead != null && lastRead < 605) &&
          <div className="btn" onClick={handleClickLastRead}>
            <div>last read</div>
            <div className="pg">{lastRead} <ArrowRightOutlined /></div>
          </div>
          }
        </div>
        }
        {!isLoaded &&
          <LoadingOutlined
            style={{
              fontSize: 36,
              marginBottom: 50
            }}
            spin
          />
        }
      </div>
      <div className="fontloaders">l</div>
      <CreditsModal open={creditsOpen} onCancel={() => setCreditsOpen(false)} />
    </div>
  )
}

const CreditsModal = ({ open, onCancel }) => {
  return (
    <Modal className="credits-modal" footer={null} {...{ open, onCancel }}>
      <div>
        <h1>Credits</h1>
        <h2>الحمد لله رب العلمين</h2>
        <ul>
          <li>
            <h3>King Fahd Quran Complex</h3>
            <p>Digitised page by page manuscript of Holy Quran</p>
          </li>
          <li>
            <a href="https://quran.api-docs.io/v4/" target="_blank" rel="noreferrer"><h3>Quran.com</h3></a>
            <p>API for search, font rendering and word by word translation</p>
          </li>
          <li>
            <a href="https://corpus.quran.com" target="_blank" rel="noreferrer"><h3>Quranic Arabic Corpus</h3></a>
            <p>Morphological data for grammatical breakdown</p>
          </li>
          <li>
            <h3>440+ translations</h3>
            <p>https://github.com/fawazahmed0/quran-api</p>
          </li>
          <li>
            <a href="https://instagram.com/kr_calligraphe.paris" target="_blank" rel="noreferrer"><h3>Abdul Kader | @kr_calligraphe.paris</h3></a>
            <p>Khatt - Logo  - almubeen calligraphy</p>
          </li>
          <li>
            <h3>Taj Mahal Tezhip</h3>
            <p>Decorations digitised from the gates of Taj Mahal</p>
          </li>
        </ul>
      </div>
    </Modal>
  )
}

export default Cover
