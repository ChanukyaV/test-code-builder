'use strict';

/**
 * @author Chanukya Vempati
 * @since 8th June 2020
 */

chrome.storage.sync.get('elmt_scan', function(data) {
  console.log("Element locators from options page: " + data.elmt_scan);
  if(!data.elmt_scan || data.elmt_scan === "") {
    data.elmt_scan = "input, button, select, a, textarea";
  }
  console.log("Element locators to be scanned: " + data.elmt_scan);
  let elmts = document.querySelectorAll(data.elmt_scan);
  console.log("Total elements are: " + elmts.length);
  chrome.storage.sync.get('attr_verify', function(data) {
    console.log("Attributes from options page: " + data.attr_verify)
    let attrArr = data.attr_verify ? data.attr_verify.replace(/\s/g, "").split(",") : ["id", "name", "data-testid"];
    console.log("Attributes to be verified are: " + attrArr)
    let total = elmts.length; let green = 0; let red = 0; let yellow = 0
    let elmts_map = new Map();
    for(let i=0; i<elmts.length; i++) {
      let curr = elmts[i]; let tag = curr.tagName;
      elmts_map = updateElmtCount(elmts_map, tag);
      if(checkAttr(curr, attrArr)) {
        curr.style.border = '3px solid green'; green++;
      } else if(curr.textContent !== "") {
        curr.style.border = '3px solid yellow'; yellow++;
      }
      else {
        curr.style.border = '3px solid red'; red++;
      }
      addListeners(curr);
    }
    console.log("Total green elements are: " + green);
    console.log("Total yellow elements are: " + yellow);
    console.log("Total red elements are: " + red);
    let elmt_info = "<h6 class='h6'>Element Details: </h6>";
    const itr = elmts_map.entries();
    for(let i=0; i<elmts_map.size; i++) {
      const curr_pair = itr.next().value;
      elmt_info = elmt_info + "Total " + curr_pair[0] + "(s) are: " + curr_pair[1] + "<br/>";
    }
    createModal();
    let msg = 'Total: ' + elmts.length + '<br/>Matched: ' + green + '<br/>Unmatched: ' + (yellow+red) + '<br/>UAF score is: '
                + Math.round(((green + yellow/2)*100)/total) + ' out of 100<br/><br/>' + elmt_info;
    document.getElementById("modalTitle").innerText = "Page Overview"
    document.getElementById("msg").innerHTML = msg;
    $('#myModal').modal('show');
  });
});

function addListeners(elmt) {
  elmt.onclick = function() {
    let suggestion = prepareSuggestion(elmt);
    document.getElementById("modalTitle").innerText = "Element interaction suggestions";
    document.getElementById("msg").innerText = suggestion + "\n" + elmt.outerHTML;
    $('#myModal').modal('show');
  }
}

function prepareSuggestion(elmt) {
  let suggestion = "";
  let method_name = "await this.findElement(";
  let action = guessAction(elmt);
  if(elmt.id) {
    suggestion = suggestion + method_name + "By.id('"+ elmt.id +"'))" + action + "; hits: " + getHits("#" + elmt.id) + "\n";
  } if(elmt.name) {
    suggestion = suggestion + method_name + "By.name('"+ elmt.name +"'))" + action + "; hits: " + getHits(elmt.tagName + "[name='" +elmt.name+ "']") + "\n";
  } if(elmt.hasAttributes()) {
    let attr = elmt.attributes;
    for(let i=0; i<attr.length; i++) {
      let curr = attr.item(i); let loc = elmt.tagName.toLowerCase() + "[" + curr.name + "='" + curr.value + "']";
      let hits = getHits(loc); let value_len = curr.value.length;
      if(hits < 3 && curr.name !== "style" && curr.name !== "id" && curr.name !== "name" && curr.name !== "type" && value_len > 1 && value_len < 45) {
        suggestion = curr.name === "class" ? suggestion + method_name + "By.className('"+ curr.value +"'))" + action + "; hits: " + hits + "\n" :
          suggestion + method_name + "By.css(\""+ loc +"\"))" + action + "; hits: " + hits + "\n";
      }
    }
  } if(elmt.innerHTML !== "" && elmt.innerHTML === elmt.textContent && elmt.textContent.length < 30) {
    if(elmt.tagName === "A" ) {
      suggestion = suggestion + method_name + "By.linkText('"+ elmt.textContent +"'))" + action + "; hits: " + getHits("//a[text()='"+ elmt.textContent +"']") + "\n";
    } else {
      suggestion = suggestion + method_name + "By.xpath(\"//" + elmt.tagName.toLowerCase() + "[text()='"+ elmt.textContent +"']\"))" + action + "; hits: "
        + getHits("//" + elmt.tagName.toLowerCase() + "[text()='"+ elmt.textContent +"']") + "\n";
    }
  }
  suggestion = suggestion.indexOf("By") === -1 ? suggestion + "No match Found\n" : suggestion;
  return suggestion;
}

function guessAction(elmt) {
  let action = "";
  let tag = elmt.tagName.toLowerCase(); let type = elmt.type;
  if(tag === "input" && type === "text") {
    action = ".sendKeys('')";
  } else if(tag === "button" || tag === "a") {
    action = ".click()";
  }
  return action;
}

function findByXpath(xpath) {
  return document.evaluate(xpath, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
}

function getHits(expr) {
  if(expr.startsWith("//")) {
    return document.evaluate(expr, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
  } else {
    return document.querySelectorAll(expr).length;
  }
}

function createModal() {
  let div = document.createElement('div');
  let menu_text = '<div id="myModal" class="modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">' +
  '<span class="h3 modal-title" id="modalTitle">Modal Title</span><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
  '</div><div class="modal-body"><p id="msg" class="text-primary">Modal body text goes here.</p></div><div class="modal-footer">' +
  '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div></div>'
  div.innerHTML = menu_text;
  document.body.appendChild(div);
}

function updateElmtCount(elmts_map, tag) {
  if(elmts_map.has(tag)) {
    elmts_map.set(tag, elmts_map.get(tag) + 1);
  } else {
    elmts_map.set(tag, 1);
  }
  return elmts_map;
}

function checkAttr(elmt, attrArr) {
  for(let i=0; i<attrArr.length; i++) {
    if(elmt.hasAttribute(attrArr[i])) {
      return true;
    }
  }
  return false;
}
