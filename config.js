module.exports = {
  _baseRate: 0.005,
  _bonusRate: 0.02,
  _bindingBonusRate: 0.01,
  _bonusLimit: 500,
  _isBinding: true,
  ca: 'ssl/fullchain.pem',
  key: 'ssl/privkey.pem',
  cert: 'ssl/cert.pem',
  getBaseRate() {
    return this._baseRate;
  },
  getBonusRate() {
    return this._bonusRate;
  },
  getBindingStatus() {
    return this._isBinding;
  },
  getBonusLimit() {
    return this._bonusLimit;
  },
  getBindingBonusRate() {
    return this.getBindingStatus() ? this._bindingBonusRate : 0;
  }
}