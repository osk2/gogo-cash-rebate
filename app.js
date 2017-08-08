const fs = require('fs');
const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const config = require('./lib/config');
const util = require('./lib/util');
const isProduction = (process.env.NODE_ENV === 'production');
const sslOptions = {
  ca: isProduction ? fs.readFileSync(config.ca) : '',
  key: isProduction ? fs.readFileSync(config.key) : '',
  cert: isProduction ? fs.readFileSync(config.cert) : ''
};

app.use(express.static('public'));
app.use(helmet());
app.disable('x-powered-by');

app.post('/converter', multipartMiddleware, (req, res) => {
  const xlsPath = req.files.xls.path;
  let bills = util.parseXLS(xlsPath);
  
  fs.unlinkSync(xlsPath);
  bills = util.processBills(bills);
  res.json(bills);
});

app.post('/calculate', bodyParser.json(), (req, res) => {
  const bills = req.body.bills;
  const billsStart = req.body.start;
  const billsEnd = req.body.end;

  res.json(util.calculateTotalRebate(bills, billsStart, billsEnd));
});

app.post('/feedback', multipartMiddleware, (req, res) => {
  let currentFeedback;

  if (Object.keys(req.body).length === 0) {
    res.status(500).send('Empty request.');
    return;
  }
  fs.readFile('./feedback.json', (err, data) => {
    if (err) {
      res.status(500).send('Error occurred while open file.');
      return;
    }
    currentFeedback = JSON.parse(data);
    currentFeedback.push({
      name: req.body['input-name'],
      email: req.body['input-email'],
      item: req.body['input-store'],
      detail: req.body['input-detail'],
      match: req.body['input-match'],
      rate: req.body['input-rate'],
      comment: req.body['input-comment']
    });
    currentFeedback = JSON.stringify(currentFeedback, null, 2);
    fs.writeFile('./feedback.json', currentFeedback, err => {
      if (err) {
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
  const https = require('https');

  https.createServer(sslOptions, app).listen(config.port, () => {
    console.log('App listening on port', config.port);
  });
} else {
  const http = require('http');

  http.createServer(app).listen(config.port, () => {
    console.log('App listening on port', config.port);
  });
}