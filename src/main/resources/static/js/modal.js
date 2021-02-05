let savedMessagesModal = $("#modal-saved-messages");

$(() => {
    savedMessagesModal.on("shown.bs.modal", () => {
        let messages = getSavedMessages();
        let savedMessagesModalBody = savedMessagesModal.find("#modal-body-saved-messages");
        savedMessagesModalBody.empty();
        messages.forEach(message => {
            let messageBlock = $("<div class='saved-message mb-1vh'>" + message.content + "<br/>By " + message.senderName + "</div>")
            savedMessagesModalBody.append(messageBlock);
        });
    });
})