let data = $('#data');
let userId = data.data("user-id");
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

$(() => {

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

    if (localStorage.getItem("currentChat") !== null) {
        loadChat(JSON.parse(localStorage.getItem("currentChat")));
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

    let menu = $("#origin-menu");
    let settingsMenuToggle = $(".settings-menu-toggle");
    let contactMenuToggle = $(".contacts-menu-toggle");
    let contactMenu = $("#contact-menu");
    let settingsMenu = $("#settings-menu");

    for (let cmt of contactMenuToggle) {
        $(cmt).click(() => {
            menu.toggleClass("d-none");
            contactMenu.toggleClass("d-none");
        });
    }

    for (let smt of settingsMenuToggle) {
        $(smt).click(() => {
            menu.toggleClass("d-none");
            settingsMenu.toggleClass("d-none");
        });
    }

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

    let userAvatar = $("<img class='img-fluid custom-img ml-3vw mb-3vh' src='/img/" + avatar + "' />")
    onImageError(userAvatar, sideContent, username, "ml-3vw mb-3vh");
    sideContent.prepend(userAvatar);
});

function addChatToSideBar(chat) {
    let name = chat.chatName;
    let id = chat.chatId;

    let chatBlock = $(`<li class="block"></li>`);
    let chatLink = $(`<a href="#" class="d-flex align-items-center"></a>`);
    let chatImage = $(`<img src="/img/` + chat.chatLogo + `" alt="Image" class="img-fluid custom-img mr-vw">`);
    let chatName = $(`<span class="user-name">` + name + `</span>`);

    onImageError(chatImage, chatLink, name);

    chatLink.append(chatImage);
    chatLink.append(chatName);
    chatBlock.append(chatLink);

    chatBlock.click(() => {
        $.ajax({
            type: 'GET',
            beforeSend: (xhr) => xhr.setRequestHeader(header, token),
            url: getHostname() + "chat/" + id,
            async: false,
            cache: false,
            success: (fullChat) => loadChat(fullChat)
        });
    });

    chatList.prepend(chatBlock);
}

function loadChat(chat) {
    console.log(chat);
    let name = chat.chatName;
    let id = chat.chatId;
    let logo = chat.chatLogo;
    chatNameHeader.text(name);
    cacheMessageText(id);
    chatId = id;
    printMessages();
    localStorage.setItem("currentChat", JSON.stringify(chat));

    let chatMenu = $("#chat-menu-content");
    chatMenu.empty();
    let chatLogo = $("<img class='img-fluid custom-img ml-3vw mb-3vh' src='/img/" + logo + "' />")
    onImageError(chatLogo, chatMenu, name, "ml-3vw mb-3vh");
    chatMenu.prepend(chatLogo);
}

function addContactToSideBar(contact) {
    let contactUsername = contact.contactUsername;

    let contactBlock = $("<li class='block'></li>");
    let link = $("<a href='#' class='d-flex align-items-center'></a>");
    let img = $("<img src='/img/" + contact.contactAvatarFilename + "' alt='Image' class='img-fluid custom-img mr-vw'>");
    let userName = $("<span class='user-name'>" + contactUsername + "</span>");
    onImageError(img, link, contactUsername);

    link.append(img);
    link.append(userName);
    contactBlock.append(link);

    contactList.prepend(contactBlock);
}

function addContactToChatCreatingBar(contact) {
    let contactUsername = contact.contactUsername;
    let id = contact.contactId;

    let contactBlock = $("<div class='row m-2 user-modal checkbox-list-box' style='display: flow-root'></div>");
    let label = $("<label for='contact-" + id + "' data-id='" + userId + "' class='user-modal-checkbox'></label>");
    let img = $("<img src='/img/" + contact.contactAvatarFilename + "' alt='Image' class='img-fluid custom-img custom-img-checkbox-list mr-vw'>");
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
                let position = getPosition(message);

                let blockMessages = $("<div class='" + position + " messages'></div>");

                while (i + 1 < length && position === getPosition(messages[i + 1]) && message.senderName === messages[i + 1].senderName) {
                    position = getPosition(message);
                    blockMessages.append($("<div class='message'>" + message.content + "</div>"));
                    message = messages[++i];
                }

                blockMessages.append($("<div class='message last'>" + message.content + "<div class='message-author'>By " + message.senderName + "</div></div>"));

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

function onImageError(img, parent, name, classes = "") {
    $(img).on("error", () => {
        $(img).remove();
        $(parent).prepend(getErrorReplacement(name, classes));
    });
}

function getErrorReplacement(name = "A", classes = "") {
    let letter = name[0].toUpperCase();
    let backgroundColor = "bg-" + Math.floor(Math.random()*30 + 1);
    return $("<div class='logo custom-img mr-vw " + backgroundColor + " " + classes + "'><span>" + letter + "</span></div>");
}