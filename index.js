import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { schedule } from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));


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
    zip: {
        type: Number,
        required: true
    },
    body: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Temps = mongoose.model('Temperature', temperatureSchema);

app.get('/temps/delete', async (req, res) => {
    await Temps.deleteMany({});
    res.send('Deleted');
});

app.get('/zip/:zip', (req, res) => {
    saveWeatherData(req.params.zip);
    res.send('Saving...');
});

app.get('/all', async (req, res) => {
    const temps = await Temps.find({});
    res.json(temps);
});

app.get('/recent', async (req, res) => {
    const recents = await Temps.find().sort('-createdAt').limit(10);
    res.json(recents);
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(path.resolve(), 'public') });
});

app.listen(port, () => {
    console.log(`Weather app is running on port ${port}.`);
});

async function saveWeatherData(zipCode) {
    const url = `https://api.tomorrow.io/v4/weather/realtime/?location=${zipCode}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            apikey: 'nxv23IaiVCPP8mLj9sgYbQp7oWpaNUMF'
        }
    }

    await fetch(url, options)
        .then(res => res.json())
        .then(async json => await Temps.create({ zip: zipCode, body: json }))
        .then(() => console.log('Successfully fetched weather data.'))
        .catch(err => console.error(err));
}

// Schedule API fetches
schedule('*/10 * * * *', () => {
    saveWeatherData(95337);
});