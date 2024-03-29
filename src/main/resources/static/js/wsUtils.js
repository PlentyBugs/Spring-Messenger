let stompClient = null;
let token = data.data('token');
let header = data.data('header');

function connect() {
    let userId = data.data("user-id");
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
        stompClient.subscribe("/user/" + userId + "/queue/messages", function (message) {
            messageReceive(JSON.parse(message.body));
        });
        stompClient.subscribe("/user/" + userId + "/queue/chats", function (chat) {
            addChatToSideBar(JSON.parse(chat.body));
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

function sendMessage(message) {
    stompClient.send("/app/chat/" + chatId, {}, JSON.stringify(message));
}

function buildAndSendMessage(msg, senderId, senderName, chatId, repliedMessages) {
    if (senderId !== "" && msg.replaceAll(/\s+/g, "") !== "") {
        msg = msg.replaceAll(/\s+/g, " ");
        const message = {
            content: msg,
            chatId: chatId,
            senderId: senderId,
            senderName: senderName,
            repliedTo: repliedMessages,
            time: new Date()
        };
        sendMessage(message, senderId);
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