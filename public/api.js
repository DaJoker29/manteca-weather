const endpoint = 'http://localhost:3000';

async function getRecent() {
    const url = endpoint + '/recent';
    const options = { method: 'GET' }

    const recent = await fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            json.forEach(temp => {
                console.log(`Temperature: ${temp.body.data.values.temperature} — ${moment(temp.body.data.time).format('MM-DD-YYYY')}`)
            });
        })
        .catch(err => console.error(err));
}

export default function api() {
    getRecent();
}