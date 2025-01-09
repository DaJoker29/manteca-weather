import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { schedule } from 'node-cron';
import path from 'path';

// Initialize ExpressJS
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));


// Connect to MongoDB
const dbUrl = process.env.DB_CONNECT || '';

console.log(`Connecting to Database: ${dbUrl}`);
await mongoose.connect(dbUrl)
    .then(() => { console.log('Successfully connected to DB') })
    .catch(err => console.error(err));


// Set DB Model
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

// API Routing
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
    const recents = await Temps.find({}).sort({ "body.data.time": -1 }).limit(20);
    res.json(recents);
});

app.get('/current', async (req, res) => {
    const current = await Temps.find({}).sort({ "body.data.time": -1 }).limit(1);
    res.json(current[0]);
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(path.resolve(), 'public') });
});


// Initialize Server
app.listen(port, () => {
    console.log(`Weather app is running on port ${port}.`);
});

// Calls to Weather API
async function saveWeatherData(zipCode) {
    const url = `https://api.tomorrow.io/v4/weather/realtime/?location=${zipCode}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            apikey: process.env.API_KEY
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