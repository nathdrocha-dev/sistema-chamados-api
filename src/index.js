const http = require("http");
const server = http.createServer((req, res) => {
    if(req.method === "GET" && req.url === "/chamados"){
        res.end("Lista de chamados")
    } else {
        res.end("Rota não encontrado")
    }
});
server.listen(3000);
