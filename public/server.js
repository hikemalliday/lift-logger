const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

app.use(express.static('.'))
app.use(express.json())

app.listen(port, () => console.log(`Server has started on port: ${port}`))

app.get('/getalllifts', async (req, res) => 
{
    // Take a 'snapshot' of the collection called 'lifts' and send it back to user
     const snapshot = await db.collection('lifts').get()
     // I believe this 'bundles' the db objects into one array?
     return res.send(snapshot.docs.map(doc => doc.data()));  
})

app.get('/getarmday', async (req, res) => 
{ 
    // Take a snapshot of the 'armday' collection
    const snapshot = await db.collection('lifts').doc('armday').collection('armday').get()
    // I believe this 'bundles' the db objects into one array?
    return res.send(snapshot.docs.map(doc => doc.data()));  
})
app.get('/getlegday', async (req, res) => 
{ 
    // Take a snapshot of the 'armday' collection
    const snapshot = await db.collection('lifts').doc('legday').collection('legday').get()
    // I believe this 'bundles' the db objects into one array?
    return res.send(snapshot.docs.map(doc => doc.data()));  
})
app.get('/getpullday', async (req, res) => 
{ 
    // Take a snapshot of the 'armday' collection
    const snapshot = await db.collection('lifts').doc('pullday').collection('pullday').get()
    // I believe this 'bundles' the db objects into one array?
    return res.send(snapshot.docs.map(doc => doc.data()));  
})
app.get('/getpushday', async (req, res) => 
{ 
    // Take a snapshot of the 'armday' collection
    const snapshot = await db.collection('lifts').doc('pushday').collection('pushday').get()
    // I believe this 'bundles' the db objects into one array?
    return res.send(snapshot.docs.map(doc => doc.data()));  
})

app.post('/addlift', async (req, res) => {
    
    const { liftType, weight, reps } = req.body;
    const peopleRef = db.collection('lifts').doc();
    
    const res2 = await peopleRef.set({
        "lift": liftType,
        "weight": weight,
        "reps": reps,
        "date": new Date().toLocaleString(),
        "id": peopleRef.id
        } 
    , { merge: true })
    
    res.send(JSON.stringify(req.body))
})

app.post('/editlift', async (req, res) =>
{
    const { liftType, weight, reps } = req.body;
    const { id } = req.body;
    const peopleRef = db.collection('lifts').doc(id);
    // This is almost identical to '/addlift' but the 'id' is removed
    const res2 = await peopleRef.set({
        "lift": liftType,
        "weight": weight,
        "reps": reps,
        "date": new Date().toLocaleString()
        } 
    , { merge: true })
    
    res.send(JSON.stringify(req.body))
})

app.delete('/deletelift', async (req, res) => {
    let { id } = req.body
    let peopleRef = db.collection('lifts').doc(id)
    let res2 = await peopleRef.delete()
})



// Left-overs from the tutorial

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.post('/testpost', async (req, res) =>
{
    res.send(JSON.stringify('testpost'))
})

app.get('/friends/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in friends)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: friends[name] })
})