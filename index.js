const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.0sfxnq9.mongodb.net/covid`, { useNewUrlParser: true, useUnifiedTopology: true });

const countrySchema = new mongoose.Schema({
    totalcases: Number,
    totaldeaths: Number,
    recovered: Number
});

const Country = mongoose.model('countrydetails', countrySchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/data', async (req, res) => {
    let name = req.body.countryname;
    let nameJson={name:name};
    try {
        // Perform a case-insensitive search using Mongoose
        const result = await Country.findOne({ name: { $regex: new RegExp(name, 'i') } });

        if (result) {
            res.render('index', { result:result,name:nameJson});
            console.log(result);
        } else {
            const errorMessage = "Country details dont found";
            res.send(`<script>alert("${errorMessage}"); window.location.href = "/";</script>`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('index', { name: 'An error occurred.' });
    }
});

app.post('/',(req,res)=>res.render('index'));

app.listen(3000, () => console.log(`Server started`));