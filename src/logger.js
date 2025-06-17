// logger.js
import fs from 'fs';
import { get } from 'http';
import { getYMDHIS } from './utils.js'; // Assuming you have a utility function to get the current date and time
import { clear, log } from 'console';

let logBuffer = [];
let fileName = `PT_Test_${getYMDHIS()}.log`;

let startCpu = process.cpuUsage();
const letency = []
let batchObject = {}
const OBJ_SIZE = 3;
let final_msz = '';

/**
 * Handles incoming messages from the parent process.
 * Processes different types of messages: clear, time, final, and regular logs.
 * 
 * @param {Object} logEntry - The message received from the parent process
 * @param {string} logEntry.type - Type of the message ('clear', 'time', 'final', or 'log')
 * @param {Object} logEntry.data - Additional data for the message
 */
process.on('message', (logEntry) => {
    if (logEntry.type === 'clear') {
        letency.push({ ...batchObject })
        handleExit();
        return;
    }
    if (logEntry.type === 'time') {
        let series = Object.keys(batchObject).length
        if (series == OBJ_SIZE) {
            letency.push({ ...batchObject })
            batchObject = {}
            series = 0;
        }
        const { parallelBatchCount, successCount, batch_id, time, intial_series_req } = logEntry;
        batchObject[`BatchSet-${parallelBatchCount}-${series + 1}`] = `BatchID${batch_id}(Suc.${successCount}) in ${time}ms]`;
        return;
    }
    if (logEntry.type === 'final') {
        final_msz = logEntry.msz
        return;
    }

    logBuffer.push(logEntry);
});

/**
 * Periodically writes buffered logs to the log file.
 * Processes logs in batches of 200 entries to prevent memory issues.
 */
const bufferSet = setInterval(() => {
    if (logBuffer.length === 0) return;

    const toWrite = logBuffer.splice(0, 200); // Remove 200 logs
    const logString = toWrite.map(entry => JSON.stringify(entry)).join('\n') + '\n';
    const dt = getYMDHIS();
    fs.appendFile(fileName, logString, (err) => {
        if (err) console.error('❌ Error writing logs:', err);
    });
}, 600);

/**
 * Monitors and displays system metrics and test progress.
 * Updates the console with memory usage, CPU statistics, and test results.
 */
const monitor = setInterval(() => {
    const memory = process.memoryUsage();
    console.clear();

    console.table([{
        heapUsed: formatMemory(memory.heapUsed),
        heapTotal: formatMemory(memory.heapTotal),
        rss: formatMemory(memory.rss),
        external: formatMemory(memory.external),
        // userTime: cpu.user ,
        CPU: process.cpuUsage().system,
        User: process.cpuUsage().user,
    }]);

    if (letency.length === 0) return;
    // console.log('Letency:', letency);
    console.table(letency)
    console.log(final_msz)
    console.log('Log writing in progress...');
}, 1000);

/**
 * Formats memory size in bytes to a human-readable string.
 * 
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string with appropriate unit (B, KB, MB, GB)
 */
function formatMemory(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

/**
 * Handles cleanup when the parent process disconnects.
 * Ensures proper shutdown of the logger process.
 */
process.on('disconnect', () => {
    console.log('Parent disconnected. Exiting child.');
    process.exit(0);
});

/**
 * Handles the cleanup and shutdown of the logger process.
 * Waits for all buffered logs to be written before exiting.
 */
function handleExit() {
    // console.log('Stopping logger process...');
    const clearTimer = setInterval(() => {
        if (logBuffer.length === 0) {
            // console.log('No logs to write, stopping interval...', JSON.stringify(logBuffer));
            clearInterval(monitor);
            clearInterval(this);
            clearInterval(bufferSet);
            // console.log(final_msz);
            // console.log(letency);
            console.log('Log writing completed. Exiting...');
            process.exit(0);
        }
    }, 1000); // Check every hour
}


