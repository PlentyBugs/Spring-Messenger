package org.plentybugs.messenger.service.impl;

import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleChat;
import org.plentybugs.messenger.model.enums.ChatStatus;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.repository.ChatRepository;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.NotificationService;
import org.plentybugs.messenger.service.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final NotificationService notificationService;
    private final ChatRepository repository;
    private final UserService userService;

    public ChatServiceImpl(NotificationService notificationService, ChatRepository repository, @Lazy UserService userService) {
        this.notificationService = notificationService;
        this.repository = repository;
        this.userService = userService;
    }

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

    @Override
    public Set<ContactNotification> getParticipants(Chat chat) {
        return userService.getUsersById(chat.getParticipantIds().stream().map(Long::parseLong).collect(Collectors.toSet()));
    }

    @Override
    public void inviteUser(Chat chat, String userId) {
        chat.getParticipantIds().add(userId);
        repository.save(chat);
    }
}
