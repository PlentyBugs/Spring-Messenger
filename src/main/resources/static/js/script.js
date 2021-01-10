let data = $('#data');
let userId = data.data("user-id");
let username = data.data("user-username");
let contactList = $("#contact-list");
let chatList = $("#chat-list");
let chatNameHeader = $("#chat-name");
let messageText = $("#message-text");
let sendButton = $("#send-button");
let chatWindow = $("#chat-window");
let contactListChatCreating = $("#contact-list-chat-creating");
let chatId = "-1";

$(() => {

    if (localStorage.getItem("currentChatId") !== null) {
        loadChat(localStorage.getItem("currentChatName"), localStorage.getItem("currentChatId"));
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
            createChat(chatName, userId, [userId]);
        } else {
            createChatError.text(chatName === "" ? "Chat name can't be empty": "Chat name's too long");
            createChatName.addClass("error-input");
        }
    });
});

function addChatToSideBar(chat) {
    let name = chat.chatName;
    let id = chat.chatId;

    let chatBlock = $(`<li class="block"></li>`);
    let chatLink = $(`<a href="#" class="d-flex align-items-center"></a>`);
    let chatImage = $(`<img src="/img/` + chat.chatLogo + `" alt="Image" class="img-fluid custom-img mr-vw">`);
    let chatName = $(`<span class="user-name">` + name + `</span>`);

    chatImage.on("error", () => chatImage.attr("src", "/img/logo.png"));

    chatLink.append(chatImage);
    chatLink.append(chatName);
    chatBlock.append(chatLink);

    chatBlock.click(() => {
        loadChat(name, id);
    });

    chatList.prepend(chatBlock);
}

function loadChat(name, id) {
    chatNameHeader.text(name);
    cacheMessageText(id);
    chatId = id;
    printMessages();
    localStorage.setItem("currentChatName", name);
    localStorage.setItem("currentChatId", id);
}

function addContactToSideBar(contact) {
    let contactBlock = $(`
        <li class="block">
            <a href="#" class="d-flex align-items-center">
                <img src="/img/` + contact.contactAvatarFilename + `" alt="Image" class="img-fluid custom-img mr-vw" onerror="this.onerror = null; this.src= + /img/logo.png">
                <span class="user-name">` + contact.contactUsername + `</span>
            </a>
        </li>
    `)
    contactList.prepend(contactBlock);
}

function addContactToChatCreatingBar(contact) {
    let id = contact.contactId;
    let contactBlock = $(`
        <div class='row m-2 user-modal checkbox-list-box' style='display: flow-root'>
            <label for='contact-` + id + `' data-id='` + userId + `' class='user-modal-checkbox'>
                <img src="/img/` + contact.contactAvatarFilename + `" alt="Image" class="img-fluid custom-img custom-img-checkbox-list mr-vw" onerror="this.onerror = null; this.src= + /img/logo.png">
                <span>` + contact.contactUsername + `</span>
                <input type='checkbox' id='contact-` + id + `' data-contact-id='` + id + `' class='user-modal-checkbox d-none' />
                <span class='user-modal-checkbox-mark'></span>
            </label>
        </div>
    `);
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

                let blockMessages = $("<div class='" + position + " messages'></div>")

                while (i + 1 < length && position === getPosition(messages[i + 1])) {
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