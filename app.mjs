import http from 'http'
const PORT = 5050

http.createServer((req, res) => {
res.writeHead(200)
res.end('Hello World\n')
}).listen(PORT)
