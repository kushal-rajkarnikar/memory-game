var mckGroupUtils = new MckGroupUtils;
var mckGroupService = new MckGroupService();

function MckGroupUtils() {
  var _this = this;

  _this.getGroup = function(groupId) {
    if (typeof MCK_GROUP_MAP[groupId] === 'object') {
      return MCK_GROUP_MAP[groupId];
    } else {
      return;
    }
  };
  _this.getGroupByClientGroupId = function(clientGroupId) {
    if (typeof MCK_CLIENT_GROUP_MAP[clientGroupId] === 'object') {
      return MCK_CLIENT_GROUP_MAP[clientGroupId];
    } else {
      return;
    }
  };
  _this.addGroup = function(group) {
    var name = (group.name) ? group.name : group.id;
    var users = [];
    $applozic.each(group.groupUsers, function(i, user) {
      if (user.userId) {
        users[user.userId] = user;
      }
    });
    var removedMembersId = (typeof group.removedMembersId !== 'undefined') ? group.removedMembersId : [];
    var groupFeed = {
      'contactId': group.id.toString(),
      'htmlId': mckContactUtils.formatContactId('' + group.id),
      'displayName': name,
      'value': group.id.toString(),
      'adminName': group.adminId ? group.adminId : group.adminName,
      'type': group.type,
      'members': group.membersId ? group.membersId : group.membersName,
      'imageUrl': group.imageUrl,
      'users': users,
      'userCount': group.userCount,
      'removedMembersId': removedMembersId,
      'clientGroupId': group.clientGroupId,
      'isGroup': true,
      'deletedAtTime': group.deletedAtTime,
      'metadata' : group.metadata,
    };
    MCK_GROUP_MAP[group.id] = groupFeed;
    if (group.clientGroupId) {
      MCK_CLIENT_GROUP_MAP[group.clientGroupId] = groupFeed;
    }
    return groupFeed;
  };
  _this.createGroup = function(groupId) {
    var group = {
            'contactId': groupId.toString(),
            'htmlId': mckContactUtils.formatContactId('' + groupId),
            'displayName': groupId.toString(),
            'value': groupId.toString(),
            'type': 2,
            'adminName': '',
            'imageUrl': '',
            'userCount': '',
            'users': [],
            'removedMembersId': [],
            'clientGroupId': '',
            'isGroup': true,
            'deletedAtTime':''

        };
    MCK_GROUP_MAP[groupId] = group;
    return group;
  };
}


