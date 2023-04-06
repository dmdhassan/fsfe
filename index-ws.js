const express = require("express");
const server = require("http").createServer();

const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: __dirname});
})

server.on('request', app);
server.listen(3000, () => console.log("server running on PORT 3000"));

process.on('SIGINT', () => {
    console.log("-- closing web sockets connection--");
    wss.clients.forEach(function each(client) {
        client.close();
    });

    server.close(() => {
        shutdownDB();
    })
})

/** BEGIN WEBSOCKET */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({server: server});

wss.on("connection", function connection(ws) {
    const numOfClients = wss.clients.size;
    console.log(`Clients connected: ${numOfClients}`);

    wss.broadcast(`Current visitors: ${numOfClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to my server");
    }

    db.run(`INSERT INTO VISITORS (count, time) VALUES (${numOfClients}, datetime('now'))`)

    ws.on("close", function close () {
        console.log("A client has disconnected")
    })
});

wss.broadcast = function broadcast (data) {
    wss.clients.forEach( function each(client) {
        client.send(data)
    });
}
/**end web socket */
/**begin database */
const sqlite = require("sqlite3");
const db = new sqlite.Database(':memory');

db.serialize(() => {
    // db.run(`
    //     CREATE TABLE visitors (
    //         count INTEGER,
    //         time TEXT
    //     )
    // `)
});


function getCounts() {
    db.each(" SELECT * FROM visitors", (err, row) => {
        console.log(row)
    })
}

function shutdownDB() {

    getCounts();
    console.log('db is shutting down . . .');
    db.close();
}