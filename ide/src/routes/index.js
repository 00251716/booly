const express = require('express');
const router = express.Router();

const addon = require('./../code/build/Release/addon');

router.get('/', (req, res)=>{
	res.render('index.html');
});

router.get('/testing', (req, res)=>{
	console.time('c++');
	console.log(addon.sum());
	console.timeEnd('c++');

	console.time('js');
	let a = 3.1415926, b = 2.718;
	for (let i = 0; i < 1000000000; i++) {
		a += b;
	}
	let total = a;
	console.timeEnd('js');
});

module.exports = router;

