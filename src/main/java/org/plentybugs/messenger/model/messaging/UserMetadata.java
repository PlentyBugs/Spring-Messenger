package org.plentybugs.messenger.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Set;

@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
public class UserMetadata {
    @Id
    private String id; // userId

    private Set<String> savedMessages;
}

