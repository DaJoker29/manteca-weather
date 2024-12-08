const API_ENDPOINT = 'https://manteca-weather-aweym.ondigitalocean.app';

async function fetchData(route, options) {
    const url = API_ENDPOINT + route;
    const response = await fetch(url, options);
    return await response.json();
}

async function displayRecent() {
    const recent = await fetchData('/recent', { method: 'GET' });
    const recentContainer = document.querySelector('#recent-updates');

    recent.forEach(temp => {
        const fahrenheit = cToFDegrees(temp.body.data.values.temperature).toFixed(1);
        const text = `${fahrenheit}° — ${moment(temp.body.data.time).format('hh:mm')}`;

        const divContainer = document.createElement('div');
        divContainer.textContent = text;
        recentContainer.appendChild(divContainer);

        console.log(text);
    });

    console.log(recent);
}

async function displayCurrent() {
    const current = await fetchData('/current', { method: 'GET' });
    const currentContainer = document.querySelector('#current');

    const fahrenheit = cToFDegrees(current.body.data.values.temperature).toFixed(1);
    const text = `Temperature: ${fahrenheit}°\nHumidity: ${current.body.data.values.humidity}%\nWind Speed: ${current.body.data.values.windSpeed}mph\nPrecipitation: ${current.body.data.values.precipitationProbability}%`

    const values = text.split('\n');

    values.forEach(value => {
        const divContainer = document.createElement('div');
        divContainer.textContent = value;
        currentContainer.appendChild(divContainer);
    })

}

function cToFDegrees(celcius) {
    return celcius * 1.8 + 32;
}

export default function api() {
    displayCurrent();
    displayRecent();
}