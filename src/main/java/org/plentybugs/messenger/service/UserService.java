package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    boolean register(User user);

    String activate(String code);
}
