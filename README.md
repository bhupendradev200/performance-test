# API Load Testing Tool

A powerful and flexible API load testing tool that allows you to perform parallel and sequential API testing with detailed performance metrics and logging.

## Features

- Parallel request execution
- Sequential series testing
- Detailed performance metrics
- Real-time logging
- Memory and CPU usage monitoring
- Support for both HTTP and HTTPS requests
- Customizable request headers and body
- Comprehensive debug logging

## Installation

```bash
npm install performance-test
```

## Quick Start

1. Create a new file (e.g., `test.js`) and import the testing function:

```javascript
import runBatchesInParallelSeries from 'performance-test';

// Define your API requests
const batchRequests = [
    { 
        url: 'http://your-api.com/endpoint1', 
        method: 'POST',
        headers: { 'Authorization': 'Bearer your-token' },
        data: { key: 'value' }
    },
    { 
        url: 'http://your-api.com/endpoint2', 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }
];

// Configure the test
const requestConfig = {
    parallelBatchCount: 4,  // Number of parallel batches
    seriesCount: 7,         // Number of times to repeat the parallel execution
    writeDebugLog: true     // Enable detailed logging
};

// Configure debug logging
const debugConfig = {
    requestBody: true,      // Log request body
    responseBody: true,     // Log response body
    requestHeader: true,    // Log request headers
    responseHeader: true    // Log response headers
};

// Run the test
runBatchesInParallelSeries(batchRequests, requestConfig, debugConfig);
```

## Configuration Options

### Request Configuration (`requestConfig`)

```javascript
const requestConfig = {
    parallelBatchCount: 4,  // Number of parallel batches to run
    seriesCount: 7,         // Number of times to repeat the parallel execution
    writeDebugLog: true     // Enable/disable debug logging
};
```

### Debug Configuration (`debugConfig`)

```javascript
const debugConfig = {
    requestBody: true,      // Log request body
    responseBody: true,     // Log response body
    requestHeader: true,    // Log request headers
    responseHeader: true    // Log response headers
};
```

## Example Use Cases

### 1. Basic API Testing

```javascript
import runBatchesInParallelSeries from 'performance-test';

const batchRequests = [
    { 
        url: 'http://api.example.com/users', 
        method: 'GET'
    }
];

const requestConfig = {
    parallelBatchCount: 5,
    seriesCount: 3,
    writeDebugLog: true
};

runBatchesInParallelSeries(batchRequests, requestConfig);
```

### 2. Complex API Testing with Multiple Endpoints

```javascript
import runBatchesInParallelSeries from 'performance-test';

const batchRequests = [
    { 
        url: 'http://api.example.com/users',
        method: 'POST',
        headers: { 'Authorization': 'Bearer token123' },
        data: { name: 'John Doe', email: 'john@example.com' }
    },
    { 
        url: 'http://api.example.com/orders',
        method: 'GET',
        headers: { 'Authorization': 'Bearer token123' }
    },
    { 
        url: 'http://api.example.com/products',
        method: 'GET'
    }
];

const requestConfig = {
    parallelBatchCount: 10,
    seriesCount: 5,
    writeDebugLog: true
};

const debugConfig = {
    requestBody: true,
    responseBody: true,
    requestHeader: true,
    responseHeader: true
};

runBatchesInParallelSeries(batchRequests, requestConfig, debugConfig);
```

## Logging

The tool generates detailed logs in the following format:
- File name: `PT_Test_YYYYMMDD-HHMMSS.log`
- Includes:
  - Request and response details
  - Performance metrics
  - Memory usage
  - CPU statistics
  - Success/failure counts
  - Timing information

## Performance Metrics

The tool provides real-time monitoring of:
- Memory usage (heap, RSS, external)
- CPU usage (user and system time)
- Request latency
- Success/failure rates
- Total execution time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Author

Bhupendra M.
