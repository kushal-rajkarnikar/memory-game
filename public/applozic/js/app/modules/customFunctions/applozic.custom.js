(function(window){
    'use strict';
    function define_AlCustomService() {
  var AlCustomService = {};
AlCustomService.logout = function() {
   if (typeof window.Applozic.ALSocket !== 'undefined') {
        window.Applozic.ALApiService.setAjaxHeaders('','','','','');
        window.Applozic.ALSocket.disconnect();
        ALStorage.clearMckMessageArray();
        ALStorage.clearAppHeaders();
        ALStorage.clearMckContactNameArray();
        ALStorage.removeEncryptionKey();
        w.sessionStorage.clear();
   }
};

return AlCustomService;
}

//define globally if it doesn't already exist
if (typeof (AlCustomService) === 'undefined') {
    window.Applozic.AlCustomService = define_AlCustomService();
}
else {
    console.log("ALCustomService already defined.");
}
})(window);
