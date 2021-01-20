package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleUser;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.service.ImageService;
import org.plentybugs.messenger.service.UserService;
import org.plentybugs.messenger.util.ValidationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ImageService imageService;
    private final ValidationUtils validationUtils;

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

    @PutMapping("/{id}/image")
    public void updateAvatar(
            @AuthenticationPrincipal User user,
            @PathVariable("id") User target,
            @RequestParam(value = "x", required = false) Integer x,
            @RequestParam(value = "y", required = false) Integer y,
            @RequestParam(value = "width", required = false) Integer width,
            @RequestParam(value = "height", required = false) Integer height,
            @RequestParam("avatar") MultipartFile logo
    ) throws IOException {
        if (!user.getId().equals(target.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        imageService.cropAndUpdateLogo(target, logo, x, y, width, height);
        userService.updateUser(target);
    }

    @PutMapping("/{targetId}")
    public Map<String, String> updateUser(
            @AuthenticationPrincipal User user,
            @PathVariable("targetId") User target,
            @RequestParam(required = false) String passwordRepeat,
            @Valid User body,
            BindingResult bindingResult
    ) {
        if (!user.getId().equals(target.getId()) || !user.getId().equals(body.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        Map<String, String> errors = validationUtils.getErrors(bindingResult);

        if (errors.isEmpty()) {
            userService.updateUserUEP(target, body, passwordRepeat, errors);
        }

        return errors;
    }
}
