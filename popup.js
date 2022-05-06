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

dataMgrBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/open_data_manager.js'
    });
  });
};

runDFBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/run_all_df.js'
    });
  });
};

allOrgBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/open_all_orgs.js'
    });
  });
};

reviewBtn.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'controllers/pre_review.js'
    });
  });
};