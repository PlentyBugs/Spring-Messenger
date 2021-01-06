let stompClient = null;
let data = $('#data');
let token = data.data('token');
let header = data.data('header');

function connect() {
    let userId = data.data("usrId");
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
        stompClient.subscribe("/user/" + userId + "/queue/messages", function (message) {
            console.log(message);
            console.log(message.chatId);
        });
        stompClient.subscribe("/user/" + userId + "/queue/chats", function (chat) {
            console.log(chat);
            console.log(chat.chatId);
        });
        stompClient.subscribe("/user/" + userId + "/queue/contacts", function (contact) {
            addContactToSideBar(JSON.parse(contact.body));
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    console.log("disconnected")
}

function sendMessage(msg, senderId, senderName, chatId) {
    if (senderId !== "" && msg.replaceAll(/\s+/g, "") !== "") {
        msg = msg.replaceAll(/\s+/g, " ");
        const message = {
            content: msg,
            chatId: chatId,
            senderId: senderId,
            senderName: senderName,
            time: new Date()
        };
        stompClient.send("/app/chat/" + chatId, {}, JSON.stringify(message));
    }
}

function createChat(chatName, userId, userIds) {
    $.ajax({
        type: 'POST',
        url: getHostname() + "chat/?userId=" + userId + "&chatName=" + JSON.stringify(chatName),
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userIds),
        cache: false,
        async: true
    });
}

$(() => connect());