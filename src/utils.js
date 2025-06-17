 function getYMDHIS() {
    const now = new Date();

    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');

    return `${YYYY}${MM}${DD}-${HH}${mm}${SS}`;
}

function letency(time){
    const [seconds, nanoseconds] = process.hrtime(time);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    return durationInMs;
}

export { getYMDHIS,letency };