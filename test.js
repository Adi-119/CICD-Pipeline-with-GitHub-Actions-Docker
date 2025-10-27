const http = require('http');

const options = { hostname: 'localhost', port: 3000, path: '/', method: 'GET', timeout: 5000 };

const req = http.request(options, res => {
  if (res.statusCode === 200) {
    console.log('OK');
    process.exit(0);
  } else {
    console.error('FAIL, status:', res.statusCode);
    process.exit(1);
  }
});

req.on('error', err => { console.error('ERROR', err); process.exit(1); });
req.end();
