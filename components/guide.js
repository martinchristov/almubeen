import { Tour } from 'antd'

const steps = [
      {
        title: 'Word Meaning',
        description: 'Click on words you don\'t fully understand',
        placement: 'top',
      }, {
        placement: 'top',
        title: 'Ayah translations',
        description: 'Click on ayah markers to view multiple translations and more',
      }, {
        placement: 'bottom',
        title: 'Navigate to Surah, Page and Juz',
        description: 'Each three are clickable',
        target: () => document.getElementsByClassName('surah')[0]
      }, {
        placement: 'bottom',
        title: 'Search and more',
        description: 'Expand the menu for more',
        target: () => document.getElementsByClassName('hbtn')[0]
      }
    ]

const Guide = ({ open, setOpen }) => {
  const handleOnClose = () => {
    document.body.className = ''
    setOpen(false)
  }
  return (
    <Tour open={open} onClose={handleOnClose} steps={steps} />
  )
}

export default Guide