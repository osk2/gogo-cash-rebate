const XLSX = require('xlsx');
const _ = require('lodash');
const chalk = require('chalk');
const rateTable = require('./rate');
const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const baseRate = 0.005;
const isBinding = true;
const bindingBonusRate = isBinding ? 0.01 : 0;
let finalBills = [];
let validTotal = 0;
let validBonus = 0;

const xlsConverter = path => {
  try {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const wsjson = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        'shop_date',
        'pay_date',
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

const recordProcessor = bills => {
  return _.map(bills, bill => {
    bill.amount = parseInt(bill.amount.replace('NT$', '').replace(',', ''));
    return bill;
  });
}

const analyzeRecord = (bills, count) => {
  _.each(_.take(bills, count - 1), bill => {

    if (bill.amount < 0) {
      let isCashBack = false;
      let amount = Math.abs(bill.amount);

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
    } else {
      finalBills.push(cashCalc(bill, 0, 0));
    }
  });

  const cashBasic = Math.round(validTotal * baseRate);
  const cashBinding = Math.round(validTotal * bindingBonusRate);
  const cashBonus = Math.round(validBonus * 0.02);
}

const cashCalc = (bill, amount, bounsRate) => {
  bill.cash = {};
  bill.cash.base = Math.round(amount * baseRate);
  bill.cash.binding = Math.round(amount * bindingBonusRate);
  bill.cash.bonus = Math.round(amount * bounsRate);

  return bill;
}

app.use(express.static('public'));

app.post('/upload', multipartMiddleware, (req, res) => {
  let output = xlsConverter(req.files.xls.path)

  output = recordProcessor(output);
  res.json(output);
});

// console.log(finalBills);
// console.log('\n基本回饋：', cashBasic);
// if (cashBinding + cashBonus >= 500) {
//   console.log(chalk.dim.strikethrough('\n綁定加碼：', cashBinding));
//   console.log(chalk.dim.strikethrough('指定數位：', cashBonus));
//   console.log('加碼回饋到達上限，以500計');
//   console.log('回饋共計：', cashBasic + 500);
// } else {
//   console.log('綁定加碼：', cashBinding);
//   console.log('指定數位：', cashBonus);
//   console.log('回饋共計：', cashBasic + cashBonus + cashBinding);
// }

app.listen(9090, () => {
  console.log('App listening on port 9090!');
})