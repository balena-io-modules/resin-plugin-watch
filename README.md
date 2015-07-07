resin-plugin-watch
------------------

[![dependencies](https://david-dm.org/resin-io/resin-plugin-watch.png)](https://david-dm.org/resin-io/resin-plugin-watch.png)

Watch a local project directory and sync it on the fly on a certain device.

**NOTICE:** This is highly experimental and not stable. It relies on hacky workarounds to do it's job and therefore should be used carefully.

Installation
------------

Install `resin-plugin-watch` by running:

```sh
$ npm install -g resin-plugin-watch
```

Documentation
-------------

### watch <uuid>

Watch a local project directory and sync it on the fly on a certain device.

Example:

```sh
$ cd my/project/src
$ resin watch 768fdc5d6d687dac5ee45b64ffe939779a38a3958f686efc4f0339bce60906
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io/resin-plugin-watch/issues/new) on GitHub and the Resin.io team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/resin-io/resin-plugin-watch/issues](https://github.com/resin-io/resin-plugin-watch/issues)
- Source Code: [github.com/resin-io/resin-plugin-watch](https://github.com/resin-io/resin-plugin-watch)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

License
-------

The project is licensed under the MIT license.
