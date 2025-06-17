import express from 'express';

const app = express();
const PORT = 3003;

// Middleware to parse JSON request body
app.use(express.json());

// GET route
app.get('/hello', (req, res) => {
    let timer = Math.floor(Math.random() * 1000)
    // Simulate a delay of 2 seconds before sending the response
    setTimeout(() => {
        // console.log('GET request received');
        res.send('Hello from GET request!');
    }, timer); // Simulate a delay of 2 seconds
});

// POST route
app.post('/data', (req, res) => {
    const receivedData = req.body;
    let timer = Math.floor(Math.random() * 10)
    console.log('Timer Value', timer);
    setTimeout(() => {
        res.json({
            response: 'POST request received'+"#"+new Date().toISOString(),
            data: receivedData,
        });
    }, timer); // Simulate a delay of 2 seconds
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});