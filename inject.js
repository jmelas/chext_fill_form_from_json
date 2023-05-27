
// This helps avoid conflicts in case we inject this script on the same page multiple times without reloading
var injected = injected || (function() {

    var methods = {};

    // This tells the script to listen for messages from our extension
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var data = {};
        // If the method the extension has requested
        // exists, call it and assign its response
        // to data.
        if (methods.hasOwnProperty(request.method))
            data = methods[request.method]();
        // Send the response back to our extension.
        sendResponse({ data: data });
        return true;
    });

    methods.do_init = function() {
        assignValueToInputs("_invoiceType", "58");
        return true;
    }

    methods.do_add = function() {
        let btn = document.getElementById('btnNewInvoiceLine');
        btn.dispatchEvent(new Event('click'));
        return true;
    }

    methods.do_sel = function() {
        chrome.storage.local.get('invoiceData',
            function(data) {
                var jsonObj = JSON.parse(data.invoiceData);
                if (jsonObj["country"] == "GR") {
                    assignValueToInputs("itemLine", "6");
                }
                else {
                    assignValueToInputs("itemLine", "4");
                }
            }
        );
        return true;
    }

    methods.do_fill = function() {
        try {
            chrome.storage.local.get('invoiceData',
                function(data) {
                    var jsonObj = JSON.parse(data.invoiceData);
                    for (var prop in jsonObj) {
                        assignValueToInputs(prop, jsonObj[prop]);
                    }
                    let btn = document.getElementById('btnAddLine');
                    btn.dispatchEvent(new Event('click'));
                }
            );
        } catch (err) {
            alert(err.message);
        }
        return true;
    }

    function assignValueToInputs(inputName, newText) {
        if (typeof newText === 'string' || typeof newText === 'number') {
            //input (text, checkbox, radio)
            Array.from(document.querySelectorAll('input')).forEach(el => {
                if (el.name == inputName || el.getAttribute("ng-reflect-name") == inputName) {
                    if (el.type == "text" || el.type == "number") {
                        el.value = newText;
                    } else if (el.type == "radio") {
                        setCheckedValue(el, newText);
                    } else if (el.type == "checkbox") {
                        if (newText == "true") {
                            el.checked = true;
                        } else {
                            el.checked = false;
                        }
                    }
                }
            });
            //textarea
            Array.from(document.querySelectorAll('textarea')).forEach(el => {
                if (el.name == inputName || el.getAttribute("ng-reflect-name") == inputName) {
                    el.value = newText;
                }
            });
            //select
            Array.from(document.querySelectorAll('select')).forEach(el => {
                if (el.id == inputName || el.name == inputName || el.getAttribute("ng-reflect-name") == inputName) {
                    var val = newText;
                    var opts = el.options;
                    for (var opt, j = 0; opt = opts[j]; j++) {
                        if (opt.value == val) {
                            //alert(opt.value);
                            el.selectedIndex = j;
                            el.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            });
        }
    }

    function setCheckedValue(radioObj, newValue) {
        if (!radioObj)
            return;
        var radioLength = radioObj.length;
        if (radioLength == undefined) {
            radioObj.checked = (radioObj.value == newValue.toString());
            return;
        }
        for (var i = 0; i < radioLength; i++) {
            radioObj[i].checked = false;
            if (radioObj[i].value == newValue.toString()) {
                radioObj[i].checked = true;
            }
        }
    }

    return true;
})();
