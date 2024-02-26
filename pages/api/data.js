import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.resolve('db/hanswehr.sqlite')
const db = new sqlite3.Database(dbPath)

export default async function handler(req, res) {
  const { arabicRoot } = req.query

  if (req.method === 'GET') {
    const query = 'SELECT * FROM DICTIONARY WHERE word=? AND is_root=1'

    db.all(query, [arabicRoot], (err, rows) => {
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
