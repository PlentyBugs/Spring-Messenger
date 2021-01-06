package org.plentybugs.messenger.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.plentybugs.messenger.model.User;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class SimpleUser implements Serializable {
    private Long id;
    private String username;

    public static SimpleUser of(User user) {
        return new SimpleUser(user.getId(), user.getUsername());
    }

    public static List<SimpleUser> of(List<User> users) {
        return users.stream().map(SimpleUser::of).collect(Collectors.toList());
    }
}
