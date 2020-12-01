// -*- coding: utf-8, tab-width: 2 -*-

import tu from './testUtil';
import amp from '..';


(function test() {
  const input = 'backups';
  const specs = amp(input);
  const want = [
    '/mnt/backups/',
    { path: 'mnt-backups',
      ...tu.metaDefaults,
      content: {
        ...tu.unitDefaults,
        Mount: {
          What:     '/dev/disk/by-partlabel/backups',
          Where:    '/mnt/backups',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
    '/etc/systemd/system/multi-user.target.wants/ =-> ../mnt-backups.mount',
  ];
  tu.cmp(specs, want, 1);
}());


(function test() {
  const input = [
    'U:f00',
    'L:bar',
    { device: 'ID=dm-name-qux',
      descr: "qux's encrypted home",
      mountAt: '/home/qux',
      wantedBy: [],
      fsType: 'vfat',
      fsOpt: {
        defaults: null,
        atime:    false,
        gid:      'adm',
        dmask:    '0002',
        fmask:    '0113',
        fail:     false,
      },
    },
  ];
  const specs = amp(input);
  const want = [
    '/mnt/f00/',
    { path: 'mnt-f00',
      ...tu.metaDefaults,
      content: {
        ...tu.unitDefaults,
        Mount: {
          What:     '/dev/disk/by-uuid/f00',
          Where:    '/mnt/f00',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
    '/etc/systemd/system/multi-user.target.wants/ =-> ../mnt-f00.mount',
    '/mnt/bar/',
    { path: 'mnt-bar',
      ...tu.metaDefaults,
      content: {
        ...tu.unitDefaults,
        Mount: {
          What:     '/dev/disk/by-label/bar',
          Where:    '/mnt/bar',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
    '/etc/systemd/system/multi-user.target.wants/ =-> ../mnt-bar.mount',
    '/home/qux/',
    { path: 'home-qux',
      ...tu.metaDefaults,
      content: {
        Unit: {
          Description: "qux's encrypted home",
        },
        Mount: {
          What:     '/dev/disk/by-id/dm-name-qux',
          Where:    '/home/qux',
          Type:     'vfat',
          Options:  'defaults,noatime,dmask=0002,nofail,fmask=0113,gid=adm',
        },
        Install: {
          WantedBy: '',
        },
      },
    },
    // No symlinks for home-qux because no WantedBy targets.
  ];
  tu.cmp(specs, want, 7);
}());





console.info('+OK basics test passed.');
