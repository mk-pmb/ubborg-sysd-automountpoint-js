
<!--#echo json="package.json" key="name" underline="=" -->
ubborg-sysd-automountpoint
==========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Easily declare systemd auto-mountpoints.
<!--/#echo -->



API
---

This module exports one function:

### describeSystemdAutoMountPoint(spec[, bun])

`spec` shoult be either
* a details object (see below),
* a string, which will be interpreted as if it were the `device` property
  of a details object,
* or an array of any of the above.

Returns an array of specs for `admFile` resources.
If `bun` is specified and has a `.needs` method, it's assumed to be an
ubborg bundle, and the `admFile`s are requested on its behalf.
In this case, the resulting promise will be returned instead, and the
specs array will be stored on that promise in the `specs` property.

Details objects support these properties, most of them optional:

* `device` (required): Path to the disk device.
* `mountAt`: Absolute path where to mount the device.
* `fsType`: Explicit file system selection, in case `auto` isn't good enough.
* `fsOpt`: File system options (string or array).
* `descr`: User-visible (explanatory) description of the systemd unit.
* `wantedBy`: Which systemd target to trigger on.





Usage
-----

:TODO:


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
