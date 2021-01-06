package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.enums.ChatStatus;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.messaging.Message;

import java.util.Set;

public interface NotificationService {

    void sendChatNotification(Chat chat, String userId, ChatStatus status);

    void sendMessageNotification(String id, String dest, Message message);

    void sendMessageNotificationInChat(Chat chat, String dest, Message message);

    void sendChatNotificationToAllUsers(Chat chat, Set<String> userIds, ChatStatus status);
}
