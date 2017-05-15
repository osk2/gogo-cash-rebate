const XLSX = require('xlsx');
const _ = require('lodash');
const rateTable = require('./rate');

const args = process.argv;
const workbook = XLSX.readFile(args[2]);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const wsjson = XLSX.utils.sheet_to_json(worksheet, {
  header: 
  [
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
// Remove first record and resort by `pay_date`
const bills = _.drop(wsjson, 1);
const bonusRate = 0.01;
let totalCashBack = 0;

_.each(_.take(bills, args[3]), function (bill) {
  // Make sure amount is positive
  let amount = bill.amount.replace('NT$', '').replace(',', '');

  try {
    amount = Math.abs(parseInt(amount));
  } catch (err) {
    return false;
  }

  if (amount > 0) {
    let isCashBack = false;

    _.each(rateTable, function (rate) {
      if (rate.match.test(bill.detail)) {
        if (rate.rate !== 0) {
          totalCashBack += Math.round(amount * (rate.rate + bonusRate));
        }
        isCashBack = true;
        return false;
      }
    });
    if (!isCashBack) {
      totalCashBack += Math.round(amount * (0.015 + bonusRate));
    }
  }
  console.log(bill.detail)
});

console.log('\n回饋：' + totalCashBack)