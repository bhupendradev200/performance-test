import { debug } from 'console';
import runBatchesInParallelSeries from './src/sequest_parallel_request.js';

// IF YOU WANT ONLY SINGLE REQUEST THEN YOU SEND SINGLE REQUEST 
const batchRequests = [
    { url: 'http://localhost:3003/data', method: 'POST',headers:{custome_header:"additional Header"}, data: { msg: 'Step A' } },
    { url: 'http://localhost:3003/hello', method: 'GET', headers:{custome_header:"additional Header"},data: { msg: 'Step B' } }
];

// This function runs a single batch sequentially (a → b → c → d)
// async function runBatchSequentially(batchRequests, batchId) {    
const requestConfig = { parallelBatchCount: 4, seriesCount: 7, writeDebugLog: true }

//To write following detail in debug log file
const debugConfig = { requestBody: true, responseBody: true, requestHeader: true, responseHeader: true };


runBatchesInParallelSeries(batchRequests, requestConfig, debugConfig);