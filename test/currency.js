'use strict';

var should = require('should');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var CurrencyController = require('../lib/currency');

describe('Currency', function() {

  it('will make live request to hcoin', function(done) {
    var currency = new CurrencyController({});
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.hcoin);
        (typeof response.data.hcoin).should.equal('number');
        done();
      }
    };
    currency.index(req, res);
  });

});
