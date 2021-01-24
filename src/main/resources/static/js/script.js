let data = $('#data');
let userId = data.data("user-id");
let email = data.data("user-email");
let username = data.data("user-username");
let avatar = data.data("user-avatar");
let contactList = $("#contact-list");
let chatList = $("#chat-list");
let chatNameHeader = $("#chat-name");
let messageText = $("#message-text");
let sendButton = $("#send-button");
let chatWindow = $("#chat-window");
let contactListChatCreating = $("#contact-list-chat-creating");
let sideContent = $("#side-content");
let chatId = "-1";
let messageRightClick = $("#message-right-click");

Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$(() => {
    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#message-right-click").length > 0) {
            messageRightClick.hide(100);
        }
    });

    let leftToggle = $("#toggle-left");
    let leftToggled = false;
    let leftSidebar = $("#sidebar");
    let rightToggle = $("#toggle-right");
    let rightToggled = false;
    let rightSidebar = $("#chat-menu");

    leftToggle.click(() => {
        if (leftToggled) {
            leftSidebar.css("transform", "translateX(-100%)");
            leftToggled = false;
        } else {
            leftSidebar.css("transform", "translateX(0%)");
            leftToggled = true;
        }
    });

    rightToggle.click(() => {
        if (rightToggled) {
            rightSidebar.css("transform", "translateX(100%)");
            rightToggled = false;
        } else {
            rightSidebar.css("transform", "translateX(0%)");
            rightToggled = true;
        }
    });

    if (localStorage.getItem("currentChatId") !== null) {
        loadChat(localStorage.getItem("currentChatId"));
    }

    let $body = $('body');
    $('.js-menu-toggle').click(function(e) {
        const $this = $(this);

        if ( $body.hasClass('show-sidebar') ) {
            $body.removeClass('show-sidebar');
            $this.removeClass('active');
        } else {
            $body.addClass('show-sidebar');
            $this.addClass('active');
        }

        e.preventDefault();
    });

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "chat",
        async: false,
        cache: false,
        success: (chats) => {
            for (let chat of chats) {
                addChatToSideBar(chat);
            }
        }
    });

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "user/contact",
        async: false,
        cache: false,
        success: (contacts) => {
            for (let contact of contacts) {
                addContactToSideBar(contact);
                addContactToChatCreatingBar(contact);
            }
        }
    });

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "user/simple?removeFriends=true",
        async: false,
        cache: false,
        success: (userList) => {
            let container = $("#user-list-contacts-add");
            for (let user of userList) {
                let id = user.id + "-contact";
                let userId = user.id;
                let username = user.username;
                let userBlock = $(`
                    <div class='row m-2 user-modal' style='display: flow-root'>
                        <label for='` + id + `' data-id='` + userId + `' class='user-modal-checkbox'>
                            <span>` + username + `</span>
                            <button class="fa fa-plus add-contact-button float-right btn-info"></button>
                        </label>
                    </div>
                `);
                userBlock.click(() => {
                    $.ajax({
                        type: 'PUT',
                        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                        url: getHostname() + "user/follow/" + user.id,
                        async: true,
                        cache: false,
                    });
                    userBlock.remove();
                });
                container.append(userBlock);
            }
        }
    });

    let searchUsersInput = $("#modal-contacts-filter");
    let searchUsers = $(".user-modal");

    searchUsersInput.keyup(() => filter(searchUsersInput.val(), searchUsers));

    let searchUsersInputInviteToChat = $("#modal-invite-user-to-chat-filter");
    let searchUsersInviteToChat = $(".user-modal-invite-to-chat");

    searchUsersInputInviteToChat.keyup(() => filter(searchUsersInputInviteToChat.val(), searchUsersInviteToChat));

    messageText.keyup(evt => {
        evt.preventDefault();
        if (evt.which === 13) {
            prepareMessage();
        }
        return false;
    });

    sendButton.click(() => prepareMessage());

    let createChatName = $("#modal-create-chat-name");
    let createChatError = $("#modal-create-chat-error")
    let createChatButton = $("#modal-create-chat-button");
    createChatButton.click(() => {
        let chatName = createChatName.val();
        if (chatName !== "" && chatName.length < 256) {
            createChatError.text("");
            createChatName.removeClass("error-input");
            createChatName.val("");
            let ids = processCheckboxes($(".create-chat-contact-checkbox"));
            ids.push(userId)
            createChat(chatName, userId, ids);
        } else {
            createChatError.text(chatName === "" ? "Chat name can't be empty": "Chat name's too long");
            createChatName.addClass("error-input");
        }
    });

    getUserAvatarBlock(sideContent).addClass("ml-3vw mb-3vh");
});

