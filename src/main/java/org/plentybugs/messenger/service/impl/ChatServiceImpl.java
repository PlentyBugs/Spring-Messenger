package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleChat;
import org.plentybugs.messenger.model.enums.ChatStatus;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.repository.ChatRepository;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final NotificationService notificationService;
    private final ChatRepository repository;

    @Override
    public Chat findByChatId(String chatId) {
        return repository.findByChatId(chatId);
    }

    @Override
    public void create(String creatorId, String chatName, Set<String> participantIds) {
        participantIds.add(creatorId);
        Chat chat = Chat.builder()
                .chatId(UUID.randomUUID().toString())
                .chatName(chatName)
                .participantIds(participantIds)
                .moderatorIds(Collections.singleton(creatorId))
                .build();

        repository.save(chat);

        notificationService.sendChatNotificationToAllUsers(chat, participantIds, ChatStatus.ADD);
    }

    @Override
    public Set<SimpleChat> getAllByUserShort(User user) {
        return repository.findAllByParticipantIdsContains(user.getId().toString()).stream().map(SimpleChat::of).collect(Collectors.toSet());
    }

    @Override
    public void checkUser(User user, String chatId) {
        if (!repository.findByChatId(chatId).getParticipantIds().contains(user.getId().toString())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
