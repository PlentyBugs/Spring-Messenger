package org.plentybugs.messenger.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.plentybugs.messenger.model.enums.Role;
import org.plentybugs.messenger.model.interfaces.Imaginable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

@Entity
@Data
@Table(name = "usr")
@NoArgsConstructor
public class User implements UserDetails, Serializable, Imaginable {
    private static final long serialVersionUID = -8401182482189625141L;

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Username mustn't be empty")
    private String username;

    @NotBlank(message = "Password mustn't be empty")
    private String password;

    @Email(message = "Email's format isn't correct")
    @NotBlank(message = "Email mustn't be empty")
    private String email;

    @ElementCollection
    @CollectionTable(name = "contacts", joinColumns = @JoinColumn(name = "follower"))
    @Column(name = "contact")
    private Set<Long> contacts;

    @ElementCollection
    @CollectionTable(name = "contacts", joinColumns = @JoinColumn(name = "contact"))
    @Column(name = "follower")
    private Set<Long> followers;

    @Column(name="avatar_filename", nullable = false)
    private String avatar = "logo.png";

    private boolean active;
    private String activationCode;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "usr_role", joinColumns = @JoinColumn(name = "usr_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive();
    }
}
