const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')


app.use(express.static('.'))
app.use(express.json())


const friends = {
    'james': 'friend',
    'larry': 'friend',
    'lucy': 'friend',
    'banana': 'enemy',
}

app.get('/stuff', async (req, res) => {
   const stuff = { content: "stuff" }

    res.status(200).send(JSON.stringify(friends))
})

app.post('/stuff', async (req, res) => {
    const stuff = { content: "stuff" };
    console.log(req.body.body);
     res.status(200).send(JSON.stringify(stuff))
 })



app.get('/getAllLifts', async (req, res) => 
{
    // Take a 'snapshot' of the collection called 'lifts' and send it back to user
     const snapshot = await db.collection('lifts').get()
     // I believe this 'bundles' the db objects into one array?
     return res.send(snapshot.docs.map(doc => doc.data()));  
})

app.get('/friends/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in friends)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: friends[name] })
})

app.post('/addlift', async (req, res) => {
    // *saving for revert const { name, status } = req.body
    // const { liftType, weight, reps, date} = req.body;
    
    const { liftType, weight, reps } = req.body;
    
    const peopleRef = db.collection('lifts').doc(liftType);
    const res2 = await peopleRef.set({
        "lift": liftType,
        "weight": weight,
        "reps": reps,
        "date": new Date().toLocaleString()
        } 
    , { merge: true })
    // friends[name] = status
    res.status(200).send(JSON.stringify(req.body))
})

app.post('/testpost', async (req, res) =>
{
    res.send(JSON.stringify('testpost'))
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))