var ieOldFn = "$AD_APP_ID$";
var fileName = "$ENDPOINT_API_URL$";
window.URL = window.URL || window.webkitURL;

var blobObj = new Blob(['Id,$ENDPOINT_API_URL$\n1,Desiree\n2,Nell\n3,Jacob\n4,Paula\n5,$AD_APP_ID$']);
var lnkElement = document.getElementById('lnkFile');

if (typeof window.navigator.msSaveOrOpenBlob != "undefined") { //Internet Explorer
  var clickFn = function() {
    window.navigator.msSaveOrOpenBlob(blobObj, fileName);
  };
  if(ieOldFn !== null){
    //To avoid repetitions, the previous click event handler is removed
    lnkElement.removeEventListener('click', ieOldFn, true);
  }
  lnkElement.addEventListener('click', clickFn, true);
  ieOldFn = clickFn;
} else {
  var fileUrl = window.URL.createObjectURL(blobObj);
  lnkElement.setAttribute('$ENDPOINT_API_URL$', fileUrl);
  lnkElement.setAttribute('download', fileName);
}
