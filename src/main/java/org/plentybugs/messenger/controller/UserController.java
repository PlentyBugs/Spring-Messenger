package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleUser;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/simple")
    public List<SimpleUser> getSimpleUsers(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) boolean removeFriends
    ) {
        if (removeFriends) {
            return userService.getSimpleUsersWithoutFriends(user);
        }
        return userService.getSimpleUsers();
    }

    @PutMapping("/follow/{contact}")
    public void follow(
            @AuthenticationPrincipal User user,
            @PathVariable User contact
    ) {
        userService.follow(user, contact);
    }

    @GetMapping("/contact")
    public List<ContactNotification> getContacts(
            @AuthenticationPrincipal User user
    ) {
        return userService.getContacts(user);
    }
}
