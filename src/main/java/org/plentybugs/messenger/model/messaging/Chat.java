package org.plentybugs.messenger.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Chat {
    @Id
    private String id;
    private String chatId;
    private String chatName;
    private Set<String> moderatorIds;
    private Set<String> participantIds;
}