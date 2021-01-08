package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.repository.MessageRepository;
import org.plentybugs.messenger.service.MessageService;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
