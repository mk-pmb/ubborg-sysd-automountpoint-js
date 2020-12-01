// -*- coding: utf-8, tab-width: 2 -*-

import flatten from 'flatten';

import parseDisk from './parseDisk';

const amp = function describeSystemdAutoMountPoint(spec, bun) {
  const files = flatten([].concat(spec).map(parseDisk));
  if (bun && bun.needs) {
    return Object.assign(bun.needs('admFile', files), { specs: files });
  }
  return files;
};

export default amp;
