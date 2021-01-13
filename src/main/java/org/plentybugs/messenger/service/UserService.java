package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleUser;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Set;

public interface UserService extends UserDetailsService {

    boolean register(User user);

    String activate(String code);

    List<SimpleUser> getSimpleUsers();

    List<SimpleUser> getSimpleUsersWithoutFriends(User user);

    void follow(User user, User contact);

    List<ContactNotification> getContacts(User user);

    Set<ContactNotification> getUsersById(Set<Long> ids);
}
