package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.messaging.Message;

public interface MessageService {

    Message save(Message message);
}
