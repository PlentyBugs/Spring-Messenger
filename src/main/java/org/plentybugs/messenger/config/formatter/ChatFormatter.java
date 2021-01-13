package org.plentybugs.messenger.config.formatter;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.messaging.Chat;
import org.plentybugs.messenger.repository.ChatRepository;
import org.springframework.format.Formatter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.util.Locale;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class ChatFormatter implements Formatter<Chat> {

    private final ChatRepository repository;
    private final Pattern chatIdPattern = Pattern.compile(".{8}-.{4}-.{4}-.{4}-.{12}");

    @Override
    public Chat parse(String chatId, Locale locale) throws ParseException {
        if (chatIdPattern.matcher(chatId).matches()) {
            Chat chat = repository.findByChatId(chatId);
            if (chat == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            return chat;
        }
        throw new ParseException("Wrong chatId format", -1);
    }

    @Override
    public String print(Chat chat, Locale locale) {
        return null;
    }
}
