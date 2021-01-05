package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.messaging.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatId(String chatId);
}
