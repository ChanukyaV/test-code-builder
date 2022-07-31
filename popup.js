// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * @author Chanukya Vempati
 * @since 5th June 2020
 */

codeStepsBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'ext/jquery.min.js'
    });
    chrome.tabs.insertCSS(tabs[0].id, {
      file: 'ext/bootstrap.min.css'
    });
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'ext/bootstrap.bundle.min.js'
    });
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/code_steps.js'
    });
  });
};

elmtScanBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/scan_ui.js'
    });
  });
};

proposeDTD.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/propose_dtd.js'
    });
  });
};