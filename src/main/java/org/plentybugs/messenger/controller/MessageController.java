package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.MessageService;
import org.plentybugs.messenger.service.NotificationService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/message/chat/{id}")
    public List<Message> getAllByUser(
            @AuthenticationPrincipal User user,
            @PathVariable("id") String chatId
    ) {
        chatService.checkUser(user, chatId);
        return messageService.getByChatId(chatId);
    }
}
