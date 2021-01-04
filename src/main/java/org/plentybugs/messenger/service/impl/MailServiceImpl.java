package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.service.MailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String username;

    @Override
    @Async
    public void send(String emailTo, String subject, String message) {
        SimpleMailMessage smm = new SimpleMailMessage();

        smm.setFrom(username);
        smm.setTo(emailTo);
        smm.setSubject(subject);
        smm.setText(message);

        mailSender.send(smm);
    }
}
