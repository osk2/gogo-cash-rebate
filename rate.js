module.exports = [
  {
    'item': '交易手續費',
    'match': /^國外交易服務費﹣.*$/,
    'rate': 0
  },
  {
    'item': '全聯',
    'match': /^全聯.*分公司.*$/,
    'rate': 0
  },
  {
    'item': 'iCash自動加值',
    'match': /^icash自動加值.*$/,
    'rate': 0
  },
  {
    'item': '悠遊卡自動加值',
    'match': /^悠遊卡自動加值.*$/,
    'rate': 0
  },
  {
    'item': '全家便利商店',
    'match': /^全家便利商店﹣.*$/,
    'rate': 0
  },
  {
    'item': '活動回饋',
    'match': /^活動類.*$/,
    'rate': 0,
    'note': '特殊活動不計算回饋'
  },
  {
    'item': '高鐵',
    'match': /^高鐵ＥＣ.*$/,
    'rate': 0.02
  },
  {
    'item': '支付寶（淘寶／天貓）',
    'match': /^ALIPAY\*TAOBAO\.COM.*$/,
    'rate': 0.02
  },
  {
    'item': '支付寶（淘寶／天貓）',
    'match': /www\.taobao\.com/,
    'rate': 0.02,
    'contributor': 'AIC'
  },
  {
    'item': '蝦皮拍賣',
    'match': /^蝦皮拍賣.*$/,
    'rate': 0.02
  },
  {
    'item': '街口支付',
    'match': /^街口﹣.*$/,
    'rate': 0.02,
    'note': '街口支付有`街口-`和`街口支付-`兩種前綴'
  },
  {
    'item': '街口支付',
    'match': /^街口支付﹣.*$/,
    'rate': 0.02,
    'note': '街口支付有`街口-`和`街口支付-`兩種前綴'
  },
  {
    'item': 'Lativ',
    'match': /^米格國際股份有限公司.*$/,
    'rate': 0.02
  },
  {
    'item': 'UNIQLO 網購',
    'match': /^台灣優衣庫有限公司ＥＣ.*$/,
    'rate': 0.02
  },
  {
    'item': 'PChome',
    'match': /^網路家庭國際資訊股份.*$/,
    'rate': 0.02,
    'note': '若為分期字串會被截斷，故只能判斷至`股份`'
  },
  {
    'item': 'Airbnb',
    'match': /^AIRBNB \* .*$/,
    'rate': 0.02
  },
  {
    'item': '智付通',
    'match': /^智付通﹣.*$/,
    'rate': 0.02
  },
  {
    'item': '星巴克線上儲值',
    'match': /^統一星巴克線上儲值.*$/,
    'rate': 0.02
  },
  {
    'item': 'Google Wallet',
    'match': /^GOOGLE \*.*$/,
    'rate': 0.02
  },
  {
    'item': '博客來',
    'match': /^博客來數位科技股份有限公司.*$/,
    'rate': 0.02
  },
  {
    'item': '歐付寶',
    'match': /^allPay Electronic Payment.*$/,
    'rate': 0.02
  },
  {
    'item': '小米網購',
    'match': /^台灣小米通訊有限公司.*$/,
    'rate': 0.02
  },
  {
    'item': 'Pinkoi',
    'match': /^Ｐｉｎｋｏｉ˙ｃｏｍ.*$/,
    'rate': 0.02
  },
  { 
    'item': 'iTunes', 
    'match': /^ITUNES\.COM\/BILL.*$/, 
    'rate': 0.02
  },
  {
    'item': 'Yahoo',
    'match': /^雅虎奇摩.*$/,
    'rate': 0.02 
  },
  {
    'item': 'Yahoo 輕鬆付',
    'match': /^雅虎輕鬆付.*$/,
    'rate': 0.02 
  },
  {
    'item': '迪卡儂網購',
    'match': /^ＤＥＣＡＴＨＬＯＮ.*$/,
    'rate': 0.02,
    'note': '若於實體店面使用 Apple Pay 等支付有機會列入數位通路'
  },
  {
    'item': 'iherb',
    'match': /^iHerb.*$/,
    'rate': 0.02,
    'contributor': 'AIC'
  }
]
