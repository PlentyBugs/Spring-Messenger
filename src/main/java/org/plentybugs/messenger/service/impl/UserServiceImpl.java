package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.model.dto.SimpleUser;
import org.plentybugs.messenger.model.enums.Role;
import org.plentybugs.messenger.model.notification.ContactNotification;
import org.plentybugs.messenger.repository.UserRepository;
import org.plentybugs.messenger.service.ChatService;
import org.plentybugs.messenger.service.MailService;
import org.plentybugs.messenger.service.NotificationService;
import org.plentybugs.messenger.service.UserService;
import org.plentybugs.messenger.util.SecurityUtils;
import org.plentybugs.messenger.util.support.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;
    private final UserRepository repository;
    private final ChatService chatService;
    private final MailService mailService;

    @Value("${hostname}")
    private String hostname;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public boolean register(User user) {
        if (repository.findByUsername(user.getUsername()).isPresent()) {
            return false;
        }

        user.setActive(false);
        user.setActivationCode(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));

        repository.save(user);

        sendMessage(user);

        return true;
    }

    @Override
    public String activate(String code) {
        User user = repository.findByActivationCode(code);
        if (user == null) {
            return "Activation code is not found";
        }

        user.setActive(true);
        user.setActivationCode(null);

        repository.save(user);

        return "User successfully activated";
    }

    @Override
    public List<SimpleUser> getSimpleUsers() {
        List<User> users = repository.findAll();
        return SimpleUser.of(users);
    }

    @Override
    public List<SimpleUser> getSimpleUsersWithoutFriends(User user) {
        List<User> users = repository.findAllNonFriends(user.getId());
        return SimpleUser.of(users);
    }

    @Override
    @Transactional
    public void follow(User user, User contact) {
        String id = user.getId().toString();
        User fromDB = repository.findById(user.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        fromDB.getContacts().add(contact.getId());

        repository.save(fromDB);

        Set<String> participantIds = new HashSet<>();
        participantIds.add(id);
        participantIds.add(contact.getId().toString());

        chatService.create(id, user.getUsername() + "/" + contact.getUsername(), participantIds);

        notificationService.sendContactNotification(user.getId(), contact);
    }

    @Override
    public List<ContactNotification> getContacts(User user) {
        return repository.findAllContactsShort(user.getId());
    }

    @Override
    public Set<ContactNotification> getUsersById(Set<Long> ids) {
        return repository.findAllById(ids);
    }

    @Override
    public void updateUser(User user) {
        repository.save(user);
        securityUtils.updateContext(user);
    }

    @Override
    public Map<Long, String> getAvatars(List<Long> userIds) {
        return repository.findAllAvatarsById(userIds).stream().collect(Collectors.toMap(Pair::getKey, Pair::getValue));
    }

    @Override
    public void updateUserUEP(User target, User body, String passwordRepeat, Map<String, String> errors) {

        if (passwordRepeat == null) {
            errors.put("passwordRepeatError", "Repeated Password can't be empty");
            return;
        }

        if (!BCrypt.checkpw(passwordRepeat, target.getPassword()) && !passwordRepeat.equals(body.getPassword())) {
            errors.put("passwordRepeatError", "Passwords aren't equal");
            return;
        }

        String targetUsername = target.getUsername();
        String bodyUsername = body.getUsername();
        if (!bodyUsername.equals(targetUsername)) {
            if (repository.findByUsername(bodyUsername).isPresent()) {
                errors.put("usernameError", "A User with the same username already exists");
                return;
            } else {
                target.setUsername(bodyUsername);
            }
        }
        target.setEmail(body.getEmail());
        target.setPassword(passwordEncoder.encode(body.getPassword()));
        updateUser(target);
    }

    private void sendMessage(User user) {
        if (user.getEmail() != null && !user.getEmail().equals("")) {
            String message = String.format(
                            "Hello, %s! \n" +
                            "Welcome to my messenger!" +
                            " Please, visit next link to activate your account: http://%s/registration/activate/%s",
                    user.getUsername(),
                    hostname,
                    user.getActivationCode()
            );
            mailService.send(user.getEmail(), "Activation Code", message);
        }
    }
}
