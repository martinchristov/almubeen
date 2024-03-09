import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'

function HansWehrDisplay({ arabicRoot, open }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/word/?s=${arabicRoot}`
        )
        const newData = await response.json()
        if (Array.isArray(newData) && newData.length > 0) setData(newData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [arabicRoot])

  return (
    <Modal open={open} footer={null}>
      <h1>Hans Wehr Dictionary</h1>
      {data.map((word) => (
        <div key={word.id}>
          <h2>Word: {word.word}</h2>
          <p>
            <strong>Definition:</strong> {ReactHtmlParser(word.definition)}
          </p>
        </div>
      ))}
    </Modal>
  )
}

export default HansWehrDisplay
