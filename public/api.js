const API_ENDPOINT = 'https://manteca-weather-aweym.ondigitalocean.app';
const WEATHER_CODES = {
    "0": "Unknown",
    "1000": "Clear, Sunny",
    "1100": "Mostly Clear",
    "1101": "Partly Cloudy",
    "1102": "Mostly Cloudy",
    "1001": "Cloudy",
    "2000": "Fog",
    "2100": "Light Fog",
    "4000": "Drizzle",
    "4001": "Rain",
    "4200": "Light Rain",
    "4201": "Heavy Rain",
    "5000": "Snow",
    "5001": "Flurries",
    "5100": "Light Snow",
    "5101": "Heavy Snow",
    "6000": "Freezing Drizzle",
    "6001": "Freezing Rain",
    "6200": "Light Freezing Rain",
    "6201": "Heavy Freezing Rain",
    "7000": "Ice Pellets",
    "7101": "Heavy Ice Pellets",
    "7102": "Light Ice Pellets",
    "8000": "Thunderstorm"
}

async function fetchData(route, options) {
    const url = API_ENDPOINT + route;
    const response = await fetch(url, options);
    return await response.json();
}

async function displayRecent() {
    const recents = await fetchData('/recent', { method: 'GET' });
    renderRecentsList(recents);
}

async function displayCurrent() {
    const rawData = await fetchData('/current', { method: 'GET' });
    const current = rawData.body.data;

    console.log(current);

    renderElement(`${cToFDegrees(current.values.temperature).toFixed(1)}°`, '#temperature');
    renderElement(WEATHER_CODES[current.values.weatherCode], '#weatherCode');
    renderElement(`Last Updated: ${moment(current.time).format('LT')}`, '#last-updated');
    renderElement(`${current.values.humidity}%`, '#humidity');
    renderElement(`${current.values.windSpeed} mph`, '#wind');
    renderElement(`${current.values.precipitationProbability}%`, '#precipitation');
}

function renderElement(text, selector) {
    const container = document.querySelector(selector);
    container.textContent = text;
}

function renderRecentsList(recentsArray) {
    const recentContainer = document.querySelector('#recent-updates');

    recentsArray.forEach(recent => {
        const temp = cToFDegrees(recent.body.data.values.temperature).toFixed(1);
        const output = `${temp}° — ${moment(recent.body.data.time).format('hh:mm')}`;

        const container = document.createElement('div');
        container.textContent = output;
        recentContainer.appendChild(container);
    })
}

function cToFDegrees(celcius) {
    return celcius * 1.8 + 32;
}

export default function api() {
    displayCurrent();
    displayRecent();
}