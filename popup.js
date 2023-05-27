let json_textarea = document.getElementById("json_textarea");
let invoice_btn = document.getElementById('invoice_btn');

window.onload = function(e) {
    chrome.storage.local.get("invoiceData", function(result) { json_textarea.value = result.invoiceData; });
}

function invoke(name)
{
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) { 
        chrome.tabs.executeScript(tabs[0].id, { file: 'inject.js' }, function() {
            chrome.tabs.sendMessage(tabs[0].id, { method: name }, function(response) { return true; });
        });
    });
}

function init()
{
    console.log('### INIT');
    invoke("do_init");
    //window.close();
    setTimeout(function() {
        add();
    }, 600);
}

function add()
{
    console.log('### ADD');
    invoke("do_add");
    //window.close();
    setTimeout(function() {
        sel();
    }, 600);
}

function sel()
{
    console.log('### SEL');
    invoke("do_sel");
    //window.close();
    setTimeout(function() {
        fill();
    }, 600);
}

function fill()
{
    console.log('### FILL');
    invoke("do_fill");
    window.close();
}

invoice_btn.onclick = init;
