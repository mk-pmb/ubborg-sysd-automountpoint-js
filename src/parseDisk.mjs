// -*- coding: utf-8, tab-width: 2 -*-

import pathLib from 'path';

import isStr from 'is-string';
import objPop from 'objpop';
import mustBe from 'typechecks-pmb/must-be';


function lc(s) { return String(s).toLowerCase(); }
function translateExactBy(m, b) { return '/dev/disk/by-' + lc(m && b) + '/'; }


const shortBys = {
  L: 'label',
  PL: 'partlabel',
  PU: 'partuuid',
  U: 'uuid',
};
function translateShortBy(m, p) {
  return '/dev/disk/by-' + mustBe.nest('Translation of disk device prefix "'
    + m + '"', shortBys[p]);
}


function normalizeSpec(s) {
  mustBe('obj | nonEmpty str', 'device/mountpoint spec', s);
  if (isStr(s)) { return { device: s }; }
  return s;
}


function parseDisk(spec) {
  const mustPop = objPop(normalizeSpec(spec), { mustBe }).mustBe;

  let device = mustPop('nonEmpty str', 'device');
  if (!/:|=|\//.test(device)) { device = 'PL:' + device; }
  device = device.replace(/^([A-Z]+)=/, translateExactBy);
  device = device.replace(/^([A-Z]+):/, translateShortBy);

  let mntp = mustPop('str', 'mountAt', '');
  if (!mntp) { mntp = '/mnt/' + pathLib.basename(device); }

  const fsType = mustPop('nonEmpty str', 'fsType', 'auto');
  let fsOpt = mustPop('str | ary', 'fsOpt', 'defaults,noatime');
  if (Array.isArray(fsOpt)) { fsOpt = fsOpt.join(','); }

  const path = device.replace(/^\//, '').replace(/\//g, '-');

  let trigger = mustPop('str | ary', 'wantedBy', 'multi-user.target');
  if (Array.isArray(trigger)) { trigger = trigger.join(' '); }

  const unit = {
    pathPre: '/etc/systemd/system/',
    path,
    pathSuf: '.mount',
    mimeType: 'static_ini',
    content: {
      Unit: {
        Description: mustPop('str', 'descr', ''),
      },
      Mount: {
        What: device,
        Where: mntp,
        Type: fsType,
        Options: fsOpt,
      },
      Install: {
        WantedBy: trigger,
      },
    },
  };

  mustPop.done('Unsupported options for ' + device + ' -> ' + mntp);
  return unit;
}


export default parseDisk;
