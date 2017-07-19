const XLSX = require('xlsx');
const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const rateTable = require('./rate');
const config = require('./config');
const baseRate = config.getBaseRate();
const bonusRate = config.getBonusRate();
const bindingBonusRate = config.getBindingBonusRate();
const maxBonus = config.getBonusLimit();
const isProduction = (process.env.NODE_ENV === 'production');
const http = isProduction ? require('https') : require('http');
const sslOptions = {
  ca: isProduction ? fs.readFileSync(config.ca) : '',
  key: isProduction ? fs.readFileSync(config.key) : '',
  cert: isProduction ? fs.readFileSync(config.cert) : ''
};

const parseXLS = path=> {
  try {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const wsjson = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        'transaction_date',
        'posting_date',
        'card',
        'amount',
        'detail',
        'currency',
        'category',
        'comment'
      ]
    });
    let bills = _.drop(wsjson, 1);

    bills.success = true;
    return bills;
  } catch (ex) {
    return {success: false, reason: ex};
  }
}

const convertCurrency = bills => {
  return _.map(bills, bill => {
    bill.amount = parseInt(bill.amount.replace('NT$', '').replace(',', ''));
    return bill;
  });
}

const sortByPostingDate = bills => {
  return _.sortBy(bills, ['posting_date']);
}

const processBills = bills => {
  let processedBills = bills;

  processedBills = convertCurrency(processedBills);
  return sortByPostingDate(processedBills);
}

const cashCalc = (bill, amount, bounsRate) => {
  bill.cash = {};
  bill.cash.base = Math.round(amount * baseRate);
  bill.cash.binding = Math.round(amount * bindingBonusRate);
  bill.cash.bonus = Math.round(amount * bounsRate);
  return bill;
}

const calculateRebate = (bills, start = 0, end = bills.length) => {
  const slicedBills = _.slice(bills, start, end);
  let finalBills = [];
  let validTotal = 0;
  let validBonus = 0;

  _.each(slicedBills, bill => {
    const amount = 0 - bill.amount;
    let isCashBack = false;

    _.each(rateTable, rate => {
      if (rate.match.test(bill.detail)) {
        if (rate.rate !== 0) {
          validTotal += amount;
          validBonus += amount;
          finalBills.push(cashCalc(bill, amount, rate.rate));
        } else {
          finalBills.push(cashCalc(bill, 0, 0));
        }
        isCashBack = true;
        return false;
      }
    });
    if (!isCashBack) {
      validTotal += amount;
      finalBills.push(cashCalc(bill, amount, 0));
    }
  });

  const basicRebate = Math.round(validTotal * baseRate);
  const bindingRebate = Math.round(validTotal * bindingBonusRate);
  const bonusRebate = Math.round(validBonus * bonusRate);
  const totalBonusRebate = bindingRebate + bonusRebate;
  const totalRebate = basicRebate + (totalBonusRebate > maxBonus ? maxBonus : totalBonusRebate);

  return {
    basicRebate: basicRebate,
    bindingRebate: bindingRebate,
    bonusRebate: bonusRebate,
    totalRebate: totalRebate,
    overBounsLimit: (totalBonusRebate > maxBonus),
    bills: finalBills
  }
}

app.use(express.static('public'));

app.post('/converter', multipartMiddleware, (req, res) => {
  let bills = parseXLS(req.files.xls.path);

  bills = processBills(bills);
  res.json(bills);
});

app.post('/calculate', bodyParser.json(), (req, res) => {
  const bills = req.body.bills;
  const billsStart = req.body.start;
  const billsEnd = req.body.end;

  res.json(calculateRebate(bills, billsStart, billsEnd));
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
  http.createServer(sslOptions, app).listen(9090, () => {
    console.log('App listening on port 9090');
  });
} else {
  http.createServer(app).listen(9090, () => {
    console.log('App listening on port 9090');
  });
}