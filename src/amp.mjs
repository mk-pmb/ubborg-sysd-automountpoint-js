// -*- coding: utf-8, tab-width: 2 -*-

import parseDisk from './parseDisk';

const amp = function describeSystemdAutoMountPoint(spec, bun) {
  let files = [].concat(spec).map(parseDisk);
  files = files.map(s => s.content.Mount.Where + '/').concat(files);
  if (bun && bun.needs) { return bun.needs('admFile', files); }
  return files;
};

export default amp;
