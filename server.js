const express = require('express');
const {FieldValue} = require('firebase-admin/firestore')
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const { db } = require('./firebase.js');

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.json())
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "js")))

app.post('/', async (req, res) => 
{
    const { name, status } = req.body 
    const peopleRef = db.collection('lift');
    const res2 = await peopleRef.set(
    {
        [name]: status
    })
 

})

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'index.html'))

})

