
jQuery(document).ready(function () {
    var $chat_form = jQuery('#chat-form');
    var $chat_submit = jQuery('#chat-submit');
    var $chat_relauncher = jQuery('#chat-relauncher');
    var $chat_response = jQuery('#chat-response');
    var $chat_postlaunch = jQuery('#chat-post-launch');

    $chat_relauncher.on('click', function () {
        window.location = '/login.html';
    });

});

var docs =
        {
            start: [
                {name: "Android Docs", content: "https://www.applozic.com/docs/android-chat-sdk.html#overview"},
                {name: "iOS Docs", content: "https://www.applozic.com/docs/ios-chat-sdk.html#overview"},
                {name: "Web Docs", content: "https://www.applozic.com/docs/web-chat-plugin.html#overview"},
                {name: "PhoneGap Docs", content: "https://www.applozic.com/docs/phonegap-chat-plugin.html"},
                {name: "Platform APIs", content: "https://www.applozic.com/docs/platform-api-chat.html"},
                {name: "Configuration", content: "https://www.applozic.com/docs/configuration.html"},
            ],
            android: [
                {name: "Github", content: "https://github.com/Applozic/Applozic-Android-SDK"},
                {name: "Push Notification", content: "https://www.applozic.com/docs/android-chat-sdk.html#step-4-push-notification-setup"}
            ],
            ios: [
                {name: "Github", content: "https://github.com/Applozic/Applozic-iOS-SDK/"},
                {name: "Objective-C", content: "https://www.applozic.com/docs/ios-chat-sdk.html#objective-c"},
                {name: "Swift", content: "https://www.applozic.com/docs/ios-chat-sdk.html#swift"},
                {name: "Push Notification", content: "https://www.applozic.com/docs/android-chat-sdk.html#step-4-push-notification-setup"}
            ],
            web: [
                {name: "Github", content: "https://github.com/Applozic/Applozic-Web-Plugin/"},
                {name: "Sidebox Layout Plugin", content: "https://www.applozic.com/docs/web-chat-plugin.html#sidebox-layout"},
                {name: "Full Layout plugin", content: "https://www.applozic.com/docs/web-chat-plugin.html#full-view-layout"}
            ]
        };

var queries = [
    {name: "Which plaform you are integration with?", content: "Which plaform you are integration with?"}
];

var price = [
    {name: "Its free only for development and testing", content: "Its free only for development and testing"},
    {name: "Link", content: "https://www.applozic.com/price.html"}
];

var check = [
    {name: "Tech team", content: "Let me check with the tech team."},
    {name: "Forward request", content: "Let me forward your request to the tech team"}
];

var greetings = [
    {name: "Unknown User", content: "Hi, may I know your name and company"},
    {name: "New User", content: "May I know your company name."}
];

var setup = [
    {name: "Push Notification setup for Android", content: "Go to Applozic Dashboard -> Edit Application -> Push Notification -> Android: GCM/FCM Server Key"},
    {name: "Push Notification setup for iOS", content: "Go to Applozic Dashboard -> Edit Application -> Push Notification -> Upload APNS Certificate according to environment"},
    {name: "Access Token URL setup", content: "Set the access token url in Applozic Dashboard -> Edit Application -> Security -> Access Token URL \n Flow is:\n 1. Your app/website will pass the userId and password to Applozic chat sdk.\n 2. Applozic Chat SDK sends the info to Applozic Server.\n3. Applozic Server will call your server url as configured in Access Token URL along with userId and password.\n 4. Based on userId and password, your server url need to return true/false to validate that. \n Refer to the following url for details: https://www.applozic.com/docs/configuration.html#access-token-url "},
];

var issue = [
    {name: "For Web-chat-plugin", content: "Can you please file the issue here https://github.com/AppLozic/Applozic-Web-Plugin/issues/new"},
    {name: "For Android", content: "Can you please file the issue here https://github.com/AppLozic/Applozic-Android-SDK/issues/new"},
    {name: "For iOS", content: "Can you please file the issue here https://github.com/AppLozic/Applozic-iOS-SDK/issues/new"},
];

function initAutoSuggestions() {
    $('#mck-text-box').atwho({
        at: "#docs",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: docs.start
    }).atwho({
        at: "#android",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: docs.android
    }).atwho({
        at: "#ios",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: docs.ios
    }).atwho({
        at: "#web",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: docs.web
    }).atwho({
        at: "#price",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: price
    }).atwho({
        at: "#which",
        insertTpl: '${content}',
        displayTpl: '<li><small>${content}</small></li>',
        data: queries
    }).atwho({
        at: "#check",
        insertTpl: '${content}',
        displayTpl: '<li><small>${content}</small></li>',
        data: check
    }).atwho({
        at: "hello",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: greetings
    }).atwho({
        at: "#setup",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small">${content}</small></li>',
        data: setup
    }).atwho({
        at: "#issue",
        insertTpl: '${content}',
        displayTpl: '<li>${name} <small>${content}</small></li>',
        data: issue
    });
}


