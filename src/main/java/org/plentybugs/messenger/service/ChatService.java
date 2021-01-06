package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.messaging.Chat;

import java.util.Set;

public interface ChatService {

    Chat findByChatId(String chatId);

    void create(String creatorId, String chatName, Set<String> participantIds);
}
