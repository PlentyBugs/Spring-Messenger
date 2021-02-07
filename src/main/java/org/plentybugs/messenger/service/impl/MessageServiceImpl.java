package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.repository.MessageRepository;
import org.plentybugs.messenger.service.MessageService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository repository;

    @Override
    public Message save(Message message) {
        return repository.save(message);
    }

    @Override
    public List<Message> getByChatId(String chatId) {
        return repository.findByChatId(chatId);
    }

    @Override
    public Set<Message> findAllByIds(Set<String> savedMessages) {
        Set<Message> messages = new HashSet<>();
        repository.findAllById(savedMessages).forEach(messages::add);
        return messages;
    }

    @Override
    public Set<String> deleteMessagesWithUserCheck(Set<String> messageIds, User user) {
        String userId = user.getId().toString();
        Set<Message> toDelete = StreamSupport
                .stream(repository.findAllById(messageIds).spliterator(), false)
                .filter(message -> message.getSenderId().equals(userId))
                .collect(Collectors.toSet());

        repository.deleteAll(toDelete);
        return toDelete.stream().map(Message::getId).collect(Collectors.toSet());
    }
}
