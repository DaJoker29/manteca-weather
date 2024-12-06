const endpoint = 'http://localhost:3000';

async function getRecent() {
    const url = endpoint + '/all';
    const options = { method: 'GET' }

    const recent = await fetch(url, options)
        .then(response => response.json())
        .then(json => {
            json.forEach(temp => {
                if (temp.hasOwnProperty('body')) {
                    console.log(temp.body.data.values.temperature);
                }
            });
        });
    console.log(recent);
}

export default function api() {
    getRecent();
}