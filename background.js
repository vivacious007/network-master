var DEVELOPMENT = false;
var NAVIGATOR_ONLINE = 1,
    NAVIGATOR_OFFLINE = 0,
    notifications = [];

var screemAudio = document.createElement('audio');
  screemAudio.src = chrome.extension.getURL("screamwoman.ogg");
  screemAudio.load();

  function updateOnlineStatus() {
      var networkStatus = navigator.onLine ? NAVIGATOR_ONLINE : NAVIGATOR_OFFLINE;
      console.log(networkStatus);
      chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});

      if( DEVELOPMENT )
        chrome.browserAction.setBadgeText({text: String(networkStatus)});

      if( networkStatus == NAVIGATOR_OFFLINE ){
        chrome.browserAction.setIcon({path: chrome.extension.getURL("offline.png")});
        screemAudio.play();
      } else{
        chrome.browserAction.setIcon({path: chrome.extension.getURL("online.png")});
      }
  }

  window.addEventListener("offline", function () {
    updateOnlineStatus();
    showNotification(NAVIGATOR_OFFLINE);
  }, false);

  window.addEventListener("online", function () {
    updateOnlineStatus();
    showNotification(NAVIGATOR_ONLINE);
  }, false);

  function showNotification(networkStatus) {//shows a message based on weather you have internet connection and how soon the last message was sent

   var notification;

   if( networkStatus == NAVIGATOR_ONLINE ){
      notification = webkitNotifications.createNotification(
            chrome.extension.getURL("online.png"),
            "",
            "Your system is online");
   }else{
        notification = webkitNotifications.createNotification(
            chrome.extension.getURL("offline.png"),
            "",
            "Your system went offline");
   }
   

    notification.onclick = function(){ removeNotification(notifications.length) }   //remove notification when clicked
    notification.show() //shows the notification
    notifications[notifications.length] = {'notification':notification,'timer':setTimeout( removeNotification,3500 )}; //removes notification after an amount of time
  }


function removeNotification(index) {
  if (index == null) index=0;
  notifications[0].notification.cancel() //hides the notification
  clearTimeout(notifications[0].timer) //removes the timer for the notification that can call this function
  notifications.splice(0,1) //removes notification from list
}

updateOnlineStatus();