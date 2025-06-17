
import makeRequest from "./sendRequest.js";

// Examples
// makeRequest('http://localhost:3003/hello'); // HTTP GET
// makeRequest('http://localhost:3003/data', 'POST', { name: 'Alice' }); // HTTP POST
// makeRequest('https://jsonplaceholder.typicode.com/posts/1'); // HTTPS GET




/**
 * Test function that makes 10 sequential requests to the specified URL with the given method and data.
 * @param {string} url - The URL to make the request to. Default is 'http://localhost:3003/data'
 * @param {string} method - The HTTP request method. Default is 'POST'
 * @param {object} data - The request body data. Default is { request_body: 'value_0' }, { request_body: 'value_1' }, ...
 * @example test('http://localhost:3003/hello', 'GET')
 * @example test('http://localhost:3003/data', 'POST', { name: 'Alice' })
 */
async function test() {

    const debugConfig = { requestBody: false, requestHeader: false, responseHeader: false, responseBody: false };
    const batchCount = 3; // Batch ID for logging purposes
    const BatchSize = 5; // Number of requests in each batch
    const url = 'http://localhost:3003/data'; // Replace with your URL
    const method = 'POST'; // or 'POST'
    // const data = { name: 'Alice' }; // Replace with your data if needed
    for (let batch = 0; batch < batchCount; batch++) {
        const promise_array = [];

        for (let i = 0; i < BatchSize; i++) {
            const requestIndex = batch * 10 + i;
            promise_array.push(makeRequest(url, method, { request_body: `value_${requestIndex}` },debugConfig));
        }

        try {
            const results = await Promise.allSettled(promise_array);
            console.log(`✅ Batch ${batch} done:`, JSON.stringify(results));
        } catch (err) {
            console.error(`❌ Error in batch ${batch}:`, err);
        }
        console.timeEnd(`Batch ${batch}`);
    }
    console.timeEnd('TotalTime');
}
test();
// makeRequest('http://localhost:3003/hello')
