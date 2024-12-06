const endpoint = 'https://manteca-weather-aweym.ondigitalocean.app' || 'http://localhost:3000';

async function displayRecent() {
    const url = endpoint + '/recent';
    const options = { method: 'GET' }

    const response = await fetch(url, options);
    const recent = await response.json();

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
    const url = endpoint + '/recent';
    const options = { method: 'GET' }

    const response = await fetch(url, options);
    const json = await response.json();
    const current = json[0];

    console.log(current);

    const currentContainer = document.querySelector('#current');

    const fahrenheit = cToFDegrees(current.body.data.values.temperature).toFixed(1);
    const text = `Temperature: ${fahrenheit}°\nHumidity: ${current.body.data.values.humidity}%\nWind Speed: ${current.body.data.values.windSpeed}mph\nPrecipitation: ${current.body.data.values.precipitationProbability}%`

    const values = text.split('\n');
    console.log(values);

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