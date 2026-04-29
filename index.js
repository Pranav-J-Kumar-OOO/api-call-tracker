const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()

app.use(cors())
app.use(express.json())

console.log('Starting app...')
console.log('FIREBASE_DB_URL:', process.env.FIREBASE_DB_URL)
console.log('FIREBASE_CREDENTIALS exists:', !!process.env.FIREBASE_CREDENTIALS)

try {
  const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS)
  console.log('Credentials parsed OK, project_id:', creds.project_id)

  admin.initializeApp({
    credential: admin.credential.cert(creds),
    databaseURL: process.env.FIREBASE_DB_URL
  })
  console.log('Firebase initialized OK')
} catch (e) {
  console.error('Firebase init failed:', e.message)
  process.exit(1)
}

const db = admin.database()

app.get('/', (req, res) => res.json({ status: 'ok' }))

app.get('/track', async (req, res) => {
  const { userId, projectId, idname } = req.query
  const ref = db.ref(`users/${userId}/${projectId}/${idname}`)
  await ref.transaction(count => (count || 0) + 1)
  res.json({ success: true })
})

app.post('/track', async (req, res) => {
  const { userId, projectId, idname } = req.body
  const ref = db.ref(`users/${userId}/${projectId}/${idname}`)
  await ref.transaction(count => (count || 0) + 1)
  res.json({ success: true })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000)
})