const http = require('http');
const fs = require('fs');
const path = require('path');


http.createServer(function(req, res) {  
    if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}: ${err}`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });

  } else {

    res.writeHead(404);
    res.end('404 - Not Found');
  }

}
).listen(3000);



console.log("server started on port 3000");
