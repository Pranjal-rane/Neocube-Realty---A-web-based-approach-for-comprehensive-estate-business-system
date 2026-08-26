package com.neocube.realty.controller;

import com.neocube.realty.entity.Customer;
import com.neocube.realty.service.CustomerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public Customer register(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @PostMapping("/login")
    public Customer login(@RequestBody LoginRequest request) {
        return customerService.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}