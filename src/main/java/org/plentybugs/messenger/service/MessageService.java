package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.messaging.Message;

import java.util.List;
import java.util.Set;

public interface MessageService {

    Message save(Message message);

    List<Message> getByChatId(String chatId);

    Set<Message> findAllByIds(Set<String> savedMessages);
}
