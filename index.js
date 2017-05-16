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
const bonusRate = 0.01;
let bills = _.drop(wsjson, 1);
let totalCashBack = 0;
let finalBills = [];

_.map(bills, function (bill) {
  bill.amount = parseInt(bill.amount.replace('NT$', '').replace(',', ''));
  return bill;
});

_.each(_.take(bills, args[3]), function (bill) {

  if (bill.amount < 0) {
    let isCashBack = false;
    let amount = Math.abs(bill.amount);

    _.each(rateTable, function (rate) {
      if (rate.match.test(bill.detail)) {
        if (rate.rate !== 0) {
          const cashRate = rate.rate + bonusRate;
          bill.cash = Math.round(amount * cashRate);
          totalCashBack += Math.round(amount * cashRate);
          finalBills.push(bill);
        } else {
          bill.cash = 0;
          finalBills.push(bill);
        }
        isCashBack = true;
        return false;
      }
    });
    if (!isCashBack) {
      const cashRate = 0.005 + bonusRate;
      bill.cash = Math.round(amount * cashRate);
      totalCashBack += Math.round(amount * cashRate);
      finalBills.push(bill)
    }
  } else {
    bill.cash = 0;
    finalBills.push(bill);
  }
});
console.log(finalBills)
console.log('\n回饋：' + totalCashBack)
