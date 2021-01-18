package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleChat;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ImageService imageService;

    @Async
    @PostMapping
    public void create(
            @AuthenticationPrincipal User user,
            @RequestParam String userId,
            @RequestParam String chatName,
            @RequestBody Set<String> userIds
    ) {
        if (!user.getId().toString().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        chatService.create(userId, chatName.substring(1, chatName.length() - 1), userIds);
    }

    @GetMapping
    public Set<SimpleChat> getAllByUser(
            @AuthenticationPrincipal User user
    ) {
        return chatService.getAllByUserShort(user);
    }

    @GetMapping("/{id}")
    public Chat getChatById(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Chat chat
    ) throws ResponseStatusException {
        if (chat.getParticipantIds().contains(user.getId().toString())) {
            return chat;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    @GetMapping("/{id}/participant")
    public Set<ContactNotification> getParticipants(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Chat chat
    ) throws ResponseStatusException {
        if (chat.getParticipantIds().contains(user.getId().toString())) {
            return chatService.getParticipants(chat);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    @GetMapping("/{id}/participant/avatar")
    public Map<Long, String> getParticipantAvatars(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Chat chat
    ) throws ResponseStatusException {
        if (chat.getParticipantIds().contains(user.getId().toString())) {
            return chatService.getParticipantAvatars(chat);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    @Async
    @PutMapping("/{id}/participant/{userId}")
    public void inviteUser(
            @AuthenticationPrincipal User admin,
            @PathVariable("id") Chat chat,
            @PathVariable String userId
    ) throws ResponseStatusException {
        if (!chat.getModeratorIds().contains(admin.getId().toString())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        chatService.inviteUser(chat, userId);
    }

    @Async
    @DeleteMapping("/{id}/participant/{userId}")
    public void kickUser(
            @AuthenticationPrincipal User admin,
            @PathVariable("id") Chat chat,
            @PathVariable String userId
    ) throws ResponseStatusException {
        if (!chat.getModeratorIds().contains(admin.getId().toString())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        chatService.kickUser(chat, userId);
    }

    @PutMapping("/{id}/image")
    public void updateLogo(
        @AuthenticationPrincipal User user,
        @PathVariable("id") Chat chat,
        @RequestParam(value = "x", required = false) Integer x,
        @RequestParam(value = "y", required = false) Integer y,
        @RequestParam(value = "width", required = false) Integer width,
        @RequestParam(value = "height", required = false) Integer height,
        @RequestParam("avatar") MultipartFile logo
    ) throws IOException {
        if (!chat.getModeratorIds().contains(user.getId().toString())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        imageService.cropAndUpdateLogo(chat, logo, x, y, width, height);
        chatService.updateChat(chat);
    }
}
