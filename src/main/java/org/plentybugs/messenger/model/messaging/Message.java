package org.plentybugs.messenger.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Message {
    @Id
    private String id;
    private String chatId;
    private String content;
    private String senderId;
    private String senderName;
    private Set<String> repliedTo;
    private Date time;
}
