import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'

function HansWehrDisplay({ arabicRoot, open }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // currently pointing at localhost, needs fixing
          `http://localhost:3000/api/word/?s=${arabicRoot}`
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
    <Modal className="hans-wehr-modal" open={open} footer={null}>
      <h1>Hans Wehr Dictionary</h1>
      {data.map((word) => (
        <div key={word.id}>
          <h2>Word: {word.word}</h2>
          <p>
            <strong>Definition:</strong> {word.definition}
          </p>
        </div>
      ))}
    </Modal>
  )
}

export default HansWehrDisplay
