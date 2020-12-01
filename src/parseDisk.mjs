// -*- coding: utf-8, tab-width: 2 -*-

import pathLib from 'path';

import objPop from 'objpop';
import is from 'typechecks-pmb';
import mustBe from 'typechecks-pmb/must-be';
import compileMountOpts from 'compile-linux-mount-options-from-dict-pmb';


function lc(s) { return String(s).toLowerCase(); }
function translateExactBy(m, b) { return '/dev/disk/by-' + lc(m && b) + '/'; }
function words(s) { return (s.match(/\S+/g) || []); }


const shortBys = {
  L: 'label',
  PL: 'partlabel',
  PU: 'partuuid',
  U: 'uuid',
};
function translateShortBy(m, p) {
  return '/dev/disk/by-' + mustBe.nest('Translation of disk device prefix "'
    + m + '"', shortBys[p]) + '/';
}


function normalizeSpec(s) {
  mustBe('obj | nonEmpty str', 'device/mountpoint spec', s);
  if (is.str(s)) { return { device: s }; }
  return s;
}


function parseFsOpt(orig) {
  if (Array.isArray(orig)) { return orig.join(','); }
  if (is.obj(orig)) { return compileMountOpts(orig); }
  return String(orig);
}


function parseDisk(spec) {
  const mustPop = objPop(normalizeSpec(spec), { mustBe }).mustBe;
  const descr = mustPop('str', 'descr', '');

  let device = mustPop('nonEmpty str', 'device');
  if (!/:|=|\//.test(device)) { device = 'PL:' + device; }
  device = device.replace(/^([A-Z]+)=/, translateExactBy);
  device = device.replace(/^([A-Z]+):/, translateShortBy);

  let mntp = mustPop('str', 'mountAt', '');
  if (!mntp) { mntp = '/mnt/' + pathLib.basename(device); }

  const fsType = mustPop('nonEmpty str', 'fsType', 'auto');
  const fsOpt = parseFsOpt(mustPop('str | ary | obj', 'fsOpt',
    'defaults,noatime'));

  const path = mntp.replace(/^\//, '').replace(/\//g, '-');

  let trigger = mustPop('str | ary', 'wantedBy', 'multi-user.target');
  if (Array.isArray(trigger)) { trigger = trigger.join(' '); }

  mustPop.done('Unsupported options for ' + device + ' -> ' + mntp);

  const pathPre = '/etc/systemd/system/';
  const unit = {
    pathPre,
    path,
    pathSuf: '.mount',
    mimeType: 'static_ini',
    content: {
      Unit: {
        Description: descr,
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

  const symSuf = '.wants/ =-> ../' + unit.path + unit.pathSuf;
  const enable = words(trigger).map(t => pathPre + t + symSuf);

  return [mntp + '/', unit, ...enable];
}


export default parseDisk;
