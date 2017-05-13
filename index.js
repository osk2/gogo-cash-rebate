const XLSX = require('xlsx');
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

console.log(wsjson)