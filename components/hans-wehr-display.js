import React, { useEffect, useState } from 'react'

function HansWehrDisplay() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data')
        const newData = await response.json()
        setData(newData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, []) // The empty dependency array ensures that useEffect runs only once, similar to componentDidMount

  return (
    <div>
      <h1>Data from SQLite:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default HansWehrDisplay