function addChatToSideBar(chat) {
    let name = chat.chatName;
    let id = chat.chatId;

    let chatBlock = $(`<li class="block"></li>`);
    let chatLink = $(`<a href="#" class="d-flex align-items-center"></a>`);
    let chatImage = $(`<img src="/img/` + chat.avatar + `" alt="Image" class="img-fluid custom-img mr-vw">`);
    let chatName = $(`<span class="user-name">` + name + `</span>`);

    onImageError(chatImage, chatLink, name);

    chatLink.append(chatImage);
    chatLink.append(chatName);
    chatBlock.append(chatLink);

    chatBlock.click(() => {
        loadChat(id);
    });

    chatList.prepend(chatBlock);
}

function loadChat(id) {
    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "chat/" + id,
        async: false,
        cache: false,
        success: (chat) => {
            let isModerator = chat.moderatorIds.includes(userId + "");
            let name = chat.chatName;
            let id = chat.chatId;
            let logo = chat.avatar;
            chatNameHeader.text(name);
            cacheMessageText(id);
            chatId = id;
            printMessages();
            localStorage.setItem("currentChatId", id);
            localStorage.setItem("currentChat", JSON.stringify(chat));

            let chatMenu = $("#chat-menu-content");
            chatMenu.empty();
            let chatNameInMenu = $("<span class='text-center custom-h3 h3-vw mb-3vh' style='overflow-wrap: break-word;'>" + name + "</span>");
            let topBox = $("<div></div>");
            let avatar = $("<img class='img-fluid custom-img ml-3vw d-inline-flex va-baseline' src='/img/" + logo + "' data-toggle='modal' data-target='#upload-image-modal' />");
            onImageErrorWithUploader(
                avatar,
                topBox,
                name,
                "ml-3vw d-inline-flex",
                "chat/" + chatId
            );
            let participantCount = $("<div class='d-inline-flex custom-a user-count'><span id='usersInChat'>" + chat.participantIds.length + "</span>&nbsp;users</div>");
            let usersInChat = participantCount.find("#usersInChat");

            let participantList = $("<div id='participant-list' class='participant-list' style='display: none'></div>");
            $.ajax({
                type: 'GET',
                beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                url: getHostname() + "chat/" + id + "/participant",
                async: false,
                cache: false,
                success: (participants) => {
                    for (let participant of participants) {
                        let userBlock = getUserBlock(participant, true);
                        userBlock.addClass("mb-1vh");

                        if (isModerator && participant.id != userId) {
                            let kickButton = $("<button class='btn kick-button btn-outline-danger ml-auto d-inline-flex'>kick</button>");
                            kickButton.click(() => {
                                kickUser(chatId, participant.id);
                                userBlock.remove();
                                usersInChat.text(usersInChat.text() - 1);
                                chat.participantIds.remove(participant.id + "");
                                localStorage.setItem("currentChat", JSON.stringify(chat));
                                addUserToInviteModal(participant);
                            });
                            userBlock.find(">:first-child").append(kickButton);
                        }

                        participantList.append(userBlock);
                    }
                }
            });

            participantCount.click(() => {
                if (participantList.is(":hidden")) {
                    participantList.slideDown("slow");
                } else {
                    participantList.slideUp("slow");
                }
            });

            topBox.prepend(avatar);
            topBox.append(participantCount);
            if (isModerator) {
                let addParticipantPlus = $("<span class='fa fa-plus invite-plus' data-toggle='modal' data-target='#modal-invite-user-to-chat'></span>");
                topBox.append(addParticipantPlus);
            }

            chatMenu.append(chatNameInMenu);
            chatMenu.append(topBox);
            chatMenu.append(participantList);
        }
    });
}

function loadUserAvatarsByChat(chatId) {
    let userAvatars = {};

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "chat/" + chatId + "/participant/avatar",
        async: false,
        cache: false,
        success: (avatars) => userAvatars = avatars
    });

    return userAvatars;
}

