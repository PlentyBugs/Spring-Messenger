package org.plentybugs.messenger.service;

import java.util.Set;

public interface UserMetadataService {
    void saveMessages(String userId, Set<String> messageIds);

    void deleteMessages(String userId, Set<String> messageIds);
}
