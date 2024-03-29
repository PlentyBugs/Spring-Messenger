package org.plentybugs.messenger.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.plentybugs.messenger.model.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactNotification {
    private Long id;
    private String username;
    private String avatar;

    public static ContactNotification of(User user) {
        return new ContactNotification(
                user.getId(),
                user.getUsername(),
                user.getAvatar()
        );
    }
}