var $userId = "";
var $appKey = "applozic-sample-app";
var $contactNumber = "";
var $password = "";
function logout() {
    $applozic.fn.applozic("logout");
}

function chatLogin() {
    var userId = localStorage.getItem('loggedinUser'); //"debug2";
    var appId = localStorage.getItem('applicationId'); // "applozic-sample-app";
    var userPassword = localStorage.getItem('password'); // "debug2";
    var userContactNumber = "";
    var topicBoxEnabled = true;
    var applozicBaseUrl = "https://apps.applozic.com/";
    console.log("base url", applozicBaseUrl);
    /*var displayName = '';
     displayName = '${param.displayName}';*/
    if (typeof userId === "undefined" || userId == null) {
        return;
    }

    if (userId == 'applozic' || userId == 'applozic-premium') {
        $("#mck-individual-tab-title .mck-tab-title").click(function () {
            clearbit($(this).text());
        });
    }

    function onInitialize(data) {
        if (data.status == 'success') {
            // write your logic exectute after plugin initialize.
            $("#login-modal").mckModal('hide');
            $('#chat').css('display', 'none');
            $('#chat-box-div').css('display', 'block');
            initAutoSuggestions();
            $("#li-chat a").trigger('click');
        }
    }
    var loginId = localStorage.isAdmin == "true" ? "agent" : userId;
    var uPassword = localStorage.isAdmin == "true" ? "agent" : userPassword;

    $applozic.fn.applozic({
        baseUrl: "https://apps.applozic.com/",
        notificationIconLink:
                'https://www.applozic.com/resources/images/applozic_icon.png',
        userId: loginId,
        appId: appId,
        //appId: 'applozic-sample-app',
        // email:'userEmail',
        accessToken: uPassword,
        desktopNotification: true,
        swNotification: true,
        olStatus: true,
        onInit: onInitialize,
        onTabClicked: function (tabDetail) {
            window.location = "/#/conversations";
            if (typeof tabDetail === 'object') {
                console.log(tabDetail.tabId + " " + tabDetail.isGroup);
                if (tabDetail.isGroup) {
                    window.$applozic("#km-toolbar").removeClass('n-vis').addClass('vis');
                    window.Aside.initConversation(tabDetail.tabId);
                } else {
                    window.$applozic("#km-toolbar").addClass('n-vis').removeClass('vis');
                }
            }
        },
        locShare: true,
        googleApiKey: 'AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4',
        launchOnUnreadMessage: true,
        topicBox: topicBoxEnabled,
        authenticationTypeId: 1,
        initAutoSuggestions: initAutoSuggestions

                // topicDetail: function(topicId) {}
    });
    console.log($applozic.fn.applozic);
    return false;
    //});
}


function clearbit(email) {
    //Authorization: Bearer sk_8235cd13e90bd6b84260902b98c64aba
    //https://person-stream.clearbit.com/v2/combined/find?email=alex@alexmaccaw.com
    $.ajax({
        url: 'https://person-stream.clearbit.com/v2/combined/find?email=' + email,
        type: 'GET',
        headers: {
            "Authorization": "Bearer sk_8235cd13e90bd6b84260902b98c64aba"
        },
        success: function (response) {
            console.log(response);
            var person = response.person;
            var company = response.company;
            var info = "";
            if (typeof person !== "undefined" && person != null && person != "null") {
                info = person.bio + " " + person.location;
                $("#cust-info .bio").html(person.bio + " " + person.location);
                var employment = person.employment;
                if (typeof employment !== "undefined" && employment != null && employment != "null") {
                    info = info + " " + person.employment.title;
                    $("#cust-info .title").html(person.employment.title);
                }
                var linkedin = person.linkedin;
                if (typeof linkedin !== "undefined" && linkedin != null && linkedin != "null") {
                    info = info + " " + linkedin.handle;
                    $("#cust-info .linkedin").attr('href', 'https://linkedin.com/' + linkedin.handle);
                }
            }
            if (typeof company !== "undefined" && company != null && company != "null") {
                info = info + " " + company.domain;
                $("#cust-info .domain").attr('href', company.domain);
            }
            console.log(info);
        }
    });

}

