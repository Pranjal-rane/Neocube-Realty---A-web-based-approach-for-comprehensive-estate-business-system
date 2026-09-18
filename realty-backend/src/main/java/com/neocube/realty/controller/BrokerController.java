package com.neocube.realty.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neocube.realty.entity.Broker;
import com.neocube.realty.service.BrokerService;

@RestController
@RequestMapping("/api/brokers")
public class BrokerController {

    private final BrokerService brokerService;

    public BrokerController(BrokerService brokerService) {
        this.brokerService = brokerService;
    }

    @GetMapping
    public List<Broker> getAllBrokers() {
        return brokerService.getAllBrokers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Broker> getBrokerById(
            @PathVariable Long id) {

        return brokerService.getBrokerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Broker> getBrokerByEmail(
            @PathVariable String email) {

        return brokerService.getBrokerByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{brokerCode}")
    public ResponseEntity<Broker> getBrokerByCode(
            @PathVariable String brokerCode) {

        return brokerService.getBrokerByCode(brokerCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Broker createBroker(
            @RequestBody Broker broker) {

        return brokerService.saveBroker(broker);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Broker> updateBroker(
            @PathVariable Long id,
            @RequestBody Broker broker) {

        return brokerService.getBrokerById(id)
                .map(existing -> {
                    broker.setBrokerId(id);
                    return ResponseEntity.ok(brokerService.updateBroker(broker));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBroker(
            @PathVariable Long id) {

        if (brokerService.getBrokerById(id).isPresent()) {
            brokerService.deleteBroker(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}