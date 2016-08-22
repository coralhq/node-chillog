var os   = require("os"),
    util = require('util');

var gelf = function(config){
  if (typeof(config) === 'object') {
    this.hostname = config.hostname || os.hostname();
    this.version  = config.version || 1;
  } else {
    this.hostname = os.hostname();
    this.version = 1;
  }
};

// Level equal to the standard syslog levels
gelf.prototype.level = {
  EMERGENCY:  0,  // Emergency: System is unusable.
  ALERT:      1,  // Alert: Action must be taken immediately.
  CRITICAL:   2,  // Critical: Critical conditions.
  ERROR:      3,  // Error: Error conditions
  WARNING:    4,  // Warning: Warning conditions
  NOTICE:     5,  // Notice: Normal but significant condition
  INFO:       6,  // Informational: Informational messages
  DEBUG:      7   // Debug: Debug-level messages
};

gelf.prototype.emergency = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.EMERGENCY);
};

gelf.prototype.alert = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.ALERT);
};

gelf.prototype.critical = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.CRITICAL);
};

gelf.prototype.error = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.ERROR);
};

gelf.prototype.warning = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.WARNING);
};

gelf.prototype.notice = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.NOTICE);
};

gelf.prototype.info = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.INFO);
};

gelf.prototype.debug = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.DEBUG);
};

gelf.prototype.log = function(shortMsg, fullMsg, additionalFields, timestamp) {
  return this._log(shortMsg, fullMsg, additionalFields, timestamp, this.level.INFO);
};

gelf.prototype._log = function(shortMsg, fullMsg, additionalFields, timestamp, level) {
  var message = this._format(shortMsg, fullMsg, additionalFields, timestamp, level);
  if (level <= this.level.NOTICE) {
    process.stderr.write(util.format(message) + '\n');
  } else {
    process.stdout.write(util.format(message) + '\n');
  }
};

// Log message based on gelf 1.1 format
gelf.prototype._format = function(shortMsg, fullMsg, additionalFields, timestamp, level){
  var message = {
    version: this.version,
    hostname: this.hostname,
    timestamp: timestamp || this._get_timestamp(),
    level: level
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
  // http://docs.graylog.org/en/2.0/pages/gelf.html#gelf-format-specification
  if (message._id) {
    message._log_id = message._id;
    delete message._id;
  }

  return message;
};

// Get current timestamp in milliseconds
gelf.prototype._get_timestamp = function(){
  return new Date().getTime();
};

module.exports = gelf;