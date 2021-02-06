package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.messaging.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.Set;

public interface ChatRepository extends MongoRepository<Chat, String> {

    Chat findByChatId(String chatId);

    Set<Chat> findAllByParticipantIdsContains(String userId);

    Optional<Chat> findPrivateByParticipantIdsAndGroupFalse(Set<String> participantIds);
}