function MckGroupService() {
  var _this = this;
  var IS_MCK_VISITOR;
  var MCK_USER_ID;
  var MCK_OPEN_GROUP_SETTINGS;
  var MCK_LAST_SEEN_AT_MAP = [];
  var MCK_BLOCKED_TO_MAP = [];
  var GROUP_LIST_URL = "/rest/ws/group/list";
  var GROUP_FEED_URL = "/rest/ws/group/info";
  var GROUP_LEAVE_URL = "/rest/ws/group/left";
  var GROUP_UPDATE_INFO_URL = "/rest/ws/group/update";
  var GROUP_ADD_MEMBER_URL = "/rest/ws/group/add/member";
  var GROUP_REMOVE_MEMBER_URL = "/rest/ws/group/remove/member";
  MCK_GROUP_ARRAY = new Array();
  _this.init = function(optns) {
    IS_MCK_VISITOR = optns.visitor;
    MCK_USER_ID = (IS_MCK_VISITOR) ? 'guest' : $applozic.trim(optns.userId);
    MCK_OPEN_GROUP_SETTINGS = optns.openGroupSettings;
  };

  _this.loadGroups = function(params) {
    var response = new Object();
    window.Applozic.ALApiService.loadGroups({
      baseUrl: MCK_BASE_URL,
      success: function(data) {
        if (data.status === 'success') {
          response.status = 'success';
          response.data = data.response;
          if (params.apzCallback) {
            params.apzCallback(response);
          }
        } else {
          response.status = 'error';
        }
        if (params.callback) {
          params.callback(response);
        }
      },
      error: function() {
        console.log('Unable to load groups. Please reload page.');
        response.status = 'error';
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response);
        }
      }
    });
  };
  _this.getGroupFeed = function(params) {
    var group = {};
    if (typeof params.callback === 'function' || typeof params.apzCallback === 'function') {
      var response = new Object();
    } else {
      return;
    }
    if (params.groupId) {
      group.groupId = params.groupId;
    } else if (params.clientGroupId) {
      group.clientGroupId = params.clientGroupId;
    } else {
      if (typeof params.callback === 'function') {
        response.status = "error";
        response.errorMessage = "GroupId or Client GroupId Required";
        params.callback(response);
      }
      return;
    }
    if (params.conversationId) {
      group.conversationId = params.conversationId;
    }

    Applozic.ALApiService.getGroupInfo({
      data: group,
      success: function(response) {
        if (response.status === "success") {
          var groupFeed = response.response;
          if (groupFeed + '' === "null" || typeof groupFeed !== "object") {
            response.status = "error";
            response.errorMessage = "GroupId not found";
          } else {
            var group = mckGroupUtils.addGroup(groupFeed);
            response.status = "success";
            response.data = group;
          }
        } else if (data.status === "error") {
          response.status = "error";
          response.errorMessage = data.errorResponse[0].description;
        }
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          if (response.status === "success") {
            response.data = groupFeed;
          }
          params.apzCallback(response, params);
        }
      },
      error: function() {
        console.log('Unable to load group. Please reload page.');
        response.status = "error";
        response.errorMessage = 'Please reload page.';
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response, params);
        }
      }
    });
  };
  _this.leaveGroup = function(params) {
    var group = {};
    var response = new Object();
    if (params.groupId) {
      group.groupId = params.groupId;
    } else if (params.clientGroupId) {
      group.clientGroupId = params.clientGroupId;
    } else {
      response.status = "error";
      response.errorMessage = "GroupId or Client GroupId Required";
      if (params.callback) {
        params.callback(response);
      }
      return;
    }
    Applozic.ALApiService.groupLeave({
      data: group,
      success: function(data) {
        if (data.status === "success") {
          if (params.clientGroupId) {
            var groupInfo = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
            if (typeof groupInfo === 'object') {
              params.groupInfo = groupInfo.contactId;
            }
          }
          response.status = "success";
          response.data = {
            groupId: params.groupId
          };
        } else {
          response.status = "error";
          response.errorMessage = data.errorResponse[0].description;
        }
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response, {
            groupId: params.groupId
          });
        }
      },
      error: function() {
        console.log('Unable to process your request. Please reload page.');
        response.status = "error";
        response.errorMessage = "";
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response);
        }
      }
    });
  };
  _this.removeGroupMemberFromChat = function(params) {
    var group = {};
    var response = new Object();
    if (params.groupId) {
      group.groupId = params.groupId;
    } else if (params.clientGroupId) {
      group.clientGroupId = params.clientGroupId;
    } else {
      response.status = 'error';
      response.errorMessage = "GroupId or Client GroupId Required";
      if (typeof params.callback === 'function') {
        params.callback(response);
      }
      return;
    }
    group.userId = params.userId;
    Applozic.ALApiService.removeGroupMember({
      data:group,
      success: function(response) {
        if (response.status === 'success') {
          if (params.clientGroupId) {
            var group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
            if (typeof group === 'object') {
              params.groupId = group.contactId;
            }
          }
          response.status = "success";
          // response.data = data.response;
        } else {
          response.status = "error";
          response.errorMessage = data.errorResponse[0].description;
        }
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response, params);
        }
      },
      error: function() {
        console.log('Unable to process your request. Please reload page.');
        response.status = 'error';
        response.errorMessage = '';
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response);
        }
        params.apzCallback(response);
      }
    });
  };

  _this.addGroupMember = function(params) {
    var group = {};
    var response = new Object();
    if (params.groupId) {
      group.groupId = params.groupId;
    } else if (params.clientGroupId) {
      group.clientGroupId = params.clientGroupId;
    } else {
      if (typeof params.callback === 'function') {
        params.callback(response);
      }
      return;
    }
    group.userId = params.userId;
    if (typeof params.role !== 'undefined') {
      group.role = params.role;
    }
    Applozic.ALApiService.addGroupMember({
      data: {
        group: group
      },
      success: function(data) {
        if (data.status === "success") {
          if (params.clientGroupId) {
            var group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
            if (typeof group === 'object') {
              params.groupId = group.contactId;
            }
          }
          response.status = 'success';
          response.data = data.response;
        } else {
          response.status = 'error';
          response.errorMessage = data.errorResponse[0].description;
        }
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response, params)
        }
      },
      error: function() {
        console.log('Unable to process your request. Please reload page.');
        response.status = "error";
        response.errorMessage = '';
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response);
        }
      }
    });
  };
  _this.updateGroupInfo = function(params) {
    var group = {};
    var response = new Object();
    if (params.groupId) {
      group.groupId = params.groupId;
    } else if (params.clientGroupId) {
      group.clientGroupId = params.clientGroupId;
    } else {
      if (typeof params.callback === 'function') {
        response.status = 'error';
        response.errorMessage = 'GroupId or Client GroupId Required';
        params.callback(response);
      }
      return;
    }
    if (params.name) {
      group.newName = params.name;
    }
    if (params.imageUrl) {
      group.imageUrl = params.imageUrl;
    }
    if (params.users && params.users.length > 0) {
      group.users = params.users;
    }
    Applozic.ALApiService.groupUpdate({
      data: group,
      success: function(data, group) {
        if (data.status === "success") {
          if (params.clientGroupId) {
            var group = mckGroupLayout.getGroupByClientGroupId(params.clientGroupId);
            if (typeof group === 'object') {
              params.groupId = group.contactId;
            }
          }
          response.status = "success";
          response.data = data.response;
        } else {
          response.status = "error";
          response.errorMessage = data.errorResponse[0].description;
        }
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response, {
            groupId: params.groupId,
            groupInfo: group
          })
        }
      },
      error: function() {
        console.log('Unable to process your request. Please reload page.');
        response.status = "error";
        response.errorMessage = "Unable to process your request. Please reload page.";
        if (params.callback) {
          params.callback(response);
        }
        if (params.apzCallback) {
          params.apzCallback(response);
        }
      }
    });
  };
  _this.sendGroupMessage = function(params) {
    if (typeof params === 'object') {
      params = $applozic.extend(true, {}, message_default_options, params);
      var message = params.message;
      if (!params.groupId && !params.clientGroupId) {
        return 'groupId or clientGroupId required';
      }
      if (typeof message === 'undefined' || message === '') {
        return 'message field required';
      }
      if (params.type > 12) {
        return 'invalid message type';
      }
      message = $applozic.trim(message);
      var messagePxy = {
        'type': params.messageType,
        'contentType': params.type,
        'message': message
      };
      if (params.groupId) {
        messagePxy.groupId = $applozic.trim(params.groupId);
      } else if (params.clientGroupId) {
        var group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
        if (typeof group === 'undefined') {
          return 'group not found';
        }
        messagePxy.clientGroupId = $applozic.trim(params.clientGroupId);
      }
      mckMessageService.sendMessage(messagePxy);
      return 'success';
    } else {
      return 'Unsupported format. Please check format';
    }
  };

  //function MckMessageLayout
  _this.getContactFromGroupOfTwo = function(group, callback) {
    var user;
    for (var i = 0; i < group.members.length; i++) {
      user = '' + group.members[i];
      if (MCK_USER_ID === user) {
        continue;
      }

      if (typeof callback === "function") {
        callback(user);
      }
      return user;
       //return _this.fetchContact('' + group.members[i]);
    }
  };
  _this.addGroupFromMessage = function(message, update, callback) {
    var groupId = message.groupId;
    var group = mckGroupUtils.getGroup('' + groupId);
    if (typeof group === 'undefined') {
      group = mckGroupUtils.createGroup(groupId);
      mckGroupService.loadGroups({
        apzCallback: mckGroupLayout.loadGroups
      });
    }
    if (typeof callback === "function") {
      callback(group, message, update);
    }
  };
  _this.isGroupDeleted = function(tabId, isGroup) {
    if (isGroup) {
      var deletedAtTime = mckGroupLayout.getDeletedAtTime(tabId);
      return (typeof deletedAtTime !== 'undefined' && deletedAtTime > 0);
    }
    return false;
  };

  //function mckGroupLayout

  _this.loadGroupsCallback = function(response) {
    var groups = response.data;
    MCK_GROUP_ARRAY.length = 0;
    $applozic.each(groups, function(i, group) {
      if ((typeof group.id !== 'undefined')) {
        var group = mckGroupUtils.addGroup(group);
        MCK_GROUP_ARRAY.push(group);
      }
    });
  };
  _this.getGroupDisplayName = function(groupId) {
    if (typeof MCK_GROUP_MAP[groupId] === 'object') {
      var group = MCK_GROUP_MAP[groupId];
      var displayName = group['displayName'];
      /* if (typeof group !== 'undefined' && group.type === 10) {
           var userIdArray = [];

           if (group.members.length > 0) {
               for (var i = 0; i < group.members.length; i++) {
                   userIdArray.push(group.members[i]);
               }
           }
           if (group.users[MCK_USER_ID].role === 0 || group.users[MCK_USER_ID].role === 3) {
               displayName = "Kommunicate";
           } else {
               var contact;
               for (var i = 0; i < userIdArray.length; i++) {
                   var userId = userIdArray[i];
                   if (group.users[userId].role === 3) {
                       contact = userId;
                   }
               }
               displayName = mckMessageLayout.getTabDisplayName(contact, false);
           }
       }*/
       var userIdList =[];
      if (group.type === 7) {
        var contact = _this.getContactFromGroupOfTwo(group);
        if (typeof contact !== 'undefined') {
          if(!alUserService.MCK_USER_DETAIL_MAP[contact]){
            userIdList.push(contact);
             window.Applozic.ALApiService.getUserDetail({data:userIdList,
               success: function(data) {
               if (data.response.length > 0) {
                   $applozic.each(data.response, function(i, userDetail) {
                     alUserService.MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
                     if(alUserService.MCK_USER_DETAIL_MAP[contact] && alUserService.MCK_USER_DETAIL_MAP[contact].displayName){
                     displayName = alUserService.MCK_USER_DETAIL_MAP[contact].displayName;
                   }
                   });
               }
             }
           })
         }else{
           if(alUserService.MCK_USER_DETAIL_MAP[contact] && alUserService.MCK_USER_DETAIL_MAP[contact].displayName){
               displayName = alUserService.MCK_USER_DETAIL_MAP[contact].displayName;
            }
         }
  }
    }
      if (group.type === 3) {
        if (displayName.indexOf(MCK_USER_ID) !== -1) {
          displayName = displayName.replace(MCK_USER_ID, '').replace(":", '');
          if (typeof(MCK_GETUSERNAME) === "function") {
            var name = (MCK_GETUSERNAME(displayName));
            displayName = (name) ? name : displayName;
          }
        }
      }
      if (!displayName && group.type === 5) {
        displayName = 'Broadcast';
      }
      if (!displayName) {
        displayName = group.contactId;
      }
      return displayName;
    } else {
      return groupId;
    }
  };
  _this.getGroupImage = function(imageSrc) {
    return (imageSrc) ? '<img src="' + imageSrc + '"/>' : '<img src="' + MCK_BASE_URL + '/resources/sidebox/css/app/images/mck-icon-group.png"/>';
  };
  _this.getGroupDefaultIcon = function() {
    return '<div class="mck-group-icon-default"></div>';
  };
  _this.addMemberToGroup = function(group, userId) {
    if (typeof group.members === 'object') {
      if (group.members.indexOf(userId) === -1) {
        group.members.push(userId);
      }
      if (typeof group.removedMembersId === 'object' && (group.removedMembersId.indexOf(userId) !== -1)) {
        group.removedMembersId.splice(group.removedMembersId.indexOf(userId), 1);
      }
      MCK_GROUP_MAP[group.contactId] = group;
    }
    return group;
  };
  _this.removeMemberFromGroup = function(group, userId) {
    if (typeof group.removedMembersId !== 'object' || group.removedMembersId.length < 1) {
      group.removedMembersId = [];
      group.removedMembersId.push(userId);
    } else if (group.removedMembersId.indexOf(userId) === -1) {
      group.removedMembersId.push(userId);
    }
    MCK_GROUP_MAP[group.contactId] = group;
    return group;
  };
  _this.authenticateGroupUser = function(group) {
    var isGroupLeft = mckGroupService.isGroupLeft(group);
    var isGroupMemeber = false;
    if (!isGroupLeft && group.members.length > 0) {
      for (var i = 0; i < group.members.length; i++) {
        if (MCK_USER_ID === '' + group.members[i]) {
          isGroupMemeber = true;
          return true;
        }
      }
    }
    return isGroupMemeber;
  };
  _this.isAppendOpenGroupContextMenu = function(group) {
    if (MCK_OPEN_GROUP_SETTINGS.deleteChatAccess === 0) {
      return false;
    }
    var isGroupMember = mckGroupService.authenticateGroupUser(group);
    if (!isGroupMember) {
      return false;
    }
    if (group.adminName === MCK_USER_ID) {
      return true;
    }

    if (MCK_OPEN_GROUP_SETTINGS.deleteChatAccess === 2) {
      return true;
    }
    return false;
  }
  _this.isGroupLeft = function(group) {
    var isGroupLeft = false;
    if (group.removedMembersId && group.removedMembersId.length > 0) {
      $applozic.each(group.removedMembersId, function(i, removedMemberId) {
        if (removedMemberId === MCK_USER_ID) {
          isGroupLeft = true;
        }
      });
    }
    return isGroupLeft;
  };


}
