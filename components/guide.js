import { Tour } from 'antd'

const steps = [
      {
        title: 'Word Meaning',
        description: 'Click on words you don\'t fully understand',
        placement: 'top',
        // arrow: false,
        target: () => document.getElementsByClassName('id-6844')[0]
      }, {
        placement: 'top',
        title: 'Ayah translations',
        description: 'Click on ayah markers to view multiple translations and more',
        target: () => document.getElementsByClassName('id-6844')[0].previousElementSibling
      }, {
        placement: 'bottom',
        title: 'Navigate to Surah',
        description: 'Click on surah to open list',
        target: () => document.getElementsByClassName('surah')[0]
      }, {
        placement: 'bottom',
        title: 'Navigate to page',
        description: 'Click to jump to page',
        target: () => document.getElementsByClassName('pagen')[0]
      }, {
        // placement: 'bottom',
        title: 'And much more soon',
        description: <>Join our <a href="https://t.me/+kqPyEThUi8QyMWFk" target="_blank" rel="noreferrer">Telegram community</a> to get updates on new stuff, suggest features and report issues.</>,
        // target: () => document.getElementsByClassName('pagen')[0]
      }
    ]

const Guide = ({ open, setOpen }) => {
  return (
    <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
  )
}

export default Guide