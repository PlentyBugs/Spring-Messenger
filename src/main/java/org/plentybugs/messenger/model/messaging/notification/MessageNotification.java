package org.plentybugs.messenger.model.messaging.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.plentybugs.messenger.model.messaging.Message;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageNotification {
    private String id;
    private String chatId;
    private String senderId;
    private String senderName;

    public static MessageNotification of(Message savedMessage) {
        return MessageNotification.builder()
                .id(savedMessage.getId())
                .chatId(savedMessage.getChatId())
                .senderId(savedMessage.getSenderId())
                .senderName(savedMessage.getSenderName())
                .build();
    }
}
