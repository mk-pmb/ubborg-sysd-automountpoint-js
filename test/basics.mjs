// -*- coding: utf-8, tab-width: 2 -*-

import equal from 'equal-pmb';

import amp from '..';

const metaDefaults = {
  pathPre: '/etc/systemd/system/',
  pathSuf: '.mount',
  mimeType: 'static_ini',
};
const unitDefaults = {
  Unit: { Description: '' },
  Install: { WantedBy: 'multi-user.target' },
};


(function test() {
  const input = 'backups';
  const specs = amp(input);
  const want = [
    '/mnt/backups/',
    { path: 'mnt-backups',
      ...metaDefaults,
      content: {
        ...unitDefaults,
        Mount: {
          What:     '/dev/disk/by-partlabel/backups',
          Where:    '/mnt/backups',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
  ];
  const cmp = 1;
  equal(specs[cmp], want[cmp]);
  equal.lists(specs, want);
}());


(function test() {
  const input = ['U:f00', 'L:bar', 'ID=dm-name-qux'];
  const specs = amp(input);
  const want = [
    '/mnt/f00/',
    '/mnt/bar/',
    '/mnt/dm-name-qux/',
    { path: 'mnt-f00',
      ...metaDefaults,
      content: {
        ...unitDefaults,
        Mount: {
          What:     '/dev/disk/by-uuid/f00',
          Where:    '/mnt/f00',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
    { path: 'mnt-bar',
      ...metaDefaults,
      content: {
        ...unitDefaults,
        Mount: {
          What:     '/dev/disk/by-label/bar',
          Where:    '/mnt/bar',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
    { path: 'mnt-dm-name-qux',
      ...metaDefaults,
      content: {
        ...unitDefaults,
        Mount: {
          What:     '/dev/disk/by-id/dm-name-qux',
          Where:    '/mnt/dm-name-qux',
          Type:     'auto',
          Options:  'defaults,noatime',
        },
      },
    },
  ];
  const cmp = 1;
  equal(specs[cmp], want[cmp]);
  equal.lists(specs, want);
}());





console.info('+OK basics test passed.');
