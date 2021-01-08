package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.messaging.Message;

import java.util.List;

public interface MessageService {

    Message save(Message message);

    List<Message> getByChatId(String chatId);
}
