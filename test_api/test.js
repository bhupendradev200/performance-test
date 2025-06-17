import runBatchesInParallelSeries from '../index.js';

// Example 1: Simple GET request test
const simpleGetTest = () => {
    const batchRequests = [
        { 
            url: 'http://localhost:3003/hello', 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    ];

    const requestConfig = {
        parallelBatchCount: 3,
        seriesCount: 2,
        writeDebugLog: true
    };

    console.log('Running Simple GET Test...');
    runBatchesInParallelSeries(batchRequests, requestConfig);
};

// Example 2: Multiple endpoints test
const multipleEndpointsTest = () => {
    const batchRequests = [
        { 
            url: 'http://localhost:3003/data', 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { msg: 'Test Message' }
        },
        { 
            url: 'http://localhost:3003/hello', 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    ];

    const requestConfig = {
        parallelBatchCount: 4,
        seriesCount: 3,
        writeDebugLog: true
    };

    const debugConfig = {
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        responseHeader: true
    };

    console.log('Running Multiple Endpoints Test...');
    runBatchesInParallelSeries(batchRequests, requestConfig, debugConfig);
};

// Run the tests
console.log('Starting API Load Tests...\n');

// Run simple GET test
simpleGetTest();

// Wait for 5 seconds before running the next test
setTimeout(() => {
    console.log('\n---\n');
    multipleEndpointsTest();
}, 5000); 