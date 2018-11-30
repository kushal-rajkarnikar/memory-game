(function(window){
    'use strict';
    function define_Applozic(){
        var Applozic = {};
        Applozic.init = function(){
          
        }
        return Applozic;
    }
    //define globally if it doesn't already exist
    if(typeof(Applozic) === 'undefined'){
        window.Applozic = define_Applozic();
    }
    else{
        console.log("Applozic already defined.");
    }
})(window);
