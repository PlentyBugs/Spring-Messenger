package org.plentybugs.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.User;
import org.plentybugs.messenger.service.UserService;
import org.plentybugs.messenger.util.ValidationUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("/registration")
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final ValidationUtils validationUtils;

    @GetMapping
    public String get() {
        return "registration";
    }

    @PostMapping
    public String register(
            @RequestParam String password2,
            @Valid User user,
            BindingResult bindingResult,
            Model model
    ) {
        boolean passwordsArentEqual = password2 == null || !password2.equals(user.getPassword());
        if (bindingResult.hasErrors() || passwordsArentEqual) {
            if (passwordsArentEqual) {
                model.addAttribute("password2", "Passwords are different");
            }
            model.mergeAttributes(validationUtils.getErrors(bindingResult));
            return "registration";
        }

        if (!userService.register(user)) {
            model.addAttribute("usernameError", "User exists");
            model.addAttribute(user);

            return "registration";
        }

        return "redirect:/login?activate=true";
    }

    @GetMapping("/activate/{code}")
    public String activate(
        Model model,
        @PathVariable String code
    ) {
        model.addAttribute("message", userService.activate(code));
        return "login";
    }
}
