package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleChat;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

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
    ) {
        if (chat.getParticipantIds().contains(user.getId().toString())) {
            return chat;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
}
