package org.plentybugs.messenger.service;

public interface MailService {
    void send(String emailTo, String subject, String message);
}
