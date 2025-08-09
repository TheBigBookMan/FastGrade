import axios from 'axios';

export default function () {
    return (logObj) => {
        axios.post('https://your-dashboard-api.com/logs', logObj)
        .catch(() => {}); // Never block the main thread
    };
}
