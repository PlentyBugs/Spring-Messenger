package org.plentybugs.messenger.repository;

import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    User findByActivationCode(String code);

    @Query("from User u where :userId not member of u.followers and u.id <> :userId")
    List<User> findAllNonFriends(Long userId);

    @Query("select new org.plentybugs.messenger.model.notification.ContactNotification(u.id, u.username, u.avatar) from User u where :userId member of u.followers")
    List<ContactNotification> findAllContactsShort(Long userId);
}
