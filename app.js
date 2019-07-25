const fs = require('fs');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const config = require('./lib/config');
const util = require('./lib/util');
const rates = require('./lib/rate');

const multipartMiddleware = multipart();
const app = express();

app.use(express.static('public'));
app.use('/components', express.static('node_modules'));
app.use(helmet());
app.disable('x-powered-by');

app.get('/rateLists', (req, res) => {
  const result = {};

  result.count = rates.length;
  result.rates = rates;
  res.json(result);
});

app.post('/converter', multipartMiddleware, (req, res) => {
  const xlsPath = req.files.xls.path;
  let bills = util.parseXLS(xlsPath);

  fs.unlinkSync(xlsPath);
  bills = util.processBills(bills);
  res.json(bills);
});

app.post('/calculate', bodyParser.json(), (req, res) => {
  const { bills, start, end } = req.body;

  res.json(util.calculateTotalRebate(bills, start, end));
});

app.post('/feedback', multipartMiddleware, (req, res) => {
  let currentFeedback;

  if (Object.keys(req.body).length === 0) {
    res.status(500).send('Empty request.');
    return;
  }
  fs.readFile('./feedback.json', (readErr, data) => {
    if (readErr) {
      res.status(500).send('Error occurred while open file.');
      return;
    }
    currentFeedback = JSON.parse(data);
    currentFeedback.push({
      name: req.body['input-name'],
      item: req.body['input-store'],
      detail: req.body['input-detail'],
      rate: req.body['input-rate'],
      comment: req.body['input-comment']
    });
    currentFeedback = JSON.stringify(currentFeedback, null, 2);
    fs.writeFile('./feedback.json', currentFeedback, (writeErr) => {
      if (writeErr) {
        res.status(500).send('Error occurred while write file.');
        return;
      }
      res.json({
        success: true
      });
    });
  });
});


http.createServer(app).listen(config.port, () => {
  console.log('App listening on port', config.port);
});
