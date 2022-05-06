/**
 * @author Chanukya Vempati
 * @since 27th June 2020
 */

 var activeElmt;
 var prevImports = "";
 var currImports = "";
 var prevCode = "";
 var currCode = "";
 var varCount = 0;

 chrome.storage.sync.get('elmt_scan', function(data) {
   console.log("Element locators from options page: " + data.elmt_scan);
   if(!data.elmt_scan || data.elmt_scan === "") {
     data.elmt_scan = "input, button, select, a, textarea";
   }
   console.log("Element locators to be scanned: " + data.elmt_scan);

   let elmts = $(data.elmt_scan);
   createElmtModal();
   createPageModal();
   elmts.each( function() {
     let curr = $(this);
     curr[0].style.border = '2px solid #3399ff';
     addElmtListener(curr);
   });
   addPageListener();
 });

 function createElmtModal() {
   let div = document.createElement('div');
   let menu_text = '<div id="elmtModal" class="modal" tabindex="-1" role="dialog">' +
     '<div class="modal-dialog" role="document"><div class="modal-content">' +
       '<div class="modal-header"><h3 class="h3 modal-title">Choose your steps</h3>' +
       '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
     '</div>' +
     '<div class="modal-body">' +
       '<div class="btn-group dropdown">' +
         '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Find Element</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtFind" value="noWait">&nbsp;No additional wait</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtFind" value="waitEE">&nbsp;Wait for element enabled</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtFind" value="waitEV">&nbsp;Wait for element visible</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" id="actionsBtn">Actions</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="checkbox" name="elmtAction" value="clear">&nbsp;Clear</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="checkbox" name="elmtAction" value="defaultClk" title="Click the element and wait for entire page loading">&nbsp;Click</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="checkbox" name="elmtAction" value="skipWaitClk">&nbsp;Click &amp; skip wait</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="checkbox" name="elmtAction" value="clickES">&nbsp;Click &amp; Wait for Embeded Spinner</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="checkbox" name="elmtAction" value="type">&nbsp;Type</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">Waits</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtWait" value="noWait">&nbsp;Wait for element located</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtWait" value="waitEE">&nbsp;Wait for element enabled</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtWait" value="waitEV">&nbsp;Wait for element visible</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" style="background-color: #9999ff">Verify</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtVerify" value="toBe">&nbsp;To be present</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtVerify" value="notToBe">&nbsp;Not to be present</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtVerify" value="toBeEnabled">&nbsp;To be enabled</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="elmtVerify" value="toBeVisible">&nbsp;To be visible</input></label></div>' +
         '</div>' +
       '</div>' +
       '<hr class="mt-3 mb-3">' +
       '<p class="text-primary" id="code">Start with the first interaction you want to do on the element.</p>' +
       '<button type="button" class="btn btn-link mt-1" id="copyBtn" title="Copy code to clipboard" style="font-size: 12px; float: right;"><kbd>Copy</kbd></button>' +
     '</div>' +
     '<div class="modal-footer">' +
       '<div class="btn-group dropdown">' +
         '<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">Options</button>' +
         '<div class="dropdown-menu">' +
           '<div class="dropdown-item"><button class="btn btn-link" id="methodBtn">Make it a method</button></div>' +
           '<div class="dropdown-item"><button class="btn btn-link" id="classBtn">Make it a class</button></div>' +
           '<div class="dropdown-item"><button class="btn btn-link" id="onlyCodeBtn">Copy only code</button></div>' +
         '</div>' +
       '</div>' +
       '<button type="button" class="btn btn-danger" id="clearBtn" title="Clear the code">Clear</button>' +
       '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
     '</div>' +
   '</div>'
   div.innerHTML = menu_text;
   document.body.appendChild(div);
   attachElmtModalEvents();
 }

 function createPageModal() {
   let div = document.createElement('div');
   let menu_text = '<div id="pageModal" class="modal" tabindex="-1" role="dialog">' +
     '<div class="modal-dialog" role="document"><div class="modal-content">' +
       '<div class="modal-header"><h3 class="h3 modal-title">Choose your steps</h3>' +
       '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
     '</div>' +
     '<div class="modal-body">' +
       '<div class="btn-group dropdown">' +
         '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Navigate</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageNav" value="newUrl">&nbsp;To new url</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageNav" value="toDash">&nbsp;To Dashboard</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageNav" value="toApp">&nbsp;To App</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" id="actionsBtn">Switch to</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageSwitch" value="frame">&nbsp;Frame</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageSwitch" value="window">&nbsp;Window</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageSwitch" value="parentWin">&nbsp;Parent Window</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown">Waits</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageWait" value="titleIs">&nbsp;Wait for title is</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageWait" value="titleMatch">&nbsp;Wait for title matches</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageWait" value="urlIs">&nbsp;Wait for url is</input></label></div>' +
         '</div>' +
       '</div>' +
       '<div class="btn-group dropdown ml-3">' +
         '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" style="background-color: #9999ff">Page Objects</button>' +
         '<div class="dropdown-menu">' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageObj" value="assetHeader">&nbsp;Asset Header</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageObj" value="dashboard">&nbsp;Dashboard</input></label></div>' +
           '<div class="radio dropdown-item"><label><input type="radio" name="pageObj" value="dataManager">&nbsp;Data Manager</input></label></div>' +
         '</div>' +
       '</div>' +
       '<hr class="mt-3 mb-3">' +
       '<p class="text-primary" id="code">Start with the first interaction you want to do on the page.</p>' +
       '<button type="button" class="btn btn-link mt-1" id="copyBtn" title="Copy code to clipboard" style="font-size: 12px; float: right;"><kbd>Copy</kbd></button>' +
     '</div>' +
     '<div class="modal-footer">' +
       '<div class="btn-group dropdown">' +
         '<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">Options</button>' +
         '<div class="dropdown-menu">' +
           '<div class="dropdown-item"><button class="btn btn-link" id="opt1Btn">Option 1</button></div>' +
           '<div class="dropdown-item"><button class="btn btn-link" id="opt2Btn">Option 2</button></div>' +
           '<div class="dropdown-item"><button class="btn btn-link" id="opt3Btn">Opiton 3</button></div>' +
         '</div>' +
       '</div>' +
       '<button type="button" class="btn btn-danger" id="clearBtnPage" title="Clear the code">Clear</button>' +
       '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
     '</div>' +
   '</div>'
   div.innerHTML = menu_text;
   document.body.appendChild(div);
   attachPageModalEvents();
 }

 function getHits(expr) {
   if(expr.startsWith("//")) {
     return document.evaluate(expr, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
   } else {
     return document.querySelectorAll(expr).length;
   }
 }

 function genElmtActionCode() {
   let elmtFindVal = $('input[name=elmtFind]:checked').attr('value');
   let actions = getActionSuffix();
   let imports = genImports(elmtFindVal, actions.toString());
   currImports = prevImports + imports;
   currCode = prevCode + prepareSyntax(activeElmt[0], getMethodSuffix(elmtFindVal), actions) + "<br/>";
   $("#code").html(currImports + "<br/><p id='onlyCode'>" + currCode + "</p>");
 }

 function genElmtWaitCode() {
   let elmtWaitVal = $('input[name=elmtWait]:checked').attr('value');
   let imports = genImports(elmtWaitVal);
   currImports = prevImports + imports;
   currCode = prevCode + prepareWaitSyntax(activeElmt[0], getMethodSuffix(elmtWaitVal)) + "<br/>";
   $("#code").html(currImports + "<br/><p id='onlyCode'>" + currCode + "</p>");
 }

 function genElmtVerifyCode() {
   let elmtVerifyVal = $('input[name=elmtVerify]:checked').attr('value');
   let imports = genImports("noWait");
   currImports = prevImports + imports;
   currCode = prevCode + prepareVerifySyntax(activeElmt[0], elmtVerifyVal) + "<br/>";
   $("#code").html(currImports + "<br/><p id='onlyCode'>" + currCode + "</p>");
 }

 function getActionSuffix() {
   let actionOpts = $('input[name=elmtAction]:checked');
   let actions = [];
   $.each(actionOpts, function( index, actionOpt ) {
     switch (actionOpt.value) {
        case 'clear':
          actions.push(".clear()")
          break;
        case 'defaultClk':
          actions.push(".click()")
          break;
        case 'skipWaitClk':
          actions.push(".click(true)")
          break;
        case 'clickES':
          actions.push(".click(false, SPINNERS.Embedded_Page_Spinner)")
          break;
        case 'type':
          actions.push(".sendKeys('&lt;your_value&gt;')")
          break;
     }
   });
   return actions;
 }

 function genImports(elmtFindVal, actions) {
   let imports = prevImports.indexOf("{By}") !== -1 ? "" : "import {By} from 'selenium-webdriver';<br/>";
   imports = elmtFindVal !== "noWait" && prevImports.indexOf("WAIT_TYPE") === -1 ?
        imports + "import {WAIT_TYPE} from 'TestFramework/src/e2e/SeleniumJS/Utils/WaitUtil';<br/>" : imports;
   if(actions) {
     imports = actions.indexOf("SPINNERS") !== -1 && prevImports.indexOf("SPINNERS") === -1 ?
          imports.replace("WAIT_TYPE", "WAIT_TYPE, SPINNERS") : imports;
   }
   return imports;
 }

 function attachElmtModalEvents() {
   $('input[name=elmtFind]').change(function() {
      $("#actionsBtn").prop('disabled', false);
      genElmtActionCode();
   });
   $('input[name=elmtAction]').change(function() {
     if($('input[name=elmtAction]:checked').length > 2 ) {
       $('input[name=elmtAction]:not(:checked)').prop('disabled', true);
     } else {
       $('input[name=elmtAction]:not(:checked)').prop('disabled', false);
     }
     genElmtActionCode();
   });
   $('input[name=elmtWait]').change(function() {
      genElmtWaitCode();
   });
   $('input[name=elmtVerify]').change(function() {
      genElmtVerifyCode();
   });
   $('#clearBtn').click(function() {
      prevCode = ""; prevImports = ""; varCount = 1;
      $("#code").text("Start with the first interaction you want to do on the element.");
   })
   $('#copyBtn').click(function() {
     copyCode('code');
   })
   $('#methodBtn').click(function() {
     $("#code").html(currImports + "<br/><p id='onlyCode'>" + "async &lt;your_method_name&gt; {<br/>" + currCode + "}</p>");
   })
   $('#classBtn').click(function() {
     currImports = currImports.indexOf("BaseSeleniumPage") === -1 ?
        currImports + "import BaseSeleniumPage from 'TestFramework/src/e2e/SeleniumJS/PageObjects/BaseSeleniumPage';<br/>" : currImports;
     $("#code").html(currImports + "<br/><p id='onlyCode'>" + "export default class &lt;your_class_name&gt; extends BaseSeleniumPage {<br/>" +
          "async &lt;your_method_name&gt; {<br/>" + currCode + "}<br/>}</p>");
   })
   $('#onlyCodeBtn').click(function() {
     copyCode('onlyCode');
   })
 }

 function getMethodSuffix(value) {
   switch (value) {
      case 'waitEE':
       return ", WAIT_TYPE.Element_Enabled)";
      case 'waitEV':
       return ", WAIT_TYPE.Element_Visible)";
      default:
       return ")";
   }
 }

 function copyCode(srcId) {
   let src = document.getElementById(srcId);
   if(src) {
     let range = document.createRange();
     range.selectNode(src);
     window.getSelection().removeAllRanges();
     window.getSelection().addRange(range);
     document.execCommand("copy");
   }
 }

 function addElmtListener(elmt) {
   elmt[0].oncontextmenu = function(event) {
     activeElmt = elmt;
     prevCode = currCode;
     prevImports = currImports;
     varCount++;
     clearSelection();
     $("#actionsBtn").prop('disabled', true);
     $('#elmtModal').modal('show');
     event.preventDefault();
   }
 }

 function addPageListener() {
   document.ondblclick = function(event) {
     $('#pageModal').modal('show');
     event.preventDefault();
   }
 }

 function attachPageModalEvents() {

 }

 function clearSelection() {
   $('input[name=elmtFind]').prop("checked", false);
   $('input[name=elmtAction]').prop("checked", false);
   $('input[name=elmtWait]').prop("checked", false);
   $('input[name=elmtVerify]').prop("checked", false);
 }

 function prepareWaitSyntax(elmt, method_suffix) {
   let findCode = genFindElmtCode(elmt, method_suffix);
   let waitCode = findCode.replace("findElement", "wait().waitForElement");
   waitCode = waitCode.replace(", WAIT_TYPE.", ", 'Wait condition is failed', WAIT_TYPE.");
   return waitCode + ";";
 }

 function prepareVerifySyntax(elmt, elmtVerifyVal) {
   let verifyCode = genFindElmtCode(elmt, ')');
   switch (elmtVerifyVal) {
     case 'toBe':
       verifyCode = verifyCode.replace('findElement', 'verifyElementFound');
       verifyCode = "expect(" + verifyCode + ").toBe(true);";
       break;
     case 'notToBe':
       verifyCode = verifyCode.replace('findElement', 'verifyElementFound');
       verifyCode = "expect(" + verifyCode + ").toBe(false);";
       break;
     case 'toBeEnabled':
       verifyCode = "expect(" + verifyCode + ".isEnabled()).toBe(true);";
       break;
     case 'toBeVisible':
       verifyCode = "expect(" + verifyCode + ".isDisplayed()).toBe(true);";
       break;
   }
   return verifyCode;
 }

 function prepareSyntax(elmt, method_suffix, actions) {
   let findCode = genFindElmtCode(elmt, method_suffix);
   if (actions.length === 1) {
     findCode = findCode + actions[0];
   } else if (actions.length > 1){
     findCode = "const &lt;your_var_" + varCount + "&gt; = " + findCode + ";<br/>"
     for(let i=0; i<actions.length; i++) {
       findCode = findCode + "&lt;your_var_" + varCount + "&gt;" + actions[i] + ";<br/>";
     }
     findCode = findCode.substr(0, findCode.length-6);
   }
   return findCode + ";";
 }

 function genFindElmtCode(elmt, method_suffix) {
   let suggestion = "";
   let attr_ignored = ["id", "name", "type", "aria-expanded", "style"]
   let method_prefix = "await this.findElement(";
   if(elmt.id && getHits("#" + elmt.id) === 1) {
     suggestion = method_prefix + "By.id('"+ elmt.id +"')" + method_suffix;
   } else if(elmt.name && getHits("#" + elmt.id) === 1) {
     suggestion = method_prefix + "By.name('"+ elmt.name +"')" + method_suffix;
   } else if(elmt.hasAttributes()) {
     let attr = elmt.attributes;
     for(let i=0; i<attr.length; i++) {
       let curr = attr.item(i); let loc = elmt.tagName.toLowerCase() + "[" + curr.name + "='" + curr.value + "']";
       let hits = getHits(loc); let value_len = curr.value.length;
       if(hits === 1 && !attr_ignored.includes(curr.name) && value_len > 1 && value_len < 45) {
         suggestion = method_prefix + "By.css(\""+ loc +"\")" + method_suffix;
       }
     }
   }
   if(suggestion === "" && elmt.innerHTML !== "" && elmt.innerHTML === elmt.textContent && elmt.textContent.length < 30) {
     if(elmt.tagName === "A" && getHits("//a[text()='"+ elmt.textContent +"']") === 1) {
       suggestion = method_prefix + "By.linkText('"+ elmt.textContent +"')" + method_suffix;
     } else if(getHits("//" + elmt.tagName.toLowerCase() + "[text()='"+ elmt.textContent +"']") === 1) {
       suggestion = method_prefix + "By.xpath(\"//" + elmt.tagName.toLowerCase() + "[text()='"+ elmt.textContent +"']\")" + method_suffix;
     }
   }
   return suggestion === "" ? method_prefix + "By.css('&lt;your_css_locator&gt;')" + method_suffix : suggestion;
 }
