package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.repository.MessageRepository;
import org.plentybugs.messenger.service.MessageService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
}
