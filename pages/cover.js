import { Modal } from "antd";
import Image from "next/image"
import { useState } from "react";
import PointerRead from '../assets/pointer-read.svg'

const Cover = () => {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const handleClickRead = () => {
    window.scrollTo({
      top: document.getElementsByClassName('page')[1].offsetTop - 60,
      behavior: "smooth"
    });
  }
  const handleClickCredits = () => {
    setCreditsOpen(true)
  }
  return (
    <div className="cover page">
      <div className="content">
        <Image src="/tajmahal.svg" fill alt="" className="taj" />
        <h2><span>al</span>mushaf</h2>
        <h1><span>al</span>mubeen</h1>
        <Image src="/logo.svg" alt="" width={130} height={161} className="logo" />
        <div>
          <h5>a fine digital mushaf<br />for learners of arabic</h5>
        </div>
        <div className="bottom">
          <div className="btn">
            <a href="https://t.me/+kqPyEThUi8QyMWFk" target="_blank" rel="noreferrer">
              <div>community</div>
            </a>
          </div>
          <div className="btn read" onClick={handleClickRead}>
            <div>read</div>
            <PointerRead />
          </div>
          <div className="btn" onClick={handleClickCredits}>
            <div>credits</div>
          </div>
        </div>
      </div>
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
            <a href="https://instagram.com/kr_calligraphe.paris" target="_blank" rel="noreferrer"><h3>Abdul Kader | @kr_caligraphe.paris</h3></a>
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
