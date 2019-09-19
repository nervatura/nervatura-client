/*globals Windows */

window.platform = {
  checkScanner: function(defvalue){
    try {
      if (window.cordova && defvalue) {
        if (window.cordova.plugins.barcodeScanner) {
          return true;} 
        else {
          return false;}}
      else {
        return false;}}
    catch (err) {
      return false;}
  },

  barcodeScan: function(callback){
    try{
      window.cordova.plugins.barcodeScanner.scan(
        (result) => {
          if (result.cancelled===false){
            callback(null, {text:result.text, format:result.format});}}, 
        (error) => {
          callback(error,{});});}
    catch (err) {
      callback(err.message, {}); }
  },

  fileExport: function(options, callback){

    function writerFile(dir, filename){
      dir.getFile(filename, {create: true},
        function(fileEntry) {
          fileEntry.createWriter(
            function(writer) {
              writer.onwrite = () => {
                if(callback){ callback(null); }};
              writer.seek(0);
              writer.write(options.output);}, 
            function(error) {
              if(callback){ callback("Error code:"+error.code); }});
        },
        function(error) {
          if(callback){ callback("Error code:"+error.code); }});}

    function getDirectory(dir){
      if (window.cordova.platformId === "android" && window.cordova.file.external !== null) {
        dir.getDirectory(options.export_dir, {create: true, exclusive: false},
          function(parent) {
            var filename = options.export_dir + "/" + options.filename;
            writerFile(dir, filename);},
          function(error) {
            writerFile(dir, options.filename);});}
      else {
        writerFile(dir, options.filename);}}

    if(window.cordova){
      switch (window.cordova.platformId) {
        case "android":
        case "browser":
        case "ios":
          if (window.cordova.file && (window.cordova.platformId !== "browser")) {
            var base_dir = window.cordova.file.dataDirectory;
            if (window.cordova.platformId === "android" && window.cordova.file.external !== null) {
              base_dir = window.cordova.file.externalRootDirectory;}
            if (window.cordova.platformId === "ios") {
              base_dir = window.cordova.file.documentsDirectory;}
            window.resolveLocalFileSystemURL(base_dir,
              function(dir) {
                getDirectory(dir);}, 
              function(error) {
                if(callback){ callback("Error code:"+error.code); }});}
          else {
            window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
              function(fileSystem) {
                getDirectory(fileSystem.root); }, 
              function(error) {
                if(callback){ callback("Error code:"+error.code); }});}
          break;
        
        case "windows":
          var localFolder = Windows.Storage.DownloadsFolder;
          localFolder.createFileAsync(options.filename).done(
            function(fileEntry) {
              var writeAsync = Windows.Storage.FileIO.writeTextAsync;
              if (options.type==="pdf" || options.type==="xls") {
                options.output = Array.apply(null, new Uint8Array(options.output));
                writeAsync = Windows.Storage.FileIO.writeBytesAsync;}
              writeAsync(fileEntry, options.output).done(
                function() {
                  if(callback){ callback(null); }},
                function(error) {
                  if(callback){ callback(error.message); }});}, 
            function(error) {
              if(callback){ callback(error.message); }});
          break;
      
        default:
          if(callback){ callback(null); }
          break;}
    }
    else{
      if(callback){ callback(null); }}
  },
  
  getCordovaFile: function (database, create, callback){              
    switch (window.cordova.platformId) {
      case "windows":
        var localFolder = Windows.Storage.ApplicationData.current.roamingFolder;
        localFolder.getFileAsync(database+".db").done(
          function (fileEntry) {
            callback(null, fileEntry);},
          function (error) {
            if (error.number === -2147024894) {
              if (create) {
                localFolder.createFileAsync(database+".db").done(
                  function (fileEntry) {
                    callback(null, fileEntry);},
                  function (error) {
                    callback(error.message, null);});}
              else {
                callback(-1);}}
            else {
              callback(error.message, null);}});
        break;
      default:
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
        function (fileSystem) {
          fileSystem.root.getFile(database + ".db", { create: create },
            function (fileEntry) {
              callback(null, fileEntry);},
            function (error) {
              if (error.name === "NotFoundError") {
                callback(-1);}
              else {
                callback(error.message, null);}});},
        function (error) {
          callback(error.message);});}},
  
  createBanner: function(){
    if(window.cordova && window.AdMob && window.adsConfig.ads["banner"]) {
      window.AdMob.createBanner( {
        adId: window.adsConfig.ads["banner"],
        adSize: "SMART_BANNER", //(window.adsConfig.type === "login") ? "SMART_BANNER" : "MEDIUM_RECTANGLE",
        overlap: false,
        autoShow: ((window.adsConfig.type === "login") && (window.adsConfig.eula)) ? true : false 
      });
    }
    else if(window.adContainer.current && window.MicrosoftNSJS && window.adsConfig.ads["banner"]) {
      
      if(window.adContainer.current.id === "adLogin"){
        if(window.screenDiv.current.clientWidth > 728){
          window.adContainer.current.style.width = "728px";
          window.adContainer.current.style.height = "90px";
        } else if(window.screenDiv.current.clientWidth > 640){
          window.adContainer.current.style.width = "640px";
          window.adContainer.current.style.height = "100px";
        } else {
          window.adContainer.current.style.width = "320px";
          window.adContainer.current.style.height = "50px"; }
      }
      
      window.adBanner = new window.MicrosoftNSJS.Advertising.AdControl(window.adContainer.current, { 
        applicationId: window.adsConfig.ads["applicationId"], 
        adUnitId: window.adsConfig.ads["banner"],
        isAutoRefreshEnabled: true,
        onErrorOccurred: function(adControl, e) {},
        onAdRefreshed: function(adControl) {}
      });
    }
  },

  prepareInterstitial: function(){
    if(window.cordova && window.AdMob && window.adsConfig.ads["interstitial"]) {      
      window.AdMob.prepareInterstitial({
        adId: window.adsConfig.ads["interstitial"],
        autoShow: false 
      });
    }
    else if(!window.interstitialAd && window.MicrosoftNSJS) {
      window.interstitialAd = new window.MicrosoftNSJS.Advertising.InterstitialAd();
      window.interstitialAd.onErrorOccurred = function (sender, args) {
        window.interstitialAd = null; };
      window.interstitialAd.onAdReady = function (sender) {};
      window.interstitialAd.onCancelled = function (sender) {
        window.interstitialAd.dispose(); window.interstitialAd = null;
        window.platform.prepareInterstitial();
      };
      window.interstitialAd.onCompleted = function (sender) {
        window.interstitialAd.dispose(); window.interstitialAd = null;
        window.platform.prepareInterstitial();
      };
      window.interstitialAd.requestAd(window.MicrosoftNSJS.Advertising.InterstitialAdType.display, 
        window.adsConfig.ads["applicationId"], window.adsConfig.ads["interstitial"]);
    }
  },

  adsConfig: function(config){
    window.adsConfig = config;
    if(window.cordova && window.AdMob && window.adsConfig) {
      window.AdMob.setOptions({
        isTesting: window.adsConfig["isTesting"],
      });
      if(window.adsConfig.ads["banner"]){
        this.createBanner(); }
      if(window.adsConfig.ads["interstitial"]){
        this.prepareInterstitial();
        document.addEventListener("onAdDismiss",function(data){
          if(data.adType == "interstitial") {
            window.platform.prepareInterstitial();
          }
        })
      }
    }
    else if(window.MicrosoftNSJS) {
      if(window.adsConfig.ads["banner"]){
        this.createBanner(); }
      if(window.adsConfig.ads["interstitial"]){
        this.prepareInterstitial(); }
    }
  },

  showBanner: function(){
    if(window.cordova && window.AdMob && window.adsConfig) {
      if(window.adsConfig.ads["banner"]) {
        window.AdMob.showBanner(window.AdMob.AD_POSITION.BOTTOM_CENTER);
      }
    } else if(window.MicrosoftNSJS && window.adContainer.current) {
    }
  },

  hideBanner: function(){
    if(window.cordova && window.AdMob && window.adsConfig) {
      if(window.adsConfig.ads["banner"]) {
        window.AdMob.removeBanner();
        this.createBanner(); 
      }
    } else if(window.MicrosoftNSJS && window.adContainer.current) {
    }
  },

  showInterstitial: function(){
    if(window.cordova && window.AdMob && window.adsConfig) {
      if(window.adsConfig.ads["interstitial"]) {
        this.hideBanner();
        window.AdMob.showInterstitial();
      }
    } else if (window.interstitialAd && 
      (window.interstitialAd.state === window.MicrosoftNSJS.Advertising.InterstitialAdState.ready)) {
      window.interstitialAd.show();
    }
  },

  hideInterstitial: function(){
    if (window.interstitialAd){
      if (window.interstitialAd._ad._adContainer) {
        window.interstitialAd._ad._adContainer._adClosed(); }
    }
  }

}