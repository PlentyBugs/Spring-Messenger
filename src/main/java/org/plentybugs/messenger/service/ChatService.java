package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleChat;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.notification.ContactNotification;

import java.util.Set;

public interface ChatService {

    Chat findByChatId(String chatId);

    void create(String creatorId, String chatName, Set<String> participantIds);

    Set<SimpleChat> getAllByUserShort(User user);

    void checkUser(User user, String chatId);

    Set<ContactNotification> getParticipants(Chat chat);

    void inviteUser(Chat chat, String userId);
}
