import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.resolve('db/hanswehr.sqlite')
const db = new sqlite3.Database(dbPath)

export default function handler(req, res) {
  const { s } = req.query

  let sSwapped

  if (s.includes('ي') || s.includes('ى')) {
    sSwapped = s.includes('ي') ? s.replace(/ي/g, 'ى') : s.replace(/ى/g, 'ي')
  }

  if (req.method === 'GET') {
    const wordSearch = sSwapped ? '(word=? OR word=?)' : 'word=?'
    const parentQuery = `SELECT parent_id FROM DICTIONARY WHERE ${wordSearch} AND is_root=1`
    const params = sSwapped ? [s, sSwapped] : [s]

    db.get(parentQuery, params, (parentErr, parentRow) => {
      if (parentErr) {
        res.status(500).json({ error: parentErr.message })
        return
      }

      if (!parentRow && s[1] === s[2]) {
        const substrQuery =
          'SELECT * FROM DICTIONARY WHERE word = ? AND is_root=1'
        const substrParams = [s.substr(0, 2)]

        db.all(substrQuery, substrParams, (substrErr, substrRows) => {
          if (substrErr) {
            res.status(500).json({ error: substrErr.message })
            return
          }

          if (!substrRows || substrRows.length === 0) {
            res.status(404).json({ error: 'Word not found with is_root=1' })
            return
          }

          res.json(substrRows)
        })
      } else if (!parentRow) {
        res.status(404).json({ error: 'Word not found with is_root=1' })
        return
      }

      const parentId = parentRow.parent_id

      const resultQuery = `SELECT * FROM DICTIONARY WHERE parent_id=?`

      db.all(resultQuery, [parentId], (resultErr, rows) => {
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