function addContactToSideBar(contact) {
    let name = contact.username;

    let contactBlock = $("<li class='block'></li>");
    let link = $("<a href='#' class='d-flex align-items-center'></a>");
    let img = $("<img src='/img/" + contact.avatar + "' alt='Image' class='img-fluid custom-img mr-vw'>");
    let userName = $("<span class='user-name'>" + name + "</span>");
    onImageError(img, link, name);

    link.append(img);
    link.append(userName);
    contactBlock.append(link);

    contactList.prepend(contactBlock);

    addUserToInviteModal(contact);
}

function addContactToChatCreatingBar(contact) {
    let contactUsername = contact.username;
    let id = contact.id;

    let contactBlock = $("<div class='row m-2 user-modal checkbox-list-box' style='display: flow-root'></div>");
    let label = $("<label for='contact-" + id + "' data-id='" + userId + "' class='user-modal-checkbox'></label>");
    let img = $("<img src='/img/" + contact.avatar + "' alt='Image' class='img-fluid custom-img custom-img-checkbox-list mr-vw'>");
    let span = $("<span>" + contactUsername + "</span>");
    let checkbox = $("<input type='checkbox' id='contact-" + id + "' data-id='" + id + "' class='user-modal-checkbox d-none create-chat-contact-checkbox' />");
    let checkboxMark = $("<span class='user-modal-checkbox-mark'></span>");

    onImageError(img, label, contactUsername);

    label.append(img);
    label.append(span);
    label.append(checkbox);
    label.append(checkboxMark);
    contactBlock.append(label);

    contactListChatCreating.append(contactBlock);
}

function cacheMessageText(id) {
    localStorage.setItem(chatId, messageText.val())
    if (localStorage.getItem(id) !== null) {
        messageText.val(localStorage.getItem(id));
    } else {
        messageText.val("");
    }
}

// todo: оптимизировать
function printMessages() {
    let userAvatars = loadUserAvatarsByChat(chatId);
    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "message/chat/" + chatId,
        async: false,
        cache: false,
        success: (messages) => {
            chatWindow.empty();
            let length = messages.length;

            for (let i = 0; i < length; i++) {
                let message = messages[i];
                let senderId = message.senderId;
                let position = getPosition(message);

                let blockMessages = $("<div class='" + position + " messages'></div>");

                while (i + 1 < length && position === getPosition(messages[i + 1]) && message.senderName === messages[i + 1].senderName) {
                    position = getPosition(message);
                    let msg = $("<div class='message' id='" + message.id + "'>" + message.content + "</div>");
                    blockMessages.append(msg);
                    message = messages[++i];
                    onMessageClick(msg, message.id);
                }

                let msg = $("<div class='message last' id='" + message.id + "'>" + message.content + "<div class='message-author'>By " + message.senderName + "&nbsp;<span class='reply unselectable'>reply</span></div></div>");
                blockMessages.append(msg);
                onMessageClick(msg, message.id);
                let userAvatar = $("<img class='img-fluid custom-img ml-3vw d-inline-flex va-baseline user-avatar-" + position + "' src='/img/" + userAvatars[senderId] + "' data-toggle='modal' data-target='#upload-image-modal'>");
                blockMessages.append(userAvatar);

                chatWindow.append(blockMessages);
            }
            let chatWindow2 = document.getElementById("chat-window");
            chatWindow2.scrollTop = chatWindow2.scrollHeight;
        }
    });
}

function getPosition(message) {
    let position = "yours";
    if (message.senderId == userId) {
        position = "mine";
    }
    return position;
}

function messageReceive (msg) {
    if (chatId == msg.chatId) {
        printMessages(chatId);
    }
    messageText.focus();
}

function filter(filter, items) {
    for (let item of items) {
        if ($(item).text().toLowerCase().includes(filter.toLowerCase())) {
            $(item).css("display", "block");
        } else {
            $(item).css("display", "none");
        }
    }
}

function getHostname() {
    return document.URL.match(/(https?:\/\/.+?\/)\/?.*/)[1];
}

function prepareMessage() {
    let msg = messageText.val();
    sendMessage(msg, userId, username, chatId);
    messageText.val("");
    localStorage.setItem(chatId, "");
}

function processCheckboxes(checkboxes) {
    let userIds = [];
    for (let checkbox of checkboxes) {
        if ($(checkbox).is(':checked')) {
            userIds.push($(checkbox).data("id"));
            $(checkbox).prop("checked", false);
        }
    }
    return userIds;
}

function onImageErrorWithUploader(img, parent, name, classes = "", type = "") {
    onImageError(
        img,
        parent,
        name,
        classes,
        () => $("#modal-upload-image").data("url", type),
        "data-toggle='modal' data-target='#upload-image-modal'"
    );
}

