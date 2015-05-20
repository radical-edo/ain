var should = require('chai').should();
var ain = require('../index');
var dgram = require('dgram');

describe('multinline composition', function(){
    var server;
    var callback;
    var logger = new ain({port: 5514});
    before(function(){
        server = dgram.createSocket('udp4', function(msg, rinfo){
            if (callback) callback(msg);
        });
        server.bind(5514);
    });
    after(function(){
        server.close();
    });
    it('split CR into multiple messages if splitLines is enabled', function(done){
        logger.splitLines = true;

        var messages = [
          'Line 1',
          'Line 2',
          'Line 3'
        ];
        var counter = 0;
        var max = messages.length;

        callback = function(msg){
            counter += 1;
            msg.toString().should.contain(messages.shift());
            if(counter == max){
              done();
            }
        }
        var messageString = messages.join('\n');
        logger.info(messageString);
    });

    it('publish only one line when splitLines is disabled', function(done){

        logger.splitLines = false;

        var messages = [
          'Line 1',
          'Line 2',
          'Line 3'
        ];

        var messageString = messages.join('\n');

        callback = function(msg){
            msg.toString().should.contain(messageString);
            done();
        }
        logger.info(messageString);
    });

});

