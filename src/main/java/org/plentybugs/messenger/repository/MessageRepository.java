package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.messaging.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatId(String chatId);

    List<Message> findAllById(Set<String> ids);
}
