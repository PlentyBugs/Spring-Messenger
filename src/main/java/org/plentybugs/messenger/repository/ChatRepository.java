package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.messaging.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRepository extends MongoRepository<Chat, String> {

    Chat findByChatId(String chatId);
}
