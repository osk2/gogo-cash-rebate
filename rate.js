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
    'item': '支付寶（淘寶／天貓）',
    'match': /^ALIPAY\*TAOBAO\.COM.*$/,
    'rate': 0.025
  },
  {
    'item': '蝦皮拍賣',
    'match': /^蝦皮拍賣.*$/,
    'rate': 0.025
  },
  {
    'item': '街口支付',
    'match': /^街口﹣.*$/,
    'rate': 0.025
  },
  {
    'item': 'Lativ',
    'match': /^米格國際股份有限公司.*$/,
    'rate': 0.025
  },
  {
    'item': 'PChome',
    'match': /^網路家庭國際資訊股份有限公司.*$/,
    'rate': 0.025
  }
]
