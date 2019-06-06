const _baseRate = 0.005;
const _bonusRate = 0.02;
const _bindingBonusRate = 0.01;
const _bonusLimit = 500;

module.exports = {
  isBinding: true,
  port: 9090,
  getBaseRate() {
    return _baseRate;
  },
  getBonusRate() {
    return _bonusRate;
  },
  getBonusLimit() {
    return _bonusLimit;
  },
  getBindingBonusRate() {
    return this.isBinding ? _bindingBonusRate : 0;
  }
};
