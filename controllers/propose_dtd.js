'use strict';

/**
 * @author Chanukya Vempati
 * @since 8th June 2020
 */

var locators = prompt('Elements to be updated (provide css locators of elements separeted by comma)');
var elmts = document.querySelectorAll(locators);
var source = prompt('Provide attribute name or text (Ex: title, alt or text');
for(var i=0; i<elmts.length; i++) {
  var elmt = elmts[i];
  var testId = source === "text" ? elmt.textContent : elmt.getAttribute(source);
  if(testId) {
    testId = testId.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    if(testId.length < 30) {
      elmt.setAttribute('data-testid', testId);
      elmt.style.border = "3px solid blue";
    }
  }
}
