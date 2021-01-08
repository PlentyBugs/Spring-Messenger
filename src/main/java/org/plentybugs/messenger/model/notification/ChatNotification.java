package org.plentybugs.messenger.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.plentybugs.messenger.model.enums.ChatStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification {
    private String chatId;
    private String chatLogo;
    private String chatName;
    private String recipientId;
    private ChatStatus status;
}
