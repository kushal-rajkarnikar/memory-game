var mckNotificationUtils = new MckNotificationUtils();
var alNotificationService = new AlNotificationService();

function AlNotificationService() {
  var _this = this;

  var IS_SW_NOTIFICATION_ENABLED;
  var MCK_GETUSERIMAGE;
  var MCK_NOTIFICATION_ICON_LINK;
  var IS_MCK_NOTIFICATION;
  var MCK_SW_SUBSCRIPTION;
  var MCK_SW_REGISTER_URL = "/rest/ws/plugin/update/sw/id";
  var IS_MCK_TAB_FOCUSED = true;

  _this.init = function(optns) {
    IS_SW_NOTIFICATION_ENABLED = (typeof optns.swNotification === "boolean") ? optns.swNotification : false;
    MCK_GETUSERIMAGE = optns.contactDisplayImage;
    MCK_NOTIFICATION_ICON_LINK = optns.notificationIconLink;
    IS_MCK_NOTIFICATION = (typeof optns.desktopNotification === "boolean") ? optns.desktopNotification : false;
  };
  _this.unsubscribeToServiceWorker = function() {
    if (MCK_SW_SUBSCRIPTION) {
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        MCK_SW_SUBSCRIPTION.unsubscribe().then(function(successful) {
          MCK_SW_SUBSCRIPTION = null;
          console.log('Unsubscribed to notification successfully');
        })
      });
    }
  };
  _this.sendSubscriptionIdToServer = function() {
    if (MCK_SW_SUBSCRIPTION) {
      var subscriptionId = MCK_SW_SUBSCRIPTION.endpoint.split("/").slice(-1)[0];
      if (subscriptionId) {
        window.Applozic.ALApiService.sendSubscriptionIdToServer({
          data: {
            "subscriptionId": subscriptionId
          },
          success: function(result) {},
          error: function() {}
        });
      }
    }
  };
  _this.subscribeToServiceWorker = function() {
    if (IS_SW_NOTIFICATION_ENABLED) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', {
          scope: './'
        });
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
          serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true
          }).then(function(pushSubscription) {
            console.log('The reg ID is:: ', pushSubscription.endpoint.split("/").slice(-1));
            MCK_SW_SUBSCRIPTION = pushSubscription;
            _this.sendSubscriptionIdToServer();
          })
        });
      }
    }
  };
}

function MckNotificationUtils() {
  var _this = this;
  var PERMISSION_DEFAULT = "default",
    PERMISSION_GRANTED = "granted",
    PERMISSION_DENIED = "denied",
    PERMISSION = [PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED],
    isSupported = (function() {
      var isSupported = false;
      try {
        isSupported = !!( /* Safari, Chrome */ w.Notification || /* Chrome & ff-html5notifications plugin */ w.webkitNotifications || /* Firefox Mobile */ navigator.mozNotification || /* IE9+ */ (w.external && w.external.msIsSiteMode() !== undefined));
      } catch (e) {}
      return isSupported;
    }()),
    isFunction = function(value) {
      return (value && (value).constructor === Function);
    },
    isString = function(value) {
      return (value && (value).constructor === String);
    },
    isObject = function(value) {
      return (value && (value).constructor === Object);
    },
    ieVerification = Math.floor((Math.random() * 10) + 1),
    noop = function() {};
  _this.permissionLevel = function() {
    var permission;
    if (!isSupported) {
      return;
    }
    if (w.Notification && w.Notification.permissionLevel) {
      // Safari 6
      permission = w.Notification.permissionLevel();
    } else if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
      // Chrome & Firefox with html5-notifications plugin installed
      permission = PERMISSION[w.webkitNotifications.checkPermission()];
    } else if (w.Notification && w.Notification.permission) {
      // Firefox 23+
      permission = w.Notification.permission;
    } else if (navigator.mozNotification) {
      // Firefox Mobile
      permission = PERMISSION_GRANTED;
    } else if (w.external && (w.external.msIsSiteMode() !== undefined)) { /* keep last */
      // IE9+
      permission = w.external.msIsSiteMode() ? PERMISSION_GRANTED : PERMISSION_DEFAULT;
    }
    return permission;
  };
  _this.requestPermission = function(callback) {
    var callbackFunction = isFunction(callback) ? callback : noop;
    if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
      w.webkitNotifications.requestPermission(callbackFunction);
    } else if (w.Notification && w.Notification.requestPermission) {
      w.Notification.requestPermission(callbackFunction);
    }
  };
  _this.isChrome = function() {
    return /chrom(e|ium)/.test(w.navigator.userAgent.toLowerCase());
  };
  _this.getNotification = function(displayName, iconLink, msg, notificationsound) {
    if (notificationsound) {
      notificationsound.play();
      setTimeout(function() {
        notificationsound.stop();
      }, 1000);
    }
    var notification;
    if (w.Notification) { /* Safari 6, Chrome (23+) */
      var options = {
        icon: iconLink,
        body: msg
      };
      notification = new w.Notification(displayName, options);
      notification.onclick = function() {
        w.focus();
        this.close();
      };
    } else if (w.webkitNotifications) { /* FF with html5Notifications plugin installed */
      notification = w.webkitNotifications.createNotification(iconLink, displayName, msg);
      if (notificationsound) {
        notification.show();
      }
      if (_this.isChrome()) {
        notification.onclick = function() {
          w.focus();
          this.cancel();
        };
      }
      notification.show();
      setTimeout(function() {
        notification.cancel();
      }, 30000);
    } else if (navigator.mozNotification) { /* Firefox Mobile */
      notification = navigator.mozNotification.createNotification(displayName, msg, iconLink);
      notification.show();
    } else if (w.external && w.external.msIsSiteMode()) { /* IE9+ */
      // Clear any previous notifications
      w.external.msSiteModeClearIconOverlay();
      w.external.msSiteModeSetIconOverlay(iconLink, displayName);
      w.external.msSiteModeActivate();
      notification = {
        "ieVerification": ieVerification + 1
      };
    }
    return notification;
  };
  _this.sendDesktopNotification = function(displayName, iconLink, msg, notificationsound) {
    if (_this.permissionLevel() !== PERMISSION_GRANTED) {
      w.Notification.requestPermission();
    }
    if (_this.permissionLevel() === PERMISSION_GRANTED) {
      var notification;
      if (notificationsound) {
        notification = _this.getNotification(displayName, iconLink, msg, notificationsound);
      } else {
        notification = _this.getNotification(displayName, iconLink, msg);
      }
      var notificationWrapper = _this.getWrapper(notification);
      if (notification && !notification.ieVerification && notification.addEventListener) {
        notification.addEventListener("show", function() {
          var notification = notificationWrapper;
          w.setTimeout(function() {
            notification.close();
          }, 30000);
        });
      }
    }
  };
  _this.getWrapper = function(notification) {
    return {
      close: function() {
        if (notification) {
          if (notification.close) {
            // http://code.google.com/p/ff-html5notifications/issues/detail?id=58
            notification.close();
          } else if (notification.cancel) {
            notification.cancel();
          } else if (w.external && w.external.msIsSiteMode()) {
            if (notification.ieVerification === ieVerification) {
              w.external.msSiteModeClearIconOverlay();
            }
          }
        }
      }
    };
  };
}
