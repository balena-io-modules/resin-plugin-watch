
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
var PASSWORD, Promise, USERNAME, os, rsync, _;

_ = require('lodash');

Promise = require('bluebird');

rsync = require('rsync');

os = require('os');

USERNAME = 'resinwatch';

PASSWORD = 'watch';

exports.buildCommand = function(ip, options) {
  if (options == null) {
    options = {};
  }
  _.defaults(options, {
    destination: "" + USERNAME + "@" + ip + "::sync"
  });
  return Promise.promisifyAll(rsync.build(options));
};

exports.execute = function(ip, options) {
  var command;
  if (options == null) {
    options = {};
  }
  process.env['RSYNC_PASSWORD'] = PASSWORD;
  command = exports.buildCommand(ip, options);
  return command.executeAsync();
};

exports.perform = function(ip, directory) {
  if (os.platform() === 'win32') {
    if (_.last(directory) !== '\\') {
      directory += '\\';
    }
  } else {
    if (_.last(directory) !== '/') {
      directory += '/';
    }
  }
  return exports.execute(ip, {
    source: directory,
    flags: 'avr'
  });
};
