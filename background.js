chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.invoiceData) {
        //alert('test2 - ' + request.invoiceData);
        chrome.storage.local.set({ "invoiceData": request.invoiceData })
        sendResponse({"success": true, "AckFromBG": "I have received your messgae. Thanks!"}); // sending back the acknowlege to the webpage
    }
});