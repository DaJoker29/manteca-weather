const endpoint = 'http://localhost:3000';

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

function cToFDegrees(celcius) {
    return celcius * 1.8 + 32;
}

export default function api() {
    displayRecent();
}