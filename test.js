var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai')
    Gelf = require('./gelf'),
    expect = chai.expect,
    stdout = require("test-console").stdout,
    stderr = require("test-console").stderr;

describe('Gelf', function(done){
  it('should be an instance of Gelf with version 1 and using os hostname', function(){
    var gelf = new Gelf();
    expect(gelf.version).to.equal(1);
    expect(gelf.hostname).not.empty;
  });

  it('should be an instance of Gelf with provided version and hostname', function(){
    var gelf = new Gelf({
      version: '1.1',
      hostname: 'test'
    });
    expect(gelf.version).to.equal('1.1');
    expect(gelf.hostname).to.equal('test');
  });

  it('should be able to get current timestamp', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf();
    var ts = gelf._get_timestamp();
    expect(ts.toString().length).to.equal(13);
    expect(ts).to.be.above(new Date("2016-08-01T00:00:00.377").getTime());
  });

  it('should be able to get expected format with shortMsg and fullMsg and level input', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf({
      hostname: "test"
    });
    var message = gelf._format("short", "full", undefined, undefined, gelf.level.EMERGENCY);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("full");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(0);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with shortMsg and fullMsg as additional fields input only', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf({
      hostname: "test"
    });
    var message = gelf._format("short", { data: "data" }, undefined, undefined, gelf.level.EMERGENCY);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("short");
    expect(message._data).to.equal("data");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(0);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with stack trace format', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf({
      hostname: "test"
    });

    var error = {
      message: 'message',
      stack: 'stack'
    };

    var message = gelf._format(error, undefined, undefined, undefined, gelf.level.EMERGENCY);
    expect(message.short_message).to.equal("message");
    expect(message.full_message).to.equal("stack");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(0);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with JSON as shortMsg', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf({
      hostname: "test"
    });

    var data = {
      data: 'data'
    };

    var message = gelf._format(data, undefined, undefined, undefined, gelf.level.EMERGENCY);
    expect(message.short_message).to.equal(JSON.stringify(data));
    expect(message.full_message).to.equal(JSON.stringify(data));
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(0);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with _id changed to _log_id', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf({
      hostname: "test"
    });

    var data = {
      id: 'test'
    };

    var message = gelf._format("short", "full", data, undefined, gelf.level.EMERGENCY);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("full");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message._id).to.empty;
    expect(message._log_id).to.equal("test");
    expect(message.level).to.equal(0);
    expect(message.timestamp).not.empty;
  });

  it('should be able to print to stderr in EMERGENCY log and not stdout', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.emergency("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.emergency("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in ALERT log and not stdout', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.alert("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.alert("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in CRITICAL log and not stdout', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.critical("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.critical("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in ERROR log and not stdout', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.error("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.error("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in WARNING log and not stdout', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.warning("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.warning("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in NOTICE log and not stdout', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      gelf.notice("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      gelf.notice("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in INFO log and not stderr', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      gelf.info("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      gelf.info("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in DEBUG log and not stderr', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      gelf.debug("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      gelf.debug("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in LOG log and not stderr', function(){
    var gelf = new Gelf();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      gelf.log("short", "full", data, undefined);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      gelf.log("short", "full", data, undefined);
    });
    expect(output.length).to.equal(0);
  });
});