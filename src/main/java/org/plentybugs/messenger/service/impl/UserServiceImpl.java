package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.repository.UserRepository;
import org.plentybugs.messenger.service.MailService;
import org.plentybugs.messenger.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${hostname}")
    private String hostname;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username);
    }

    @Override
    public boolean register(User user) {
        User userFromDB = repository.findByUsername(user.getUsername());
        if (userFromDB != null) {
            return false;
        }

        user.setActive(false);
        user.setActivationCode(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

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
