// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * @author Chanukya Vempati
 * @since 5th June 2020
 */

let org_fld = document.getElementById('all_orgs');

chrome.storage.sync.get(['org_details'], function(data) {
  org_fld.value = data.org_details ? data.org_details : '';
});

org_fld.addEventListener('change', function() {
  chrome.storage.sync.set({org_details: org_fld.value}, function() {
    console.log('Org details are: ' + org_fld.value);
  })
});
