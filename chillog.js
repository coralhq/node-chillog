var os   = require("os"),
    util = require('util');

var chillog = function(config){
  if (typeof(config) === 'object') {
    this.hostname = config.hostname || os.hostname();
    this.version  = config.version || 1;
    this.service  = config.service || process.env.SERVICE_NAME;
  } else {
    this.hostname = os.hostname();
    this.version = 1;
    this.service = process.env.SERVICE_NAME;
  }
};

// Level equal to the standard syslog levels
chillog.prototype.level = {
  ALERT:      1,  // Alert: Action must be taken immediately.
  CRITICAL:   2,  // Critical: Critical conditions.
  ERROR:      3,  // Error: Error conditions
  WARNING:    4,  // Warning: Warning conditions
  NOTICE:     5,  // Notice: Normal but significant condition
  INFO:       6,  // Informational: Informational messages
  DEBUG:      7   // Debug: Debug-level messages
};


chillog.prototype.alert = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.ALERT);
};

chillog.prototype.critical = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.CRITICAL);
};

chillog.prototype.error = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.ERROR);
};

chillog.prototype.warning = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.WARNING);
};

chillog.prototype.notice = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.NOTICE);
};

chillog.prototype.info = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.INFO);
};

chillog.prototype.debug = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.DEBUG);
};

chillog.prototype.log = function(shortMsg, fullMsg, additionalFields) {
  return this._log(shortMsg, fullMsg, additionalFields, this.level.INFO);
};

chillog.prototype._log = function(shortMsg, fullMsg, additionalFields, level) {
  var message = this._format(shortMsg, fullMsg, additionalFields, level);
  if (level <= this.level.NOTICE) {
    process.stderr.write(util.format(message) + '\n');
  } else {
    process.stdout.write(util.format(message) + '\n');
  }
};

// Log message based on gelf 1.1 format
chillog.prototype._format = function(shortMsg, fullMsg, additionalFields, level){
  var message = {
    version: this.version,
    hostname: this.hostname,
    timestamp: this._get_timestamp(),
    level: level,
    service: this.service
  },
  field = '';

  if ((typeof(shortMsg) !== 'object') && (typeof(fullMsg) === 'object') && !additionalFields) {
    message.short_message = shortMsg;
    message.full_message = shortMsg;

    additionalFields = fullMsg;
  } else if (typeof(shortMsg) !== 'object'){
    message.short_message   = shortMsg;
    message.full_message    = fullMsg || shortMsg;
  } else if (shortMsg.stack && shortMsg.message){
    message.short_message = shortMsg.message;
    message.full_message = shortMsg.stack;
  } else {
    message.full_message = message.short_message = JSON.stringify(shortMsg);
  }

  for (field in additionalFields){
    message['_'+field] = additionalFields[field];
  }

  // Libraries SHOULD not allow to send id as additional field (_id)
  // _id is a reserved field name
  if (message._id) {
    message.__id = message._id;
    delete message._id;
  }

  return message;
};

// Get current timestamp in milliseconds
chillog.prototype._get_timestamp = function(){
  return new Date().getTime();
};

module.exports = chillog;