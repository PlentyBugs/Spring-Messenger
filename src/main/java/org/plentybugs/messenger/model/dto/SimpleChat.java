package org.plentybugs.messenger.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.plentybugs.messenger.model.messaging.Chat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpleChat {
    private String chatId;
    private String chatLogo;
    private String chatName;

    public static SimpleChat of(Chat chat) {
        return new SimpleChat(
                chat.getChatId(),
                chat.getAvatar(),
                chat.getChatName()
        );
    }
}
