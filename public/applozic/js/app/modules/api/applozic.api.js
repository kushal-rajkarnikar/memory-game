(function (window) {
    'use strict';
    function define_ALApiService(getBaseUrl) {
        var ALApiService = {};
        var MCK_APP_ID = "";
        var mckUtils = new MckUtils();
        var MCK_BASE_URL = 'https://apps.applozic.com';
        var MCK_FILE_URL = 'https://applozic.appspot.com'
        var CUSTOM_FILE_UPLOAD_URL = '/files/upload/';
        var MCK_CUSTOM_URL = "https://googleupload.applozic.com";
        var INITIALIZE_APP_URL = "/v2/tab/initialize.page";
        var MESSAGE_LIST_URL = "/rest/ws/message/list";
        var MESSAGE_SEND_URL = "/rest/ws/message/send";
        var GROUP_CREATE_URL = "/rest/ws/group/create";
        var GROUP_LIST_URL = "/rest/ws/group/list";
        var GROUP_INFO_URL = "/rest/ws/group/v2/info";
        var GROUP_ADD_MEMBER_URL = "/rest/ws/group/add/member";
        var GROUP_REMOVE_MEMBER_URL = "/rest/ws/group/remove/member";
        var GROUP_LEFT_URL = "/rest/ws/group/left";
        var GROUP_UPDATE_URL = "/rest/ws/group/update";
        var GROUP_IS_USER_PRESENT_URL = "/rest/ws/group/check/user";
        var GROUP_USER_COUNT_URL = "/rest/ws/group/user/count";
        var FRIEND_LIST_URL = "/rest/ws/group/";
        var GET_USER_DETAIL_URL = "/rest/ws/user/v2/detail";
        var UPDATE_USER_DETAIL_URL = "/rest/ws/user/update";
        var USER_FILTER = "/rest/ws/user/filter";
        var LOGOUT = "/rest/ws/device/logout";
        var USER_FILTER_BY_ROLE = "/rest/ws/user/v3/filter";
        var USER_BLOCK_URL = "/rest/ws/user/block";
        var USER_UNBLOCK_URL = "/rest/ws/user/unblock";
        var UPDATE_PASSWORD_URL = "/rest/ws/user/update/password";
        var UPDATE_REPLY_MAP = "/rest/ws/message/detail";
        var MESSAGE_DELETE_URL = "/rest/ws/message/delete";
        var MESSAGE_READ_UPDATE_URL = "/rest/ws/message/read";
        var MESSAGE_DELIVERY_UPDATE_URL = "/rest/ws/message/delivered";
        var CONVERSATION_CLOSE_UPDATE_URL = "/rest/ws/conversation/close";
        var FILE_PREVIEW_URL = "/rest/ws/aws/file";
        var FILE_UPLOAD_URL = "/rest/ws/aws/file/url";
        var FILE_AWS_UPLOAD_URL = "/rest/ws/upload/file";
        var FILE_DELETE_URL = "/rest/ws/aws/file/delete";
        var MESSAGE_ADD_INBOX_URL = "/rest/ws/message/add/inbox";
        var CONVERSATION_READ_UPDATE_URL = "/rest/ws/message/read/conversation";
        var CONVERSATION_DELETE_URL = "/rest/ws/message/delete/conversation";
        var ONE_TO_ONE_MUTE_URL = "/rest/ws/user/chat/mute";
        var GROUP_MUTE_URL = "/rest/ws/group/user/update";
        var REGISTER_CLIENT_URL = "/rest/ws/register/client";
        var SYNC_MUTE_USER_URL = "/rest/ws/user/chat/mute/list";
        var TOPIC_ID_URL = "/rest/ws/conversation/topicId";
        var CONTACT_NAME_URL = "/rest/ws/user/info";
        var USER_STATUS_URL = "/rest/ws/user/chat/status";
        var CONVERSATION_FETCH_URL = "/rest/ws/conversation/get";
        var CONVERSATION_ID_URL = "/rest/ws/conversation/id";
        var FILE_AWS_UPLOAD_URL = "/rest/ws/upload/file";
        var ATTACHMENT_UPLOAD_URL = "/rest/ws/upload/image";
        var PUSH_NOTIFICATION_LOGOUT = "/rest/ws/device/logout";
        var MCK_SW_REGISTER_URL = "/rest/ws/plugin/update/sw/id";
        var ACCESS_TOKEN;
        var DEVICE_KEY;
        var APP_MODULE_NAME;
        var AUTH_CODE;
        var MCK_CUSTOM_UPLOAD_SETTINGS;

        function getAsUriParameters(data) {
            var url = '';
            for (var prop in data) {
                url += encodeURIComponent(prop) + '=' +
                    encodeURIComponent(data[prop]) + '&';
            }
            return url.substring(0, url.length - 1)
        }
        ALApiService.getFileUrl = function(){
          return MCK_FILE_URL;
        }
        ALApiService.initServerUrl = function (serverUrl) {
            MCK_BASE_URL = serverUrl;
        }


        /**
         * Login user to the chat session, must be done once in a session.
         * Usage Example:
         * Applozic.ALApiService.login({data: {alUser: {userId: 'debug4', password: 'debug4', appVersionCode: 108, applicationId: 'applozic-sample-app'}}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.login = function (options) {
            MCK_APP_ID = options.data.alUser.applicationId;
            MCK_BASE_URL = options.data.baseUrl ? options.data.baseUrl : "https://apps.applozic.com";
            MCK_CUSTOM_UPLOAD_SETTINGS = options.data.alUser.fileupload;
            ALApiService.ajax({
                url: MCK_BASE_URL + INITIALIZE_APP_URL,
                skipEncryption: true,
                type: 'post',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                data: JSON.stringify(options.data.alUser),
                contentType: 'application/json',
                headers: {
                    'Application-Key': MCK_APP_ID
                },
                success: function (response) {
                    mckUtils.setEncryptionKey(response.encryptionKey);
                    AUTH_CODE = btoa(response.userId + ':' + response.deviceKey);
                    DEVICE_KEY = response.deviceKey;
                    ACCESS_TOKEN = options.data.alUser.password;
                    APP_MODULE_NAME = options.data.alUser.appModuleName;
                    ALApiService.setAjaxHeaders(AUTH_CODE, MCK_APP_ID, response.deviceKey, options.data.alUser.password, options.data.alUser.appModuleName);

                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        ALApiService.getAttachmentHeaders = function () {
            var headers = {
                'UserId-Enabled': true,
                'Authorization': "Basic " + AUTH_CODE,
                'Application-Key': MCK_APP_ID,
                'Device-Key': DEVICE_KEY
            };
            if (ACCESS_TOKEN) {
                headers['Access-Token'] = ACCESS_TOKEN;
            }
            return headers;
        },
            ALApiService.setAjaxHeaders = function (authcode, appId, devKey, accToken, modName) {
                MCK_APP_ID = appId;
                AUTH_CODE = authcode;
                DEVICE_KEY = devKey;
                ACCESS_TOKEN = accToken;
                APP_MODULE_NAME = modName;
            }
        ALApiService.ajax = function (options) {

            function extend() {
                for (var i = 1; i < arguments.length; i++)
                    for (var key in arguments[i])
                        if (arguments[i].hasOwnProperty(key))
                            arguments[0][key] = arguments[i][key];
                return arguments[0];
            }

            var reqOptions = extend({}, {}, options);
            if (!(options.skipEncryption === true) && mckUtils.getEncryptionKey()) {
                var key = aesjs.util.convertStringToBytes(mckUtils.getEncryptionKey());
                var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                if (reqOptions.type.toLowerCase() === 'post') {
                    // encrypt Data
                    while (options.data && options.data.length % 16 != 0) {
                        options.data += ' ';
                    }
                    var aesCtr = new aesjs.ModeOfOperation.ecb(key);
                    var bytes = aesjs.util.convertStringToBytes(options.data);
                    var encryptedBytes = aesCtr.encrypt(bytes);
                    var encryptedStr = String.fromCharCode.apply(null, encryptedBytes);
                    reqOptions.data = btoa(encryptedStr);
                }

                reqOptions.success = function (data) {
                    // Decrypt response
                    var decodedData = atob(data);
                    var arr = [];
                    for (var i = 0; i < decodedData.length; i++) {
                        arr.push(decodedData.charCodeAt(i));
                    }
                    var aesCtr = new aesjs.ModeOfOperation.ecb(key);
                    var decryptedBytes = aesCtr.decrypt(arr);
                    var res = aesjs.util.convertBytesToString(decryptedBytes);
                    res = res.replace(/\\u0000/g, '').replace(/^\s*|\s*[\x00-\x10]*$/g, '');
                    if (mckUtils.isJsonString(res)) {
                        options.success(JSON.parse(res));
                    } else {
                        options.success(res);
                    }
                }
          }
            var request = new XMLHttpRequest();
            var responsedata;
            var asyn = true;
            var cttype;
            if (typeof reqOptions.async !== 'undefined' || options.async) {
                asyn = reqOptions.async;
            }

            var typ = reqOptions.type.toUpperCase();

            if (typ === 'GET' && typeof reqOptions.data !== "undefined") {
                reqOptions.url = reqOptions.url + "?" + reqOptions.data;
            }

            request.open(typ, reqOptions.url, asyn);
            if (typ === 'POST' || typ === 'GET') {
                if (typeof reqOptions.contentType === 'undefined') {
                    cttype = 'application/x-www-form-urlencoded; charset=UTF-8';
                } else {
                    cttype = reqOptions.contentType;
                }
                request.setRequestHeader('Content-Type', cttype);
            }


            //authorizationrequestheaders
            MCK_BASE_URL = MCK_BASE_URL ? MCK_BASE_URL : "https://apps.applozic.com";
            if (reqOptions.url.indexOf(MCK_BASE_URL) !== -1) {
                request.setRequestHeader("UserId-Enabled", true);

                if (AUTH_CODE) {
                    request.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
                }
                request.setRequestHeader("Application-Key", MCK_APP_ID);
                if (DEVICE_KEY) {
                    request.setRequestHeader("Device-Key", DEVICE_KEY);
                }
                if (ACCESS_TOKEN) {
                    request.setRequestHeader("Access-Token", ACCESS_TOKEN);
                }
                if (APP_MODULE_NAME) {
                    request.setRequestHeader("App-Module-Name", APP_MODULE_NAME);
                }
            }
            if (typeof reqOptions.data === 'undefined') {
                request.send();
            } else {
                request.send(reqOptions.data);
            }

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        //success
                        var contType = request.getResponseHeader("Content-Type");
                        if (typeof contType === "undefined" || contType === "null" || contType === null) {
                            contType = "";
                        }

                        if (contType.toLowerCase().indexOf("text/html") != -1) {
                            responsedata = request.responseXML;
                        } else if (contType.toLowerCase().indexOf("application/json") != -1) {
                            responsedata = JSON.parse(request.responseText);
                        } else {
                            responsedata = request.responseText;
                        }
                        reqOptions.success(responsedata);
                    } else {
                        //error
                        reqOptions.error(responsedata);
                    }
                }
            };
        };

        /**
         * Get messages list.
         *
         * Usage Examples:
         *
         * Get latest messages group by users and groups:
         * Applozic.ALApiService.getMessages({data: {}, success: function(response) {console.log(response);}, error: function() {}});
         *
         * Messages between logged in user and a specific userId:
         * Applozic.ALApiService.getMessages({data: {userId: 'debug4'}, success: function(response) {console.log(response);}, error: function() {}});
         *
         * Messages between logged in user and a specific groupId:
         * Applozic.ALApiService.getMessages({data: {groupId: 5694841}, success: function(response) {console.log(response);}, error: function() {}});
         *
         * Messages history before a timestamp, for loading message list, pass the endTime = createdAt of the last message received in the message list api response
         * Applozic.ALApiService.getMessages({data: {userId: 'debug4', endTime: 1508177918406}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.getMessages = function (options) {
            if (options.data.userId || options.data.groupId) {
                if (options.data.pageSize === 'undefined') {
                    options.data.pageSize = 30;
                }
            } else if (typeof options.data.mainPageSize === 'undefined') {
                options.data.mainPageSize = 60;
            }
            var data = getAsUriParameters(options.data);
            var response = new Object();
            ALApiService.ajax({
                url: MCK_BASE_URL + MESSAGE_LIST_URL + "?" + data,
                async: (typeof options.async !== 'undefined') ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = "success";
                    response.data = data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = "error";
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Usage Example:
	 * Send message to a user (to)
         * Applozic.ALApiService.sendMessage({data: {message: {"type":5,"contentType":0,"message":"hi","to":"debug4","metadata":{},"key":"mpfj2","source":1}}, success: function(response) {console.log(response);}, error: function() {}});
         * Send message to a group using groupId
         * Applozic.ALApiService.sendMessage({data: {message: {"type":5,"contentType":0,"message":"hi","groupId":"group-1","metadata":{},"key":"mpfj2","source":1}}, success: function(response) {console.log(response);}, error: function() {}});
         * Send message to a group using clientGroupId
         * Applozic.ALApiService.sendMessage({data: {message: {"type":5,"contentType":0,"message":"hi","clientGroupId":"group-1","metadata":{},"key":"mpfj2","source":1}}, success: function(response) {console.log(response);}, error: function() {}});
	 * type: 5 - Sent Message, 4 - Received Message
         * contentType: 0 - Standard Chat Message
         * to: userId to whom the message is to be sent
         * metadata: Additional key value pairs
         * source (optional): 1 - WEB, 5 - DESKTOP_BROWSER, 6 - MOBILE_BROWSER
         */
        ALApiService.sendMessage = function (options) {
            ALApiService.ajax({
                type: 'POST',
                url: MCK_BASE_URL + MESSAGE_SEND_URL,
                global: false,
                data: JSON.stringify(options.data.message),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Send delivery report for a message.
         * Usage Example:
         * Applozic.ALApiService.sendDeliveryUpdate({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.sendDeliveryUpdate = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + MESSAGE_DELIVERY_UPDATE_URL,
                data: "key=" + options.data.key,
                global: false,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Send read report for a message.
         * Usage Example:
         * Applozic.ALApiService.sendReadUpdate({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.sendReadUpdate = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + MESSAGE_READ_UPDATE_URL,
                data: "key=" + options.data.key,
                global: false,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Delete message
         * Usage Example:
         * Applozic.ALApiService.deleteMessage({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.deleteMessage = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + MESSAGE_DELETE_URL + "?key=" + options.data.key,
                global: false,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Reply to a particular message
         * Usage Example:
         * Applozic.ALApiService.updateReplyMessage({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.updateReplyMessage = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + UPDATE_REPLY_MAP + "?keys=" + options.data.key,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Delete conversation thread of the logged in user with a particular user or group.
         * Usage Example:
         *
         * Delete by userId
         * Applozic.ALApiService.deleteConversation({data: {userId: 'debug2'}, success: function(response) {console.log(response);}, error: function() {}});
         * Delete by groupId
         * Applozic.ALApiService.deleteConversation({data: {groupId: 5694841}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.deleteConversation = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + CONVERSATION_DELETE_URL,
                type: "get",
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                data: getAsUriParameters(options.data),
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Create group
         * Usage Example:
         * Applozic.ALApiService.createGroup({data: {group: {"groupName":"test","users":[{'userId': 'debug3'}, {'userId': 'debug4'}],"type":2,"metadata":{"CREATE_GROUP_MESSAGE":":adminName created group :groupName","REMOVE_MEMBER_MESSAGE":":adminName removed :userName","ADD_MEMBER_MESSAGE":":adminName added :userName","JOIN_MEMBER_MESSAGE":":userName joined","GROUP_NAME_CHANGE_MESSAGE":"Group name changed to :groupName","GROUP_ICON_CHANGE_MESSAGE":"Group icon changed","GROUP_LEFT_MESSAGE":":userName left","DELETED_GROUP_MESSAGE":":adminName deleted group","GROUP_USER_ROLE_UPDATED_MESSAGE":":userName is :role now","GROUP_META_DATA_UPDATED_MESSAGE":"","ALERT":"","HIDE":""}} }, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.createGroup = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_CREATE_URL,
                global: false,
                data: JSON.stringify(options.data.group),
                type: 'post',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Get groups list.
         * Usage Example:
         * Applozic.ALApiService.loadGroups({success: function(response) {console.log(response);} });
         */
        ALApiService.loadGroups = function (options) {
            if (options.baseUrl) {
                MCK_BASE_URL = options.baseUrl;
            }
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_LIST_URL,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
         * Get groups info.
         * Usage Example:
         * Applozic.ALApiService.getGroupInfo({data:{group:{groupId:"237437"}}, success: function(response){console.log(response);}, error: function() {}});
         */
        ALApiService.getGroupInfo = function (options) {
            var groupId = (options.data.groupId) ? "?groupId=" + options.data.groupId : "?clientGroupId=" + options.data.clientGroupId;
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_INFO_URL + groupId,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
          * Add Group Member to Group.
          * Usage Example:
          * Applozic.ALApiService.addGroupMember({data:{group:{"userId":"user unique identifier",
                                                      "clientGroupId":"group unique identifier" }},
                                                       success: function(response) {console.log(response);}, error: function() {} });
          */
        ALApiService.addGroupMember = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_ADD_MEMBER_URL,
                type: 'POST',
                data: JSON.stringify(options.data.group),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Remove Group Member from Group.
         * Usage Example:
         * Applozic.ALApiService.removeGroupMember({data:{group:{"userId":"user unique identifier ",
                                                     "clientGroupId":"group unique identifier" }},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */

        ALApiService.removeGroupMember = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_REMOVE_MEMBER_URL,
                type: 'POST',
                data: JSON.stringify(options.data),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Group Left
         * Usage Example:
         * Applozic.ALApiService.groupLeave({data:{group:{"clientGroupId":"group unique identifier" }},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */

        ALApiService.groupLeave = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_LEFT_URL,
                type: 'POST',
                data: JSON.stringify(options.data),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
        * Group Update
        * Usage Example:
        * Applozic.ALApiService.groupUpdate({data:{group:{groupId:groupId or clientGroupId:"clientGroupId",newName:"New name of group",imageUrl:"image url of the group"}},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */

        ALApiService.groupUpdate = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_UPDATE_URL,
                type: 'POST',
                data: JSON.stringify(options.data),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response, options.data.group);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
        * Check if user is part of a Group
        * Usage Example:
        * Applozic.ALApiService.isUserPresentInGroup({data:{clientGroupId:"clientGroupId",userId:"userId"},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */

        ALApiService.isUserPresentInGroup = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_IS_USER_PRESENT_URL + '?userId=' + options.data.userId + '&clientGroupId=' + options.data.clientGroupId,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Group Users Count
         * Usage Example:
         * Applozic.ALApiService.groupUserCount({data:{clientGroupId:["clientGroupId1","clientGroupId2"]},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */

        ALApiService.groupUserCount = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_USER_COUNT_URL + '?clientGroupIds=' + options.data.clientGroupId,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
        * Group Delete
        * Usage Example:
        * Applozic.ALApiService.groupDelete({data:{clientGroupId:"clientGroupId"},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */

        ALApiService.groupDelete = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_LEFT_URL + "?clientGroupId=" + options.data.clientGroupId,
                type: 'GET',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
         * Create User FriendList
         * Usage Example:
         * Applozic.ALApiService.createUserFriendList({data:{groupName:"groupName"},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */
        ALApiService.createUserFriendList = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + FRIEND_LIST_URL + options.data.group.groupName + "/add/",
                type: 'POST',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                data: JSON.stringify(options.data.group.groupMemberList),
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                        ALStorage.setFriendListGroupName(options.data.group.groupName);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        ALApiService.createOpenFriendList = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + FRIEND_LIST_URL + options.data.group.groupName + "/add/members",
                type: 'POST',
                data: JSON.stringify(options.data.group),
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                        ALStorage.setFriendListGroupName(options.data.group.groupName);
                        ALStorage.setFriendListGroupType(options.data.group.type);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
         * Get FriendList
         * Usage Example:
         * Applozic.ALApiService.getFriendList({data:{groupName:"groupName",type: 9,
                                                groupMemberList: ["debug2", "debug3","videocall-1"]},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */
        ALApiService.getFriendList = function (options) {
            var getFriendListUrl = (options.data.type !== "null") ? "/get?groupType=9" : "/get";
            options.data.url = options.data.url ? options.data.url : getFriendListUrl;
            ALApiService.ajax({
                url: MCK_BASE_URL + FRIEND_LIST_URL + options.data.groupName + options.data.url,
                type: 'GET',
                async: (typeof options.data.async !== 'undefined') ? options.data.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
                * remove user from friendList
                * Usage Example:
                * Applozic.ALApiService.removeUserFromFriendList({group:{groupName:"groupname",userId:"userid",type:9},
                                                             success: function(response) {console.log(response);}, error: function() {}});
                */
        ALApiService.removeUserFromFriendList = function (options) {
            var getFriendListUrl = (options.group.type) ? "/remove?userId=" + options.group.userId + "&groupType=9" : "/remove?userId=" + options.group.userId;
            ALApiService.ajax({
                url: MCK_BASE_URL + FRIEND_LIST_URL + options.group.groupName + getFriendListUrl,
                type: 'Post',
                contentType: 'application/json',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * delete friendList
         * Usage Example:
         * Applozic.ALApiService.deleteFriendList({group:{groupName:"groupname",userId:"userid",type:9},
                                                      success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.deleteFriendList = function (options) {
            var getFriendListUrl = (options.group.type) ? "/delete?groupType=9" : "/delete";
            ALApiService.ajax({
                url: MCK_BASE_URL + FRIEND_LIST_URL + options.group.groupName + getFriendListUrl,
                type: "GET",
                async: false,
                contentType: "application/json",
                async: (typeof options.async !== 'undefined') ? options.async : true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        };
        /**
        * Get User Detail
        * Usage Example:
        * Applozic.ALApiService.getUserDetail({data:{userIdList:["userId1","userId2"]},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */
        ALApiService.getUserDetail = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + GET_USER_DETAIL_URL,
                data: JSON.stringify({
                    userIdList: options.data
                }),
                type: 'POST',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
        * Update User Detail
        * Usage Example:
        * Applozic.ALApiService.updateUserDetail({data:{email:"user email", displayName:"user display name",imageLink:"User profile image url", statusMessage:"status Message"},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */
        ALApiService.updateUserDetail = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + UPDATE_USER_DETAIL_URL,
                data: JSON.stringify(options.data),
                type: 'POST',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }
        /**
                 * Update Password
                 * Usage Example:
                 * Applozic.ALApiService.updatePassword({data:{oldPassword:"oldPassword", newPassword:"newPassword"},
                                                              success: function(response) {console.log(response);}, error: function() {} });
                 */
        ALApiService.updatePassword = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + UPDATE_PASSWORD_URL + "?oldPassword=" + options.data.oldPassword + "&newPassword=" + options.data.newPassword,
                type: 'GET',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Get Contact List
         * Usage Example:
         * Applozic.ALApiService.getContactList({url:"url",
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */
        ALApiService.getContactList = function (options) {
            var baseurl = options.baseUrl ? options.baseUrl : MCK_BASE_URL;
            ALApiService.ajax({
                url: baseurl+ options.url,
                type: 'GET',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
        * One to One Mute
        * Usage Example:
        * Applozic.ALApiService.userChatMute({data:{userId:"userId",notificationAfterTime:"Time till you want to mute in millisceconds"},
                                                     success: function(response) {console.log(response);}, error: function() {} });
        */

        ALApiService.userChatMute = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + ONE_TO_ONE_MUTE_URL + "?userId=" + options.data.userId + "&notificationAfterTime=" + options.data.notificationAfterTime,
                type: 'post',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Group Mute
         * Usage Example:
         * Applozic.ALApiService.groupMute({data:{clientGroupId:clientGroupId,notificationAfterTime:"Time till you want to mute in millisceconds"},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */

        ALApiService.groupMute = function (options) {
            var group = {};
            group.clientGroupId = options.data.clientGroupId;
            group.notificationAfterTime = options.data.notificationAfterTime;
            ALApiService.ajax({
                url: MCK_BASE_URL + GROUP_MUTE_URL,
                type: 'post',
                data: JSON.stringify(group),
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
        * Mute User Sync
        * Usage Example:
        * Applozic.ALApiService.syncMuteUserList({success: function(response) {console.log(response);}, error: function() {} });
        */

        ALApiService.syncMuteUserList = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + SYNC_MUTE_USER_URL,
                type: 'get',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
                 * Block User
                 * Usage Example:
                 * Applozic.ALApiService.blockUser({data:{userId:"userId",isBlock:true},
                                                              success: function(response) {console.log(response);}, error: function() {} });
                 */

        ALApiService.blockUser = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + USER_BLOCK_URL + "?userId=" + options.data.userId + "&block=" + options.data.isBlock,
                type: 'GET',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * UnBlock User
         * Usage Example:
         * Applozic.ALApiService.unBlockUser({data:{userId:"userId"},
                                                      success: function(response) {console.log(response);}, error: function() {} });
         */

        ALApiService.unBlockUser = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + USER_UNBLOCK_URL + "?userId=" + options.data.userId,
                type: 'GET',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                global: false,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }


        /**
                * SendConversationCloseUpdate
                * Usage Example:
                window.Applozic.ALApiService.sendConversationCloseUpdate({conversationId:conversationId, success: function (result) {}, error: function () {} });
                */

        ALApiService.sendConversationCloseUpdate = function (options) {
            var data = "id=" + options.conversationId;
            ALApiService.ajax({
                url: MCK_BASE_URL + CONVERSATION_CLOSE_UPDATE_URL,
                data: data,
                global: false,
                type: 'get',
                success: function () { },
                error: function () { }
            });
        };

        /**
         * FileUpload
         * Usage Example:
          window.Applozic.ALApiService.fileUpload({data:{ url: url} , success: function (result) {}, error: function () { } });
         */

        ALApiService.fileUpload = function (options) {
            ALApiService.ajax({
                type: "GET",
                skipEncryption: true,
                url: options.data.url,
                global: false,
                data: "data=" + new Date().getTime(),
                crosDomain: true,
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }


        /**
        * * Send Attachment
        * Usage Example:
        * var file =document.getElementById("photo").files[0];
        * var message= {"type":5,"contentType":0,"message":"","to/groupId":"debug4","metadata":{},"source":1};
        * window.Applozic.ALApiService.sendAttachment({data:{ file: file,messagePxy:message} , success: function (result) {}, error: function () { } });
       */

      ALApiService.sendAttachment = function (options) {
        if(MCK_CUSTOM_UPLOAD_SETTINGS === "awsS3Server"){
          window.Applozic.ALApiService.sendAttachmentToAWS(options);
        }
        else if (MCK_CUSTOM_UPLOAD_SETTINGS ===	"googleCloud") {
          window.Applozic.ALApiService.sendAttachmentToCloud(options);
        }
        else {
          window.Applozic.ALApiService.sendAttachmentToGoogleServer(options);
        }
      };

      ALApiService.sendAttachmentToGoogleServer = function(options){
        var xhr = new XMLHttpRequest();
        var attachmentURL = MCK_FILE_URL + FILE_UPLOAD_URL;
        ALApiService.ajax({
            type: "GET",
            skipEncryption: true,
            url: (typeof options.url !== 'undefined') ? options.url : attachmentURL,
            global: false,
            data: "data=" + new Date().getTime(),
            crosDomain: true,
            success: function (response) {
              xhr.addEventListener('load', function (e) {
                var file = JSON.parse(this.responseText);
                  var message = options.data.messagePxy;
                  if (file) {
                      message.fileMeta = file.fileMeta;
                      Applozic.ALApiService.sendMessage({
                          data: {message : message},
                          success: function (response) { console.log(response); },
                          error: function () { }
                      });
                  }
                });
                var data = new FormData();
                var file = options.data.file;
                data.append('files[]', file);
                xhr.open("POST", response, true);
                xhr.send(data);
                },
              error: function (response) {
                if (options.error) {
                    options.error(response);
                }
              }
        });
      };

      ALApiService.sendAttachmentToAWS = function(options){
        var data = new FormData();
        var xhr = new XMLHttpRequest();
        var attachmentURL = MCK_BASE_URL + ATTACHMENT_UPLOAD_URL;
        xhr.addEventListener('load', function (e) {
            var file = this.responseText;
            var message = options.data.messagePxy;
            if (file) {
                message.fileMeta = JSON.parse(file);
                Applozic.ALApiService.sendMessage({
                    data: {message : message},
                    success: function (response) { console.log(response); },
                    error: function () { }
                });
             }
          });
          data.append("file", options.data.file);
          xhr.open("post", attachmentURL, true);
          xhr.setRequestHeader("UserId-Enabled", true);
          xhr.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
          xhr.setRequestHeader("Application-Key", MCK_APP_ID);
          xhr.setRequestHeader("Device-Key", DEVICE_KEY);
          if (ACCESS_TOKEN) {
              xhr.setRequestHeader("Access-Token", ACCESS_TOKEN);
          }
          xhr.send(data);
      };

      ALApiService.sendAttachmentToCloud = function(options){
        var data = new FormData();
        var xhr = new XMLHttpRequest();
        var attachmentURL = (typeof options.cloudUploadUrl !== 'undefined') ? options.cloudUploadUrl : MCK_CUSTOM_URL + CUSTOM_FILE_UPLOAD_URL;
        xhr.addEventListener('load', function (e) {
          var file = JSON.parse(this.responseText);
          var message = options.data.messagePxy;
            if (file) {
                message.fileMeta = file.fileMeta;
                Applozic.ALApiService.sendMessage({
                    data: {message : message},
                    success: function (response) { console.log(response); },
                    error: function () { }
                });
            }
          });
          data.append("files[]", options.data.file);
          xhr.open("post", attachmentURL, true);
          xhr.setRequestHeader("UserId-Enabled", true);
          xhr.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
          xhr.setRequestHeader("Application-Key", MCK_APP_ID);
          xhr.setRequestHeader("Device-Key", DEVICE_KEY);
          if (ACCESS_TOKEN) {
              xhr.setRequestHeader("Access-Token", ACCESS_TOKEN);
          }
          xhr.send(data);
        };
        /**

        /**
                 * DeleteFileMeta
                 * Usage Example:
                  window.Applozic.ALApiService.deleteFileMeta({data:{url:url} , success: function (result) {}, error: function () { } });
                 */
        ALApiService.deleteFileMeta = function (options) {
            ALApiService.ajax({
                url: options.data.url,
                skipEncryption: true,
                type: 'post',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        };

        /**
                 * addMessageInbox
                 * Usage Example:
                  window.Applozic.ALApiService.addMessageInbox({data:{sender:"sender",messageContent:"Welcome"} , success: function (result) {}, error: function () { } });
                 */

        ALApiService.addMessageInbox = function (options) {
            ALApiService.ajax({
                type: 'GET',
                url: MCK_BASE_URL + MESSAGE_ADD_INBOX_URL,
                global: false,
                data: 'sender=' + encodeURIComponent(options.data.sender) + "&messageContent=" + encodeURIComponent(options.data.messageContent),
                contentType: 'text/plain',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        };
        /**
                 * conversationReadUpdate
                 * Usage Example:
                  window.Applozic.ALApiService.conversationReadUpdate({data: "groupId=groupId"/"userId=encodeURIComponent(userId)" , success: function (result) {}, error: function () { } });
                 */

        ALApiService.conversationReadUpdate = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + CONVERSATION_READ_UPDATE_URL,
                data: options.data,
                global: false,
                type: 'get',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

        /**
         * sendSubscriptionIdToServer
         * Usage Example:
          window.Applozic.ALApiService.sendSubscriptionIdToServer({data: {"subscriptionId":subscriptionId}, success: function (result) {}, error: function () { } });
         */

        ALApiService.sendSubscriptionIdToServer = function (options) {
            var subscriptionId = options.data.subscriptionId;
            ALApiService.ajax({
                url: MCK_BASE_URL + MCK_SW_REGISTER_URL,
                skipEncryption: true,
                type: 'post',
                data: 'registrationId=' + subscriptionId,
                success: function (data) { },
                error: function (xhr, desc, err) {
                    if (xhr.status === 401) {
                        sessionStorage.clear();
                        console.log('Please reload page.');
                    }
                }
            });
        }

        /**
                * getTopicId
                * Usage Example:
                 window.Applozic.ALApiService.getTopicId({data: {"conversationId":conversationId}, success: function (result) {}, error: function () { } });
                */

        ALApiService.getTopicId = function (options) {
            var conversationId = "id=" + options.data.conversationId;
            ALApiService.ajax({
                url: MCK_BASE_URL + TOPIC_ID_URL + "?" + conversationId,
                type: 'get',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

        /**
                * getContactDisplayName
                * Usage Example:
                 window.Applozic.ALApiService.getContactDisplayName({data: {"userIdArray":userIdArray}, success: function (result) {}, error: function () { } });
                */

        ALApiService.getContactDisplayName = function (options) {
            var userIdArray = options.data.userIdArray;
            if (userIdArray.length > 0 && userIdArray[0]) {
                var data = '';
                var uniqueUserIdArray = userIdArray.filter(function (item, pos) {
                    return userIdArray.indexOf(item) === pos;
                });
                for (var i = 0; i < uniqueUserIdArray.length; i++) {
                    var userId = uniqueUserIdArray[i];
                    if (typeof MCK_CONTACT_NAME_MAP[userId] === 'undefined') {
                        data += "userIds=" + encodeURIComponent(userId) + "&";
                    }
                }
                if (data.lastIndexOf("&") === data.length - 1) {
                    data = data.substring(0, data.length - 1);
                }
                if (data) {
                    ALApiService.ajax({
                        url: MCK_BASE_URL + CONTACT_NAME_URL,
                        data: data,
                        global: false,
                        type: 'get',
                        success: function (response) {
                            if (options.success) {
                                options.success(response);
                            }
                        },
                        error: function (response) {
                            if (options.error) {
                                options.success(response);
                            }
                        }
                    });
                }
            }
        }

        /**
                 * getUserStatus
                 * Usage Example:
                  window.Applozic.ALApiService.getUserStatus({success: function (result) {}, error: function () { } });
                 */

        ALApiService.getUserStatus = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + USER_STATUS_URL,
                type: 'get',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

        /**
                * fetchConversationByTopicId
                * Usage Example:
                 window.Applozic.ALApiService.fetchConversationByTopicId({data: {"topicId":topicId,"tabId":tabId,"pageSize":pageSize,"clientGroupId":clientGroupId,"isGroup":isGroup}, success: function (result) {}, error: function () { } });
                */

        ALApiService.fetchConversationByTopicId = function (options) {
            var reqdata = 'topic=' + options.data.topicId;
            if (options.data.tabId) {
                reqdata += ('' + options.data.isGroup === 'true') ? '&groupId=' + options.data.tabId : '&userId=' + encodeURIComponent(options.data.tabId);
            } else if (options.data.clientGroupId) {
                reqdata += '&clientGroupId=' + options.data.clientGroupId;
            } else {
                return false;
            }
            if (options.data.pageSize) {
                reqdata += '&pageSize=' + options.data.pageSize;
            }
            ALApiService.ajax({
                url: MCK_BASE_URL + CONVERSATION_FETCH_URL,
                data: reqdata,
                type: 'get',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }


        /**
        * getConversationId
        * Usage Example:
         window.Applozic.ALApiService.getConversationId({data: {"topicId":topicId,"userId":userId,"status":status,"isGroup":isGroup,"topicDetail":topicDetail}, success: function (result) {}, error: function () { } });
        */

        ALApiService.getConversationId = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + CONVERSATION_ID_URL,
                global: false,
                data: w.JSON.stringify(options.data),
                type: 'post',
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

        /**
       * registerClientApi
       * Usage Example:
       * var userPxy = {
          'applicationId': 'APPLICATION_KEY', // Replace APPLICATION_KEY with the Application key received after Signup from https://www.applozic.com/signup.html
          'userId': 'USER_ID', // Replace USER_ID with the user's unique identifier
          'registrationId': 'PUSH_NOTIFICATION_TOKEN', //Replace with FCM push notification token for Android devices and APNS push notification token for iOS devices
          'pushNotificationFormat' : '1', //1 for PhoneGap, 2 for Ionic
          'deviceType': '1',       //1 for Android, 4 for iOS
          'appVersionCode': '108'
        };
        window.Applozic.ALApiService.registerClientApi({data: {"userPxy":userPxy}, success: function (result) {}, error: function () { } });
       */


        ALApiService.registerClientApi = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + REGISTER_CLIENT_URL,
                type: 'post',
                data: JSON.stringify(options.data.userPxy),
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

        /**
          * logout
          * Usage Example :
          * Applozic.ALApiService.logout({success: function(response) {console.log(response);} , error: function() {}})
          */
        ALApiService.logout = function (options) {
            ALApiService.ajax({
                url: MCK_BASE_URL + LOGOUT,
                type: 'post',
                async: (typeof options.async !== 'undefined') ? options.async : true,
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }


          /*
          * getUsersByRole
          * Usage Example:
          window.Applozic.ALApiService.getUsersByRole({data: {"startIndex":0,"pageSize":30,"roleNameList":["APPLICATION_WEB_ADMIN","ADMIN"]}, success: function (result) {console.log(result);}, error: function () { } });
          */
        ALApiService.getUsersByRole = function (options) {
            var data = getAsUriParameters(options.data);
            ALApiService.ajax({
                url: MCK_BASE_URL + USER_FILTER_BY_ROLE + "?" + data,
                global: false,
                type: 'get',
                contentType: 'application/json',
                success: function (response) {
                    if (options.success) {
                        options.success(response);
                    }
                },
                error: function (response) {
                    if (options.error) {
                        options.success(response);
                    }
                }
            });
        }

          /*
          * pushNotificationLogout
          * Usage Example :
          * Applozic.ALApiService.pushNotificationLogout({success: function(response) {console.log(response);} , error: function() {}})
          */
        ALApiService.pushNotificationLogout= function (options) {
        ALApiService.ajax({
            url: MCK_BASE_URL + PUSH_NOTIFICATION_LOGOUT,
            type: 'post',
            async: (typeof options.async !== 'undefined') ? options.async : true,
            contentType: 'application/json',
            success: function (response) {
                if (options.success) {
                    options.success(response);
                }
            },
            error: function (response) {
                if (options.error) {
                    options.error(response);
                }
            }
        });
      }
        return ALApiService;
    }

    //define globally if it doesn't already exist
    if (typeof (ALApiService) === 'undefined') {
        window.Applozic.ALApiService = define_ALApiService();
    }
    else {
        console.log("ALApiService already defined.");
    }
})(window);
