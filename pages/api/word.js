import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.resolve('db/hanswehr.sqlite')
const db = new sqlite3.Database(dbPath)

export default async function handler(req, res) {
  const { s } = req.query

  if (req.method === 'GET') {
    const parentQuery =
      'SELECT parent_id FROM DICTIONARY WHERE word=? AND is_root=1'

    db.get(parentQuery, [s], (parentErr, parentRow) => {
      if (parentErr) {
        res.status(500).json({ error: parentErr.message })
        return
      }

      if (!parentRow) {
        res.status(404).json({ error: 'Word not found with is_root=1' })
        return
      }

      const parentId = parentRow.parent_id

      const resultQuery =
        'SELECT * FROM DICTIONARY WHERE (word=? AND is_root=1) OR (parent_id=? AND is_root=0)'

      db.all(resultQuery, [s, parentId], (resultErr, rows) => {
        if (resultErr) {
          res.status(500).json({ error: resultErr.message })
          return
        }

        res.json(rows)
      })
    })
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
