package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.MessageService;
import org.plentybugs.messenger.service.NotificationService;
import org.plentybugs.messenger.service.UserMetadataService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final UserMetadataService userMetaDataService;
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

    @PutMapping("/message/user/{userId}")
    public void saveMessagesToUserMetadata(
            @AuthenticationPrincipal User user,
            @PathVariable String userId,
            @RequestBody Set<String> messageIds
    ) {
        if (!user.getId().toString().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        userMetaDataService.saveMessages(userId, messageIds);
    }

    @DeleteMapping("/message/user/{userId}")
    public void deleteMessagesFromUserMetadata(
            @AuthenticationPrincipal User user,
            @PathVariable String userId,
            @RequestBody Set<String> messageIds
    ) {
        if (!user.getId().toString().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        userMetaDataService.deleteMessages(userId, messageIds);
    }
}
