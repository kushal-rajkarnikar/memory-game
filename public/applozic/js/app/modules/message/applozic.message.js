var alMessageService = new AlMessageService();

function AlMessageService() {
  var _this = this;
  var IS_MCK_VISITOR;
  var MCK_USER_ID;
  var MCK_FILE_URL;
  var TOPIC_ID_URL = "/rest/ws/conversation/topicId";
  var CONVERSATION_ID_URL = "/rest/ws/conversation/id";
  var CONVERSATION_FETCH_URL = "/rest/ws/conversation/get";
  var MESSAGE_ADD_INBOX_URL = "/rest/ws/message/add/inbox";
  var CONVERSATION_CLOSE_UPDATE_URL = "/rest/ws/conversation/close";
  var CONVERSATION_DELETE_URL = "/rest/ws/message/delete/conversation";
  var CONVERSATION_READ_UPDATE_URL = "/rest/ws/message/read/conversation";
  var offlineblk = '<div id="mck-ofl-blk" class="mck-m-b"><div class="mck-clear"><div class="blk-lg-12 mck-text-light mck-text-muted mck-test-center">${userIdExpr} is offline now</div></div></div>';
  var refreshIntervalId;

  _this.init = function(optns) {
    MCK_FILE_URL = optns.fileBaseUrl;
    IS_MCK_VISITOR = optns.visitor;
    MCK_USER_ID = (IS_MCK_VISITOR) ? 'guest' : $applozic.trim(optns.userId);
  };

  _this.addMessageToTab = function(messagePxy, contact, callback) {
    var message = {
      'to': messagePxy.to,
      'groupId': messagePxy.groupId,
      'deviceKey': messagePxy.deviceKey,
      'contentType': messagePxy.contentType,
      'message': messagePxy.message,
      'conversationId': messagePxy.conversationId,
      'topicId': messagePxy.topicId,
      'sendToDevice': true,
      'createdAtTime': new Date().getTime(),
      'key': messagePxy.key,
      'storeOnDevice': true,
      'sent': false,
      'read': true,
      'metadata': (messagePxy.metadata) ? messagePxy.metadata : ''
    };
    message.type = (messagePxy.type) ? messagePxy.type : 5;
    if (messagePxy.fileMeta) {
      message.fileMeta = messagePxy.fileMeta;
    }
    if (typeof callback === "function") {
      callback(message, contact);
    }
  };

  _this.getMessages = function(params) {
    var data = {};
    if (params.startTime) {
      data.endTime = params.startTime;
    }
    if (typeof params.userId !== 'undefined' && params.userId !== '') {
      if (params.isGroup) {
        data.groupId = params.userId;
      } else {
        data.userId = params.userId;
      }
      data.pageSize = 30;
      if ((IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX) && params.conversationId) {
        data.conversationId = params.conversationId;
        if (typeof MCK_TAB_CONVERSATION_MAP[params.userId] === 'undefined') {
          data.conversationReq = true;
        }
      }
    } else {
      data.mainPageSize = 100;
    }
    window.Applozic.ALApiService.getMessages({
      data: data,
      success: params.callback,
      error: params.callback
    });
  };
  _this.getMessageList = function(params, callback) {
    var tabId = params.id;
    var data = {};
    var resp = {};

    if (params.startTime) {
      data.endTime = params.startTime;
    }

    if (typeof params.clientGroupId !== "undefined" && params.clientGroupId !== '') {
      if (params.pageSize) {
        data.pageSize = params.pageSize;
      } else {
        data.pageSize = 50;
      }
      data.clientGroupId = params.clientGroupId;
      resp = {
        'clientGroupId': params.clientGroupId
      };
    } else if (typeof tabId !== "undefined" && tabId !== '') {
      if (params.pageSize) {
        data.pageSize = params.pageSize;
      } else {
        data.pageSize = 50;
      }
      if ('' + params.isGroup === 'true') {
        data.groupId = tabId;
      } else {
        data.userId = tabId;
      }
      resp = {
        'id': tabId
      };
    } else {
      if (params.mainPageSize) {
        data.mainPageSize = params.pageSize;
      } else {
        data.mainPageSize = 50;
      }
      resp = {
        'id': ''
      };
    }
    if (params.topicId && (tabId || params.clientGroupId)) {
      if (params.conversationId) {
        data.conversationId = params.conversationId;
      }
      if (params.topicId) {
        resp['topicId'] = params.topicId;
      }
    }
    window.Applozic.ALApiService.getMessages({
      data: data,
      success: function(response) {
        var data = response.data;
        resp.status = "success";
        if (typeof data.message === "undefined" || data.message.length === 0) {
          resp.messages = [];
        } else {
          var messages = data.message;
           var messageFeeds = new Array();
          $applozic.each(messages, function(i, message) {
            if (typeof callback === "function") {
              callback(message);
            }
          });
          resp.messages = messageFeeds;
        }
        if (data.groupFeeds.length > 0) {
          resp.id = data.groupFeeds[0].id;
        }
        params.callback(data);
      },
      error: function(error) {
        resp.status = "error";
        params.callback(resp);
      }
    });
  };
  _this.getReplyMessageByKey = function(msgkey) {
    var replyMsg = ALStorage.getMessageByKey(msgkey);
    if (typeof replyMsg === "undefined") {
      window.Applozic.ALApiService.updateReplyMessage({
        data: {
          key: msgkey
        },
        async: false,
        success: function(data) {
          ALStorage.updateMckMessageArray(data);
        }
      });
    }
    return ALStorage.getMessageByKey(msgkey);
  };

  _this.sendDeliveryUpdate = function(message) {
    window.Applozic.ALApiService.sendDeliveryUpdate({
      data: {
        key: message.pairedMessageKey
      },
      success: function() {},
      error: function() {}
    });
  };
  _this.sendReadUpdate = function(key) {
    if (typeof key !== "undefined" && key !== '') {
      window.Applozic.ALApiService.sendReadUpdate({
        data: {
          key: key
        },
        success: function() {},
        error: function() {}
      });
    }
  };

  _this.fetchConversationByTopicId = function(data, callback) {
    window.Applozic.ALApiService.fetchConversationByTopicId({
      data:data,
      success: function(data) {
        if (typeof data === 'object' && data.status === "success") {
          var conversationList = data.response;
          if (conversationList.length > 0) {
            $applozic.each(conversationList, function(i, conversationPxy) {
              MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
              MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [conversationPxy.id];
              if (conversationPxy.topicDetail) {
                try {
                  MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
                } catch (ex) {
                  w.console.log('Incorect Topic Detail!');
                }
              }
              if (params.tabId && typeof MCK_TAB_CONVERSATION_MAP[params.tabId] !== 'undefined') {
                var tabConvArray = MCK_TAB_CONVERSATION_MAP[params.tabId];
                tabConvArray.push(conversationPxy);
                MCK_TAB_CONVERSATION_MAP[params.tabId] = tabConvArray;
              }
            })
          }
          if (params.isExtMessageList) {
            if (conversationList.length > 0) {
              params.conversationId = conversationList[0].id;
              params.pageSize = 50;
              if (typeof callback === "function") {
                callback(params);
              }
            } else {
              if (typeof params.callback === 'function') {
                var resp = {};
                if (params.tabId) {
                  resp.id = params.tabId;
                  resp.isGroup = params.isGroup;
                } else if (params.clientGroupId) {
                  resp.clientGroupId = params.clientGroupId;
                }
                resp.topicId = params.topicId;
                resp.status = "success";
                resp.messages = [];
                params.callback(resp);
              }
            }
          }
        } else {
          if (params.isExtMessageList && typeof params.callback === 'function') {
            var resp = {};
            if (params.tabId) {
              resp.id = params.tabId;
            } else if (params.clientGroupId) {
              resp.clientGroupId = params.clientGroupId;
            }
            resp.topicId = params.topicId;
            resp.status = "error";
            resp.errorMessage = 'Unable to process request. Please try again.';
            params.callback(resp);
          }
        }
      },
      error: function() {
        if (typeof params.callback === 'function') {
          var resp = {};
          if (params.tabId) {
            resp.id = params.tabId;
          } else if (params.clientGroupId) {
            resp.clientGroupId = params.clientGroupId;
          }
          resp.topicId = params.topicId;
          resp.status = "error";
          resp.errorMessage = 'Unable to process request. Please try again.';
          params.callback(resp);
        }
      }
    });
  };
  _this.getTopicId = function(params, callback) {
    if (params.conversationId) {
      var data = "id=" + params.conversationId;
      window.Applozic.ALApiService.getTopicId({
        data: {
          "conversationId": params.conversationId
        },
        success: function(result) {
          if (typeof data === 'object' && data.status === 'success') {
            var conversationPxy = data.response;
            if (typeof conversationPxy === 'object') {
              MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [params.conversationId];
              MCK_CONVERSATION_MAP[params.conversationId] = conversationPxy;
              if (conversationPxy.topicDetail) {
                try {
                  MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
                } catch (ex) {
                  w.console.log('Incorect Topic Detail!');
                }
              }
              if (typeof(MCK_PRICE_DETAIL) === 'function' && params.priceText) {
                MCK_PRICE_DETAIL({
                  'custId': MCK_USER_ID,
                  'suppId': params.suppId,
                  'productId': conversationPxy.topicId,
                  'price': params.priceText
                });
                _this.sendConversationCloseUpdate(params.conversationId);
              }
              if (params.messageType && typeof params.message === 'object') {
                var tabId = (params.message.groupId) ? params.message.groupId : params.message.to;
                if (typeof MCK_TAB_CONVERSATION_MAP[tabId] !== 'undefined') {
                  var tabConvArray = MCK_TAB_CONVERSATION_MAP[tabId];
                  tabConvArray.push(conversationPxy);
                  MCK_TAB_CONVERSATION_MAP[tabId] = tabConvArray;
                }
                if (typeof params.populate !== 'undefined' ? params.populate : true) {
                  if (typeof callback === "function") {
                    callback(params);
                  }
                }
              }

              if (typeof params.callback === 'function') {
                params.callback(conversationPxy);
              }
            }
          }
        },
        error: function() {}
      });
    }
  };
  _this.sendConversationCloseUpdate = function(conversationId) {
    if (conversationId) {
      var data = "id=" + conversationId;
      window.Applozic.ALApiService.sendConversationCloseUpdate({
        conversationId: conversationId,
        success: function(result) {},
        error: function() {}
      });
    }
  };

  _this.dispatchMessage = function(params) {
    if (params.messagePxy === 'object') {
      var messagePxy = params.messagePxy;
      if (params.topicId) {
        var topicDetail = MCK_TOPIC_DETAIL_MAP[params.topicId];
        if (typeof topicDetail === 'object' && topicDetail.title !== 'undefined') {
          if (!messagePxy.message) {
            messagePxy.message = $applozic.trim(topicDetail.title);
          }
          if (params.conversationId) {
            messagePxy.conversationId = params.conversationId;
          } else if (params.topicId) {
            var conversationPxy = {
              'topicId': params.topicId
            };
            if (typeof topicDetail === "object") {
              conversationPxy.topicDetail = w.JSON.stringify(topicDetail);
            }
            messagePxy.conversationPxy = conversationPxy;
          }
        }
        if (!messagePxy.message && topicDetail.link) {
          var fileMeta = {
            "blobKey": $applozic.trim(topicDetail.link),
            "contentType": "image/png"
          };
          messagePxy.fileMeta = fileMeta;
          messagePxy.contentType = 5;
          FILE_META = [];
          FILE_META.push(fileMeta);
        }
      }
      if (params.isGroup) {
        messagePxy.groupId = params.tabId;
      } else {
        messagePxy.to = params.tabId;
      }
      mckMessageService.sendMessage(messagePxy);
    }
  };

  _this.sendVideoCallMessage = function(callId, msgType, contentType, audioOnly, toUser, callback) {
    var message = (msgType == "CALL_MISSED") ? "Missed Call" : (msgType == "CALL_REJECTED") ? "Call Rejected" : "";
    if (message == "" || message == undefined) {
      message = "video message";
    }
    var metadata = {
      "MSG_TYPE": msgType,
      "CALL_ID": callId,
      "CALL_AUDIO_ONLY": audioOnly
    }
    var messagePxy = {
      "to": toUser,
      "type": 5,
      "contentType": contentType,
      "message": message,
      "metadata": metadata,
      "senderName": MCK_USER_ID
    };
    callback(messagePxy);
    return messagePxy;
  };
  _this.sendVideoCallEndMessage = function(callId, msgType, contentType, audioOnly, callDuration, toUser, callback) {

    var callDurationStr = "";
    if (callDuration) {
      callDurationStr = mckDateUtils.convertMilisIntoTime(callDuration);
    }
    var message = (msgType == "CALL_MISSED") ? "Missed Call" : (msgType == "CALL_REJECTED") ? "Call Rejected" : (msgType == "CALL_END") ? "Call End \n Duration: " + callDurationStr : "video message";
    if (message == "" || message == undefined) {
      message = "video message";
    }

    var metadata = {
      "MSG_TYPE": msgType,
      "CALL_ID": callId,
      "CALL_AUDIO_ONLY": audioOnly,
      "CALL_DURATION": callDuration
    }
    var messagePxy = {
      "to": toUser,
      "type": 5,
      "contentType": contentType,
      "message": message,
      "metadata": metadata
    };
    callback(messagePxy);
    return messagePxy;
  };

  _this.getMessageFeed = function(message) {
    var messageFeed = {};
    MCK_FILE_URL = window.Applozic.ALApiService.getFileUrl();
    messageFeed.key = message.key;
    messageFeed.contentType = message.contentType;
    messageFeed.timeStamp = message.createdAtTime;
    messageFeed.message = message.message;
    messageFeed.from = (message.type === 4) ? message.to : MCK_USER_ID;
    if (message.groupId) {
      messageFeed.to = message.groupId;
    } else {
      messageFeed.to = (message.type === 5) ? message.to : MCK_USER_ID;
    }
    messageFeed.status = "read";
    messageFeed.type = (message.type === 4) ? 'inbox' : 'outbox';
    if (message.type === 5) {
      if (message.status === 3) {
        messageFeed.status = "sent";
      } else if (message.status === 4) {
        messageFeed.status = "delivered";
      }
    }
    if (typeof message.fileMeta === 'object') {
      var file = Object.assign({}, message.fileMeta);
      if (typeof file.url === 'undefined' || file.url === '') {
        file.url = MCK_FILE_URL + '/rest/ws/aws/file/' + message.fileMeta.blobKey;
      }
      delete file.blobKey;
      messageFeed.file = file;
    }
    messageFeed.source = message.source;
    messageFeed.metadata = message.metadata;
    return messageFeed;
  };

}
