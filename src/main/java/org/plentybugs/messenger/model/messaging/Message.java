package org.plentybugs.messenger.model.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Message {
    private String id;
    private String chatId;
    private String senderId;
    private String senderName;
    private LocalDateTime time;
}
