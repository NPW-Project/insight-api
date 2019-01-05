'use strict';

//var request = require('request');
var request = require('cloudscraper').get;

function CurrencyController(options) {
  this.node = options.node;
  this.currency = options.currency;
  this._setApi();
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.rate = 0;
  this.timestamp = Date.now();
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype._setApi = function() {
  this._apiLabel = 'hcoin';
  this._api = this._hcoin;
};


CurrencyController.prototype._hcoin = function(res) {

  var self = this;

  request('https://www.hcoin.com/api/oms/v1/common/tickers', function(error, response, body) {
    if (error) {
      self.node.log.error(error);
    } else {
      if (response.statusCode === 200) {
        var tickers = JSON.parse(body).ticker;
        tickers.forEach(function (ticker) {
          if (ticker.symbol == 'npw_usdt') {
            self.rate = parseFloat(ticker.last);
          }
        });
      }
  
      res.jsonp({
        status: 200,
        data: {
          hcoin: self.rate
        }
      });
    }
  });

  // request('https://www.hcoin.com/api/oms/v1/common/tickers', function(err, response, body) {

  //   if (err) {
  //     self.node.log.error(err);
  //   }

  //   if (!err && response.statusCode === 200) {
  //     self.rate = parseFloat(JSON.parse(body).last);
  //   }

  //   res.jsonp({
  //     status: 200,
  //     data: {
  //       hcoin: self.rate
  //     }
  //   });

  // });
};

CurrencyController.prototype.index = function(req, res) {

  var self = this;
  var currentTime = Date.now();

  if (self.rate === 0 || currentTime >= (self.timestamp + self.currencyDelay)) {
    self.timestamp = currentTime;
    self._api.call(self, res);
  } else {
    var data = {};
    data[self._apiLabel] = self.rate;

    res.jsonp({
      status: 200,
      data: data
    });
  }

};

module.exports = CurrencyController;
