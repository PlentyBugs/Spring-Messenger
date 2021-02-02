package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.messaging.UserMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserMetadataRepository extends MongoRepository<UserMetadata, String> {}
