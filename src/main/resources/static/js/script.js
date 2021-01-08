let data = $('#data');
let userId = data.data("user-id");
let username = data.data("user-username");
let contactList = $("#contact-list");
let chatList = $("#chat-list");
let chatNameHeader = $("#chat-name");
let messageText = $("#message-text");
let sendButton = $("#send-button");
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
});

function addChatToSideBar(chat) {
    let name = chat.chatName;
    let id = chat.chatId;

    let chatBlock = $(`<li class="block"></li>`);
    let chatLink = $(`<a href="#" class="d-flex align-items-center"></a>`);
    let chatImage = $(`<img src="/img/` + chat.chatLogo + `" alt="Image" class="img-fluid mr-vw">`);
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
    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "message/chat/" + id,
        async: false,
        cache: false,
        success: (messages) => {
            chatNameHeader.text(name);
            cacheMessageText(id);
            chatId = id;
            printChatWindow(messages)
            localStorage.setItem("currentChatName", name);
            localStorage.setItem("currentChatId", id);
        }
    });
}

function addContactToSideBar(contact) {
    let contactBlock = $(`
        <li class="block">
            <a href="#" class="d-flex align-items-center">
                <img src="/img/` + contact.contactAvatarFilename + `" alt="Image" class="img-fluid mr-vw" onerror="this.onerror = null; this.src= + /img/logo.png">
                <span class="user-name">` + contact.contactUsername + `</span>
            </a>
        </li>
    `)
    contactList.prepend(contactBlock);
}

function cacheMessageText(id) {
    localStorage.setItem(chatId, messageText.val())
    if (localStorage.getItem(id) !== null) {
        messageText.val(localStorage.getItem(id));
    } else {
        messageText.val("");
    }
}

function printChatWindow(messages) {
    console.log(messages);
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