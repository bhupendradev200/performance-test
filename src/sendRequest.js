// makeRequest.js
import { response } from 'express';
import { request as httpRequest, request } from 'http';
import { request as httpsRequest } from 'https';
import { type } from 'os';
import { URL } from 'url';

/**
 * Makes an HTTP/HTTPS request to the specified URL.
 * Supports both HTTP and HTTPS protocols, various HTTP methods, and custom headers.
 * 
 * @param {string} urlString - The URL to send the request to
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, etc.)
 * @param {Object} [headers=null] - Custom headers to include in the request
 * @param {Object} [data=null] - Request body data (will be JSON stringified)
 * @param {Object} [debugConfig={}] - Configuration for debug logging
 * @param {boolean} [debugConfig.requestBody=false] - Whether to include request body in debug output
 * @param {boolean} [debugConfig.requestHeader=false] - Whether to include request headers in debug output
 * @param {boolean} [debugConfig.responseHeader=false] - Whether to include response headers in debug output
 * @param {boolean} [debugConfig.responseBody=false] - Whether to include response body in debug output
 * @returns {Promise<Object>} A promise that resolves with the response data
 * 
 * @example
 * // Simple GET request
 * makeRequest('http://api.example.com/data')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * 
 * @example
 * // POST request with data and headers
 * makeRequest('http://api.example.com/users', 'POST', 
 *   { 'Authorization': 'Bearer token123' },
 *   { name: 'John Doe' }
 * ).then(response => console.log(response));
 */
function makeRequest(urlString, method = 'GET', headers = null, data = null, debugConfig = { requestBody: false, requestHeader: false, responseHeader: false, responseBody: false }) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const isHttps = url.protocol === 'https:';
    const requestLib = isHttps ? httpsRequest : httpRequest;
    const result = {};
    const payload = data ? JSON.stringify(data) : null;
    const defualt_headers = {
      'Content-Type': 'application/json',
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: { ...defualt_headers, ...headers },
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
      if (debugConfig.requestBody) result.requestBody = payload;
      if (debugConfig.requestHeader) result.requestHeader = options;
    }

    const req = requestLib(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        result.responseStatus = res.statusCode
        if (debugConfig.responseHeader) result.responseHeader = res.headers;
        try {
          const parsed = JSON.parse(body);
          if (debugConfig.responseBody) result.responseBody = parsed;
          resolve({ response: result });
        } catch {
          resolve({ response: { ...result, body } });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (payload) req.write(payload);
    req.end();
  });
}

export default makeRequest;