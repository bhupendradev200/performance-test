import { debug, time } from "console";

import makeRequest from "./sendRequest.js";
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { getYMDHIS, letency } from './utils.js'; // Assuming you have a utility function to get the current date and time
import { type } from "os";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let loggerProcess = null;
const OBJ_SIZE = 4;

/**
 * Initializes the logger process if debug logging is enabled.
 * Creates a child process for handling log operations asynchronously.
 * 
 * @param {Object} debugConfig - Configuration object for debug logging
 * @param {boolean} debugConfig.writeDebugLog - Whether to enable debug logging
 */
export const initializeLogger = (debugConfig) => {
    if (debugConfig.writeDebugLog && !loggerProcess) {
        loggerProcess = fork(path.join(__dirname, 'logger.js'));
    }
};

/**
 * Sends a message to the logger process.
 * Handles different types of messages including clear commands and object data.
 * 
 * @param {string|Object} message - Message to be logged. Can be a string or an object.
 * If string is 'clear', it triggers a cleanup of the logger process.
 */
export const logMessage = (message) => {
    if (!loggerProcess) return;

    if (message === 'clear') {
        loggerProcess.send({ type: 'clear' });
        return;
    }
    if (typeof message === 'object') {
        loggerProcess.send(message);
    }
    let timeStamp = getYMDHIS();
    loggerProcess.send({ type: 'log', dateTime: timeStamp, payload: message });

};




// This function runs a single batch sequentially (a → b → c → d)
/**
 * Executes a batch of requests sequentially.
 * Each request in the batch is executed one after another.
 * 
 * @param {Array<Object>} batchRequests - Array of request configurations
 * @param {string} batchRequests[].url - URL to send the request to
 * @param {string} batchRequests[].method - HTTP method (GET, POST, etc.)
 * @param {Object} batchRequests[].headers - Request headers
 * @param {Object} batchRequests[].data - Request body data
 * @param {Object} requestConfig - Configuration for the request execution
 * @param {string} batchId - Unique identifier for the batch
 * @returns {Promise<Array>} Array of results for each request in the batch
 */
async function runBatchSequentially(batchRequests, requestConfig, batchId) {
    const results = [];
    for (let i = 0; i < batchRequests.length; i++) {
        const req = batchRequests[i];
        let log_msz = `Batch ID ${batchId} | SequestialOrder:${i}`;
        try {
            logMessage(log_msz + ` | Request Initiated`);
            const res = await makeRequest(req.url, req.method, req.headers, { ...req.data }, { ...requestConfig, batchId: `${batchId}` });
            results.push({ status: 'fulfilled', batchId: log_msz, value: res });
            logMessage(log_msz + ` | status : 'fulfilled' | value: ${JSON.stringify(res)}`);
        } catch (err) {
            results.push({ status: 'rejected', reason: err });
            logMessage(`${log_msz} | status:rejected |  Error: ${err}`);
        }
    }
    return results;
}

// Main function: runs `parallelBatchCount` batches in parallel, repeated `seriesCount` times
/**
 * Main function that executes multiple batches of requests in parallel and repeats this process for a specified number of series.
 * 
 * @param {Array<Object>} batchRequests - Array of request configurations to be executed
 * @param {Object} requestConfig - Configuration for the parallel execution
 * @param {number} requestConfig.parallelBatchCount - Number of parallel batches to run (default: 10)
 * @param {number} requestConfig.seriesCount - Number of times to repeat the parallel execution (default: 10)
 * @param {boolean} requestConfig.writeDebugLog - Whether to enable debug logging (default: true)
 * @param {Object} debugConfig - Configuration for debug logging
 * @param {boolean} debugConfig.requestBody - Whether to log request body
 * @param {boolean} debugConfig.responseBody - Whether to log response body
 * @param {boolean} debugConfig.requestHeader - Whether to log request headers
 * @param {boolean} debugConfig.responseHeader - Whether to log response headers
 * @returns {Promise<void>}
 * 
 * @example
 * const batchRequests = [
 *   { url: 'http://api.example.com/endpoint', method: 'GET' }
 * ];
 * const requestConfig = {
 *   parallelBatchCount: 4,
 *   seriesCount: 7,
 *   writeDebugLog: true
 * };
 * await runBatchesInParallelSeries(batchRequests, requestConfig);
 */
async function runBatchesInParallelSeries(batchRequests, requestConfig = { parallelBatchCount: 10, seriesCount: 10, writeDebugLog: true }, debugConfig) {
    const { parallelBatchCount, seriesCount } = requestConfig;
    initializeLogger(requestConfig);
    console.time('TotalTime');
    const TotalTime = process.hrtime();
    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
        // console.time(`Series ${seriesIndex}`);
        let series = process.hrtime();

        const parallelBatches = [];
        for (let i = 0; i < parallelBatchCount; i++) {
            parallelBatches.push(runBatchSequentially(batchRequests, {...requestConfig,...debugConfig}, `Batch ID ${seriesIndex}- ParallelSet:${i}`));
        }

        const results = await Promise.allSettled(parallelBatches);
        // console.log(`✅ Batch ${seriesIndex} done:`, JSON.stringify(results));
        const successCount = results.filter(result => result.status === 'fulfilled').length;
        let t_letency = letency(series)
        logMessage({ type: 'time', batch_id: seriesIndex, parallelBatchCount: `${parallelBatchCount}`, successCount: `${successCount}`, intial_series_req: batchRequests.length, time: t_letency });
        logMessage(`Series ${seriesIndex} time : ${t_letency} ms | Success Count: ${successCount}`);
        // console.timeEnd(`Series ${seriesIndex}`);
    }
    const [seconds, nanoseconds] = process.hrtime(TotalTime);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    const total_requests = batchRequests.length * seriesCount * parallelBatchCount;
    logMessage({ type: 'final', msz: `Total time taken: ${durationInMs} ms | Total Request Sent :${total_requests}` });
    console.timeEnd('TotalTime');
    logMessage("clear");
}

export default runBatchesInParallelSeries;