package org.plentybugs.messenger.config.formatter;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.repository.UserRepository;
import org.springframework.format.Formatter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserFormatter implements Formatter<User> {

    private final UserRepository repository;

    @Override
    public User parse(String s, Locale locale) throws ResponseStatusException {
        if (s.length() > 32 || !s.matches("\\d+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        Optional<User> optionalUser = repository.findById(Long.parseLong(s));
        return optionalUser.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public String print(User user, Locale locale) {
        return user.getUsername();
    }
}