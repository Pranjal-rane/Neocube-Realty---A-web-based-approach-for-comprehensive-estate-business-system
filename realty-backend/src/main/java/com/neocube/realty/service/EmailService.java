package com.neocube.realty.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("NeoCube Realty - Email Verification OTP");

        message.setText(
            "Welcome to NeoCube Realty!\n\n" +
            "Your email verification OTP is: " + otp + "\n\n" +
            "This OTP will expire in 10 minutes.\n\n" +
            "If you did not request this verification, please ignore this email.\n\n" +
            "NeoCube Realty"
        );

        mailSender.send(message);
    }
}