function onImageError(img, parent, name, classes = "", onClick = () => {}, additionalFunctionality = "") {
    $(img).click(onClick);
    $(img).on("error", () => {
        $(img).remove();
        $(parent).prepend(getErrorReplacement(name, classes, onClick, additionalFunctionality));
    });
}

function getErrorReplacement(name = "A", classes = "", onClick = () => {}, additionalFunctionality = "") {
    let letter = name[0].toUpperCase();
    let backgroundColor = "bg-" + Math.floor(Math.random()*30 + 1);
    let replacement = $("<div class='logo custom-img mr-vw " + backgroundColor + " " + classes + "' " + additionalFunctionality + "><span>" + letter + "</span></div>");
    replacement.click(onClick);
    return replacement;
}

function playSuccessButtonAnimation(button, commonText, successText = "Success", timeout = 1500, commonClass = "btn-warning", successClass = "btn-success") {
    button = $(button);
    button.text(successText);
    button.removeClass(commonClass);
    button.addClass(successClass);
    setTimeout(() => {
        button.text(commonText);
        button.removeClass(successClass);
        button.addClass(commonClass);
    }, timeout);
}

function getUserBlock(user, minimizedImg = false) {
    let name = user.username;
    let userBlock = $(`<div class="block"></div>`);
    let userLink = $(`<div class="d-flex align-items-center"></div>`);
    let userAvatar = $(`<img src="/img/` + user.avatar + `" alt="User avatar" class="img-fluid mr-vw">`);
    let userName = $(`<span class="user-name">` + name + `</span>`);

    let imgClass = minimizedImg ? "custom-img-min": "custom-img";
    userAvatar.addClass(imgClass);

    onImageError(userAvatar, userLink, name, imgClass);

    userLink.append(userAvatar);
    userLink.append(userName);
    userBlock.append(userLink);

    return userBlock;
}

function kickUser(chatId, userId) {
    $.ajax({
        type: 'DELETE',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "chat/" + chatId + "/participant/" + userId,
        async: true,
        cache: false
    });
}

function addUserToInviteModal(contact) {
    let id = contact.id;
    let name = contact.username;
    let chat = localStorage.getItem("currentChat");
    if (chat !== null) {
        let parsedChat = JSON.parse(chat);
        if (parsedChat.moderatorIds.includes(userId + "") && !parsedChat.participantIds.includes(id + "")) {
            let containerInviteToChat = $("#user-invite-user-to-chat-add");
            let userContainer = $("<div class='row m-2 user-modal-invite-to-chat' style='display: flow-root'></div>");
            let userLabel = $("<label for='" + id + "' data-id='" + id + "' class='user-modal-checkbox'></label>");
            let usernameSpan = $("<span>" + name + "</span>");
            let inviteButton = $("<button class='add-contact-button float-right btn-info'>invite</button>")

            inviteButton.click(() => {
                $.ajax({
                    type: 'PUT',
                    beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                    url: getHostname() + "chat/" + parsedChat.chatId + "/participant/" + id,
                    async: true,
                    cache: false,
                });
                playSuccessButtonAnimation(inviteButton, "invite", "invited", 1500, "btn-info");
            });

            userLabel.append(usernameSpan);
            userLabel.append(inviteButton);
            userContainer.append(userLabel);

            containerInviteToChat.append(userContainer);
        }
    }
}

function getUserAvatarBlock(parentBlock) {
    let userAvatar = $("<img class='img-fluid custom-img ml-3vw mb-3vh .usr-avatar' src='/img/" + avatar + "' data-toggle='modal' data-target='#upload-image-modal' />");
    onImageErrorWithUploader(
        userAvatar,
        parentBlock,
        username,
        "",
        "user/" + userId
    );
    $(parentBlock).prepend(userAvatar);
    return $(parentBlock).find("img");
}

function onMessageClick(message, messageId) {
    // $(document).bind("contextmenu", e => {
    //     messageRightClick.css({
    //         position: 'absolute',
    //         left: e.pageX,
    //         top: e.pageY,
    //         display: 'block'
    //     })
    //     return false;
    // });
    $(message).contextmenu((e) => {
        messageRightClick.css({
            position: 'absolute',
            left: e.pageX,
            top: e.pageY,
            display: 'block'
        })
        return false;
    });
}