'use strict';

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => {
	console.log('Server running on ' + port + ' port');
});

app.all('/echo', (request, response) => {
	let data = request.method === 'GET' ? request.query : request.body;

	response.setHeader('Content-Type', 'application/json');
	response.send(JSON.stringify(data, null, 2));
});
