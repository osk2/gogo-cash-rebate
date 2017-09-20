const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const config = require('./lib/config');
const util = require('./lib/util');
const rates = require('./lib/rate');

const multipartMiddleware = multipart();
const app = express();
const isProduction = (process.env.NODE_ENV === 'production');
const sslOptions = {
  ca: isProduction ? fs.readFileSync(config.ca) : '',
  key: isProduction ? fs.readFileSync(config.key) : '',
  cert: isProduction ? fs.readFileSync(config.cert) : ''
};

app.use(express.static('public'));
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
  const { bills, billsStart, billsEnd } = req.body;

  res.json(util.calculateTotalRebate(bills, billsStart, billsEnd));
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

if (isProduction) {
  https.createServer(sslOptions, app).listen(config.port, () => {
    console.log('App listening on port', config.port);
  });
} else {
  http.createServer(app).listen(config.port, () => {
    console.log('App listening on port', config.port);
  });
}
