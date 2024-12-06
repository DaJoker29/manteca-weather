import mongoose from 'mongoose';
import express from 'express';
import { schedule } from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Connecting to MongoDB
const dbPass = 'r3P4jXA0W6gO8275';
const dbUrl = `mongodb+srv://doadmin:${dbPass}@db-mongodb-sfo3-94584-3f8c67d1.mongo.ondigitalocean.com/admin?replicaSet=db-mongodb-sfo3-94584&tls=true&authSource=admin`;

console.log(`Connecting to Database: ${dbUrl}`);
await mongoose.connect(dbUrl)
    .then(() => { console.log('Successfully connected to DB') })
    .catch(err => console.error(err));

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const temperatureSchema = new Schema({
    zip: Number,
    body: Object,
});

const Temps = mongoose.model('Temperature', temperatureSchema);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(path.resolve(), 'public') });
});

app.get('/zip/:zip', (req, res) => {
    const url = `https://api.tomorrow.io/v4/weather/realtime/?location=${req.params.zip}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            apikey: 'nxv23IaiVCPP8mLj9sgYbQp7oWpaNUMF'
        }
    }

    fetch(url, options)
        .then(res => res.json())
        .then(async (body) => {
            console.log(body);
            await Temps.create({ zip: req.params.zip, body }).then(x => console.log(x))
        })
        .then(res.send('Fetched'))
        .then(json => console.log(json))
        .catch(err => console.error(err))
        ;
});

app.get('/zip', async (req, res) => {
    const temps = await Temps.find({});
    res.send(temps);
});



app.listen(port, () => {
    console.log(`Weather app is running on port ${port}.`);
});

schedule('*/10 * * * *', () => {
    fetchWeatherData(95337);
});

function fetchWeatherData(zipCode) {
    const url = `https://api.tomorrow.io/v4/weather/realtime/?location=${zipCode}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            apikey: 'nxv23IaiVCPP8mLj9sgYbQp7oWpaNUMF'
        }
    }

    fetch(url, options)
        .then(async res => {
            const body = res.json()
            await Temps.create({ zipCode, body });
        })
        .then(() => console.log('Successfully fetched weather data.'))
        .catch(err => console.error(err));
}

// Add NodeCron to pull from API every ten minutes
