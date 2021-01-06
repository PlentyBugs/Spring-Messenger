package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.MessageService;
import org.plentybugs.messenger.service.NotificationService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final NotificationService notificationService;
    private final MessageService messageService;
    private final ChatService chatService;

    @MessageMapping("/chat/{chatId}")
    public void processMessage(@Payload Message message, @DestinationVariable String chatId) {
        message.setChatId(chatId);

        Message savedMessage = messageService.save(message);

        Chat chat = chatService.findByChatId(chatId);

        notificationService.sendMessageNotificationInChat(chat, "/queue/messages", savedMessage);
    }
}
