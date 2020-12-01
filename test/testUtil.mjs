// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import equal from 'equal-pmb';


const tu = {

  metaDefaults: {
    pathPre: '/etc/systemd/system/',
    pathSuf: '.mount',
    mimeType: 'static_ini',
  },

  unitDefaults: {
    Unit: { Description: '' },
    Install: { WantedBy: 'multi-user.target' },
  },

  cmp(specs, want, detailIdx) {
    const ds = specs[detailIdx];
    const dw = want[detailIdx];
    equal(getOwn(ds, 'content'), getOwn(dw, 'content'));
    equal(ds, dw);
    equal.lists(specs, want);
  },

};

export default tu;
