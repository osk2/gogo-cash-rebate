const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const util = require('../lib/util');
const files = {
  originalXLS: path.resolve(__dirname, 'data/original.xls'),
  originalJSON: path.resolve(__dirname, 'data/original.json'),
  currencyJSON: path.resolve(__dirname, 'data/currency.json'),
  sortedJSON: path.resolve(__dirname, 'data/sorted.json'),
  processedJSON: path.resolve(__dirname, 'data/processed.json')
}
const readFile = path => {
  return fs.readFileSync(path, 'utf8');
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
