'use strict'
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

//settings
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

//routes
app.use(require('./routes/index'));

//static files
app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () => {
	console.log('Servidor iniciado');
});