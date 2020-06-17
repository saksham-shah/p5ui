const express = require('express'), app = express();

const port = 3000;

app.listen(port);

app.get('/', (req, res) => {
    // Sends the file to the client
    res.sendFile('public/index.html', { root: __dirname });
  });

app.use(express.static(__dirname + '/public'));

console.log(`Server starting on port ${port}`);