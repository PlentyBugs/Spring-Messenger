package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.enums.ChatStatus;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.model.notification.ChatNotification;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.model.notification.MessageNotification;
import org.plentybugs.messenger.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendChatNotification(Chat chat, String userId, ChatStatus status) {
        messagingTemplate.convertAndSendToUser(
                userId, "/queue/chats",
                new ChatNotification(
                        chat.getChatId(),
                        chat.getAvatar(),
                        chat.getChatName(),
                        userId,
                        status
                )
        );
    }

    @Override
    public void sendContactNotification(Long userId, User contact) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(), "/queue/contacts",
                ContactNotification.of(contact)
        );
    }

    @Override
    public void sendMessageNotification(String id, String dest, Message message) {
        messagingTemplate.convertAndSendToUser(
                id, dest, MessageNotification.of(message)
        );
    }

    @Override
    public void sendMessageNotificationInChat(Chat chat, String dest, Message message) {
        chat.getParticipantIds().forEach(id -> sendMessageNotification(id, "/queue/messages", message));
    }

    @Override
    public void sendChatNotificationToAllUsers(Chat chat, Set<String> userIds, ChatStatus status) {
        userIds.forEach(id -> sendChatNotification(chat, id, ChatStatus.ADD));
    }
}
