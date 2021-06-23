const express = require('express')
const app = express();
require('../server/csv').webpackSetup(app);
require('dotenv').config({silent: true});
const openBrowser = require('react-dev-utils/openBrowser');

app.use(express.static('build'))

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

const port = process.env.PORT || 3000; 

app.listen( port, () => {
    console.log(`app started on port ${port}`);
    openBrowser(`http://localhost:${port}/`);
})