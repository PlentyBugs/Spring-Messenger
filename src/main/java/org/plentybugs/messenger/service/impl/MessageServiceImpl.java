package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.repository.MessageRepository;
import org.plentybugs.messenger.service.MessageService;
import org.plentybugs.messenger.model.messaging.Message;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository repository;

    @Override
    public Message save(Message message) {
        return repository.save(message);
    }
}
