/**
 * @author Chanukya Vempati
 * @since 8th June 2020
 */

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        //console.log("Hello. This message was sent from inject/inject.js");
    }
    }, 10);
});

window.addEventListener ("load", router, false);

function checkLoc(substr) {
  return window.location.href.indexOf(substr) !== -1
}

function router (evt) {
    
}

function findByXpath(xpath) {
  return document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
