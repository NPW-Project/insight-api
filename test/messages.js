'use strict';

var should = require('should');
var sinon = require('sinon');
var MessagesController = require('../lib/messages');
var npwcore = require('npwcore-lib');
var _ = require('lodash');

describe('Messages', function() {

  var privateKey = npwcore.PrivateKey.fromWIF('cQwApHAg8hw9AZuxiU4a7g9kFWdaemhPxVZXWiAKgJTx6dPP32fN');
  var address = 'y9QLtEa6mbQnpcHD48WF9BGQQ2txFtcrq8';
  var badAddress = 'y9QLtEa6mbQnpcHD48WF9BGQQ2txFtcr8q';
  var signature = 'IOPMNygJeKBVOSRRvKYgCJ6ICsk4ZtwikdgJRhRT1mNNHCT8AJFWOil96ZXONEA0JOdYykRJlSRhSEv3gYT49Dk=';
  var message = 'cellar door';

  it('will verify a message (true)', function(done) {

    var controller = new MessagesController({node: {}});

    var req = {
      body: {
        'address': address,
        'signature': signature,
        'message': message
      },
      query: {}
    };
    var res = {
      json: function(data) {
        data.result.should.equal(true);
        done();
      }
    };

    controller.verify(req, res);
  });

  it('will verify a message (false)', function(done) {

    var controller = new MessagesController({node: {}});

    var req = {
      body: {
        'address': address,
        'signature': signature,
        'message': 'wrong message'
      },
      query: {}
    };
    var res = {
      json: function(data) {
        data.result.should.equal(false);
        done();
      }
    };

    controller.verify(req, res);
  });

  it('handle an error from message verification', function(done) {
    var controller = new MessagesController({node: {}});
    var req = {
      body: {
        'address': badAddress,
        'signature': signature,
        'message': message
      },
      query: {}
    };
    var send = sinon.stub();
    var status = sinon.stub().returns({send: send});
    var res = {
      status: status,
    };
    controller.verify(req, res);
    status.args[0][0].should.equal(400);
    send.args[0][0].should.equal('Unexpected error: Checksum mismatch. Code:1');
    done();
  });

  it('handle error with missing parameters', function(done) {
    var controller = new MessagesController({node: {}});
    var req = {
      body: {},
      query: {}
    };
    var send = sinon.stub();
    var status = sinon.stub().returns({send: send});
    var res = {
      status: status
    };
    controller.verify(req, res);
    status.args[0][0].should.equal(400);
    send.args[0][0].should.match(/^Missing parameters/);
    done();
  });

});
