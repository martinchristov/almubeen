// pages/api/data.js
import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.resolve('db/hanswehr.sqlite')
const db = new sqlite3.Database(dbPath)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('hi', db.all)
    // need to receive parameter and call same word from db
    // just using a random id now to get it working
    db.all('SELECT * FROM DICTIONARY WHERE id=2', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json(rows)
    })
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
