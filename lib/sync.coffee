###
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
###

_ = require('lodash')
path = require('path')
Promise = require('bluebird')
child_process = Promise.promisifyAll(require('child_process'))
rsync = require('rsync')

USERNAME = 'resinwatch'
DESTINATION_PATH = '/data/.resin-watch'
PORT = '5511'

exports.buildCommand = (ip, options = {}) ->
	_.defaults options,
		destination: "#{USERNAME}@#{ip}:#{DESTINATION_PATH}"

	command = Promise.promisifyAll(rsync.build(options))
	command.set('password-file', path.join(__dirname, 'password.txt'))
	return command

exports.execute = (ip, options = {}) ->

	# Remove device from known_hosts since the device host key
	# changes each time the container is restarted.
	# child_process.execAsync "ssh-keygen -R #{ip}:#{PORT}", ->

	command = exports.buildCommand(ip, options)
	return command.executeAsync()

exports.perform = (ip, directory) ->
	exports.execute ip,
		source: directory

		# a = archive mode.
		# This makes sure rsync synchronizes the
		# files, and not just copies them blindly.
		#
		# v = verbose
		# z = compress during transfer
		# r = recursive
		flags: 'avzr'

		# http://mike-hostetler.com/blog/2007/12/08/rsync-non-standard-ssh-port/
		shell: "ssh -p #{PORT}"
