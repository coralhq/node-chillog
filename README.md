# node-chillog

Node-Chillog implements stdout logging and loosely follow Gelf RFC. This has been modified based on our team needs. The notable changes are removal of emergency logging and timestamp in milliseconds.

## Available Functions
* chillog.alert
* chillog.critical
* chillog.error
* chillog.notice
* chillog.info
* chillog.debug

## Examples

### Initialize with defaults
```javascript
    var Chillog = require("node-chillog");
    var chillog = new Chillog()
```

### Initialize with config
```javascript
    var Chillog = require("node-chillog");
    var chillog = new Chillog({
      hostname: "log.creator.com"
    })
```

### Short message logging
```javascript
  logger.alert("alert... short message")
```

### Short message and long message logging
```javascript
  logger.critical("critical... short message", "critical... long message here. some backtraces stuff")
```

### Short message logging with additional JSON data
```javascript
  logger.error("error... short message", { user_id: 42 })
```

### Short message and long message logging with additional JSON data
```javascript
  logger.notice("notice... short message", "notice... long story short. you might need to notice this", { user_id: 42 })
```
