const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()

app.use(cors())
app.use(express.json())

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
  databaseURL: process.env.FIREBASE_DB_URL
})

const db = admin.database()

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

app.listen(process.env.PORT || 3000)