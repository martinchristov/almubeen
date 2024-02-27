import React, { useEffect, useState } from 'react'

function HansWehrDisplay({ arabicRoot }) {
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
    <div>
      <h1>Data from SQLite:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default HansWehrDisplay
