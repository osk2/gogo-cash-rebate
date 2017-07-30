const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const expect = require('chai').expect;
const util = require('../lib/util');
const files = {
  originalXLS: path.resolve(__dirname, 'data/original.xls'),
  originalJSON: path.resolve(__dirname, 'data/original.json'),
  currencyJSON: path.resolve(__dirname, 'data/currency.json'),
  sortedJSON: path.resolve(__dirname, 'data/sorted.json'),
  processedJSON: path.resolve(__dirname, 'data/processed.json'),
  basicJSON: path.resolve(__dirname, 'data/basic.json'),
  noRebateJSON: path.resolve(__dirname, 'data/no-rebate.json'),
  bonusJSON: path.resolve(__dirname, 'data/bonus.json'),
  detailJSON: path.resolve(__dirname, 'data/detail.json')
}
const readFile = path => {
  return fs.readFileSync(path, 'utf8');
}

const writeJSONFile = (file, data) => {
  fs.writeFileSync(
    path.resolve(__dirname, file),
    JSON.stringify(data, null, 2)
  );
}

describe('Data Processing', () => {

  it('should convert XLS to JSON w/ specfic format', () => {
    const originalJSON = readFile(files.originalJSON);
    const resultJSON = JSON.stringify(util.parseXLS(files.originalXLS), null, 2);

    expect(resultJSON).to.equal(originalJSON);
  });

  it('should transform currency from string to integer', () => {
    const currencyJSON = readFile(files.currencyJSON);
    const originalJSON = JSON.parse(readFile(files.originalJSON));
    const resultJSON = JSON.stringify(util._.convertCurrency(originalJSON), null, 2);

    expect(resultJSON).to.equal(currencyJSON);
  });

  it('should sort records by posting date', () => {
    const currencyResult = JSON.parse(readFile(files.currencyJSON));
    const resultJSON = JSON.stringify(util._.sortByPostingDate(currencyResult), null, 2);
    const sortedJSON = readFile(files.sortedJSON);

    expect(resultJSON).to.equal(sortedJSON);
  });

  it('should generate JSON which is sorted and have correct type format', () => {
    const processedJSON = readFile(files.processedJSON);
    const originalJSON = JSON.parse(readFile(files.originalJSON));
    const resultJSON = JSON.stringify(util.processBills(originalJSON), null, 2);

    expect(resultJSON).to.equal(processedJSON);
  });
});


describe('Rebate Calculation', () => {

  const rateTable = require('../lib/rate');

  const calculateRecord = (record) => {
    let resultJSON;
    let isCashBack;

    _.each(rateTable, rate => {
      if (rate.match.test(record.detail)) {
        if (rate.rate !== 0) {
          resultJSON = util._.calculateRebate(record, 0 - record.amount, rate.rate);
        } else {
          resultJSON = util._.calculateRebate(record, 0, 0);
        }
        isCashBack = true;
        return false;
      }
      if (!isCashBack) {
        resultJSON = util._.calculateRebate(record, 0 - record.amount, 0);
      }
    });
    return resultJSON;
  }

  it('should have basic rebate', () => {
    const processedJSON = JSON.parse(readFile(files.processedJSON));
    const basicBill = processedJSON[0];
    const basicJSON = readFile(files.basicJSON);
    const resultJSON = JSON.stringify(calculateRecord(basicBill), null, 2);
  
    expect(resultJSON).to.equal(basicJSON);
  });

  it('should have no rebate', () => {
    const processedJSON = JSON.parse(readFile(files.processedJSON));
    const basicBill = processedJSON[1];
    const noRebateJSON = readFile(files.noRebateJSON);
    const resultJSON = JSON.stringify(calculateRecord(basicBill), null, 2);
  
    expect(resultJSON).to.equal(noRebateJSON);
  });

  it('should have bonus rebate', () => {
    const processedJSON = JSON.parse(readFile(files.processedJSON));
    const basicBill = processedJSON[3];
    const bonusJSON = readFile(files.bonusJSON);
    const resultJSON = JSON.stringify(calculateRecord(basicBill), null, 2);
  
    expect(resultJSON).to.equal(bonusJSON);
  });

  it('should generate detail of rebate', () => {
    const processedJSON = JSON.parse(readFile(files.processedJSON));
    const detailJSON = readFile(files.detailJSON);
    const resultJSON = JSON.stringify(util.calculateTotalRebate(processedJSON, 0, 4), null, 2);

    expect(resultJSON).to.equal(detailJSON);
  });
});
