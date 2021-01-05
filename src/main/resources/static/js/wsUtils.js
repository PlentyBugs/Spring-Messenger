let stompClient = null;

function connect() {
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe("/user/" + userId + "/queue/messages", function (message) {

        });
        stompClient.subscribe("/user/" + userId + "/queue/chats", function (chat) {

        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    console.log("disconnected")
}

$(() => connect());