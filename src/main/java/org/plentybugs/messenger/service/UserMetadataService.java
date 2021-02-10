package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.messaging.Message;

import java.util.List;
import java.util.Set;

public interface UserMetadataService {
    void saveMessages(String userId, Set<String> messageIds);

    void deleteMessages(String userId, Set<String> messageIds);

    List<Message> getSavedMessagesByUserId(String userId);
}
