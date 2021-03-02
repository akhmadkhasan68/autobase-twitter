var T = require('./twit');
var express = require('express');
var app = express();
const _port = 3000;

app.get('/', (req, res, next) => {
    T.post('statuses/update', {
        status: 'Halo!'
    }, function(err, data, response)
    {
        res.json(data);
    });
});

app.listen(_port, () => { console.log(`server running on ${_port}`)});