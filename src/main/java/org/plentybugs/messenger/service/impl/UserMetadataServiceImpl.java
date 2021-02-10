package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.messaging.Message;
import org.plentybugs.messenger.model.messaging.UserMetadata;
import org.plentybugs.messenger.repository.UserMetadataRepository;
import org.plentybugs.messenger.service.MessageService;
import org.plentybugs.messenger.service.UserMetadataService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserMetadataServiceImpl implements UserMetadataService {

    private final UserMetadataRepository repository;
    private final MessageService messageService;

    @Override
    public void saveMessages(String userId, Set<String> messageIds) {
        Optional<UserMetadata> userMetadataOptional = repository.findById(userId);
        UserMetadata userMetadata;
        if (userMetadataOptional.isEmpty()) {
            userMetadata = new UserMetadata(userId, messageIds);
        } else {
            userMetadata = userMetadataOptional.get();
            userMetadata.getSavedMessages().addAll(messageIds);
        }
        repository.save(userMetadata);
    }

    @Override
    public void deleteMessages(String userId, Set<String> messageIds) {
        Optional<UserMetadata> userMetadataOptional = repository.findById(userId);
        if (userMetadataOptional.isPresent()) {
            UserMetadata userMetadata = userMetadataOptional.get();
            userMetadata.getSavedMessages().removeAll(messageIds);
            repository.save(userMetadata);
        }
    }

    @Override
    public List<Message> getSavedMessagesByUserId(String userId) {
        return messageService.findAllByIds(
                repository
                        .findById(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND))
                        .getSavedMessages()
        );
    }
}
