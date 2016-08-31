var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai')
    Chillog = require('./chillog'),
    expect = chai.expect,
    stdout = require("test-console").stdout,
    stderr = require("test-console").stderr;

describe('Chillog', function(done){
  it('should be an instance of Chillog with version 1 and using os hostname', function(){
    var chillog = new Chillog();
    expect(chillog.version).to.equal(1);
    expect(chillog.hostname).not.empty;
  });

  it('should be an instance of Chillog with provided version and hostname', function(){
    var chillog = new Chillog({
      version: '1.1',
      hostname: 'test'
    });
    expect(chillog.version).to.equal('1.1');
    expect(chillog.hostname).to.equal('test');
  });

  it('should be an instance of Chillog with provided version and service', function(){
    var chillog = new Chillog({
      version: 2,
      service: 'test'
    });
    expect(chillog.version).to.equal(2);
    expect(chillog.service).to.equal('test');
  });

  it('should be able to get current timestamp', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog();
    var ts = chillog._get_timestamp();
    expect(ts.toString().length).to.equal(13);
    expect(ts).to.be.above(new Date("2016-08-01T00:00:00.377").getTime());
  });

  it('should be able to get expected format with shortMsg and fullMsg and level input', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog({
      hostname: "test"
    });
    var message = chillog._format("short", "full", undefined, chillog.level.ALERT);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("full");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(1);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with shortMsg and fullMsg as additional fields input only', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog({
      hostname: "test"
    });
    var message = chillog._format("short", { data: "data" }, undefined, chillog.level.ALERT);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("short");
    expect(message._data).to.equal("data");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(1);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with stack trace format', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog({
      hostname: "test"
    });

    var error = {
      message: 'message',
      stack: 'stack'
    };

    var message = chillog._format(error, undefined, undefined, chillog.level.ALERT);
    expect(message.short_message).to.equal("message");
    expect(message.full_message).to.equal("stack");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(1);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with JSON as shortMsg', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog({
      hostname: "test"
    });

    var data = {
      data: 'data'
    };

    var message = chillog._format(data, undefined, undefined, chillog.level.ALERT);
    expect(message.short_message).to.equal(JSON.stringify(data));
    expect(message.full_message).to.equal(JSON.stringify(data));
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message.level).to.equal(1);
    expect(message.timestamp).not.empty;
  });

  it('should be able to get expected format with _id changed to __id', function(){
    // this test will assume that timestamp generated with value > 1 August 2016 and length 13
    var chillog = new Chillog({
      hostname: "test"
    });

    var data = {
      id: 'test'
    };

    var message = chillog._format("short", "full", data, chillog.level.ALERT);
    expect(message.short_message).to.equal("short");
    expect(message.full_message).to.equal("full");
    expect(message.version).to.equal(1);
    expect(message.hostname).to.equal("test");
    expect(message._id).to.empty;
    expect(message.__id).to.equal("test");
    expect(message.level).to.equal(1);
    expect(message.timestamp).not.empty;
  });

  it('should be able to print to stderr in ALERT log and not stdout', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      chillog.alert("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      chillog.alert("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in CRITICAL log and not stdout', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      chillog.critical("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      chillog.critical("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in ERROR log and not stdout', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      chillog.error("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      chillog.error("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in WARNING log and not stdout', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      chillog.warning("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      chillog.warning("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stderr in NOTICE log and not stdout', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stderr.inspectSync(function(){
      chillog.notice("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stdout.inspectSync(function(){
      chillog.notice("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in INFO log and not stderr', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      chillog.info("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      chillog.info("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in DEBUG log and not stderr', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      chillog.debug("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      chillog.debug("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });

  it('should be able to print to stdout in LOG log and not stderr', function(){
    var chillog = new Chillog();

    var data = {
      id: 'test'
    };

    var output = stdout.inspectSync(function(){
      chillog.log("short", "full", data);

    });
    expect(output.length).to.equal(1);

    output = stderr.inspectSync(function(){
      chillog.log("short", "full", data);
    });
    expect(output.length).to.equal(0);
  });
});