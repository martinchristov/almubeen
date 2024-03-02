import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'

function HansWehrDisplay({ arabicRoot, open }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/word/?s=${arabicRoot}`
        )
        const newData = await response.json()
        setData(newData)
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
        <>
          <h2>Word: {word.word}</h2>
          <p key={word.id}>
            <strong>Definition:</strong> {word.definition}{' '}
          </p>
        </>
      ))}
    </Modal>
  )
}

export default HansWehrDisplay
