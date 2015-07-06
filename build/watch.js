
/*
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
var resin, sync, tree, utils, _;

_ = require('lodash');

resin = require('resin-sdk');

tree = require('./tree');

utils = require('./utils');

sync = require('./sync');

module.exports = {
  signature: 'watch <uuid>',
  description: 'sync a project directory with a device',
  help: 'Use this command to push changes on the fly to a certain device.\n\nExamples:\n\n	$ resin watch 768fdc5d6d687dac5ee45b64ffe939779a38a3958f686efc4f0339bce60906',
  permission: 'user',
  action: function(params, options, done) {
    var directory;
    directory = process.cwd();
    return resin.models.device.getLocalIPAddresses(params.uuid).get(0).then(function(ip) {
      var watch;
      console.info("Connecting to " + params.uuid + ": " + ip);
      watch = tree.watch(directory);
      watch.on('watching', function(watcher) {
        return console.info("Watching path: " + watcher.path);
      });
      watch.on('change', function(type, filePath) {
        console.info("[" + (utils.getCurrentTime()) + "] - " + (type.toUpperCase()) + ": " + filePath);
        return sync.perform(ip, directory).then(function() {
          console.info('Synced, restarting application');
          return resin.models.device.getApplicationName(params.uuid).then(resin.models.application.restart);
        });
      });
      return watch.on('error', done);
    });
  }
};
