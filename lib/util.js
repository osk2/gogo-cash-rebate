const XLSX = require('xlsx');
const _ = require('lodash');
const rateTable = require('./rate');
const config = require('./config');

const baseRate = config.getBaseRate();
const bonusRate = config.getBonusRate();
const bindingBonusRate = config.getBindingBonusRate();
const maxBonus = config.getBonusLimit();

const parseXLS = (path) => {
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
    const bills = _.drop(wsjson, 1);

    bills.success = true;
    return bills;
  } catch (ex) {
    return { success: false, reason: ex };
  }
};

const convertCurrency = (bills) => {
  return _.map(bills, (bill) => {
    bill.amount = parseInt(bill.amount.replace('NT$', '').replace(',', ''), 10);
    return bill;
  });
};

const sortByPostingDate = (bills) => {
  return _.sortBy(bills, ['posting_date']);
};

const processBills = (bills) => {
  let processedBills = bills;

  processedBills = convertCurrency(processedBills);
  return sortByPostingDate(processedBills);
};

const calculateRebate = (bill, amount, bounsRate) => {
  const outputBill = bill;

  outputBill.cash = {};
  outputBill.cash.base = Math.round(amount * baseRate);
  outputBill.cash.binding = Math.round(amount * bindingBonusRate);
  outputBill.cash.bonus = Math.round(amount * bounsRate);
  return outputBill;
};

const calculateTotalRebate = (bills, start = 0, end = bills.length) => {
  const slicedBills = _.slice(bills, start, end);
  const finalBills = [];
  let validTotal = 0;
  let validBonus = 0;

  _.each(slicedBills, (bill) => {
    const amount = 0 - bill.amount;
    let isCashBack = false;

    _.each(rateTable, (rate) => {
      if (rate.match.test(bill.detail)) {
        if (rate.rate !== 0) {
          validTotal += amount;
          validBonus += amount;
          finalBills.push(calculateRebate(bill, amount, rate.rate));
        } else {
          finalBills.push(calculateRebate(bill, 0, 0));
        }
        isCashBack = true;
        return false;
      }
      return true;
    });
    if (!isCashBack) {
      validTotal += amount;
      finalBills.push(calculateRebate(bill, amount, 0));
    }
  });

  const basicRebate = Math.round(validTotal * baseRate);
  const bonusRebate = Math.round(validBonus * bonusRate) > maxBonus ? 
    maxBonus : Math.round(validBonus * bonusRate);
  const bindingRebate = Math.round(validTotal * bindingBonusRate) + bonusRebate > maxBonus ?
    maxBonus - bonusRebate : Math.round(validTotal * bindingBonusRate);
  const totalBonusRebate = Math.round(validBonus * bonusRate) + Math.round(validTotal * bindingBonusRate);
  const totalRebate = basicRebate + (totalBonusRebate > maxBonus ? maxBonus : totalBonusRebate);

  return {
    basicRebate,
    bindingRebate,
    bonusRebate,
    totalRebate,
    totalBonusRebate,
    overBounsLimit: (totalBonusRebate > maxBonus),
    bills: finalBills
  };
};

module.exports = {
  parseXLS,
  processBills,
  calculateTotalRebate,
  _: {
    convertCurrency,
    sortByPostingDate,
    processBills,
    calculateRebate
  }
};
