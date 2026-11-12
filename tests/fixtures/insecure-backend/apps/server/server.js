const http = require('http');

// Flaw 1: No rate limiting
// Flaw 2: Insecure plaintext password comparison (Timing attack)
// Flaw 3: No /healthz or /readyz probes
// Flaw 4: Missing centralized error envelope
const server = http.createServer((req, res) => {
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            // Insecure equality check vulnerable to timing attack
            if (data.password === 'admin123') {
                res.writeHead(200);
                res.end(JSON.stringify({ status: 'logged_in' }));
            } else {
                res.writeHead(401);
                res.end('Unauthorized');
            }
        });
    }
});

server.listen(4000);
