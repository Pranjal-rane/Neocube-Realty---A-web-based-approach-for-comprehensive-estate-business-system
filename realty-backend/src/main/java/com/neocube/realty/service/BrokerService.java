package com.neocube.realty.service;

import com.neocube.realty.entity.Broker;
import com.neocube.realty.entity.BrokerStatus;
import com.neocube.realty.repository.BrokerRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrokerService {

    private final BrokerRepository brokerRepository;

    public BrokerService(BrokerRepository brokerRepository) {
        this.brokerRepository = brokerRepository;
    }

    public List<Broker> getAllBrokers() {
        return brokerRepository.findAll();
    }

    public Optional<Broker> getBrokerById(Long id) {
        return brokerRepository.findById(id);
    }

    public Optional<Broker> getBrokerByEmail(String email) {
        return brokerRepository.findByEmail(email);
    }

    public Optional<Broker> getBrokerByCode(String brokerCode) {
        return brokerRepository.findByBrokerCode(brokerCode);
    }

    public Broker saveBroker(Broker broker) {

        if (brokerRepository.existsByEmail(broker.getEmail())) {
            throw new RuntimeException("Broker with this email already exists");
        }

        if (brokerRepository.existsByBrokerCode(broker.getBrokerCode())) {
            throw new RuntimeException("Broker with this broker code already exists");
        }

        if (broker.getStatus() == null) {
            broker.setStatus(BrokerStatus.ACTIVE);
        }

        return brokerRepository.save(broker);
    }

    public Optional<Broker> updateBroker(Long id, Broker broker) {

        Optional<Broker> existingBroker = brokerRepository.findById(id);

        if (existingBroker.isEmpty()) {
            return Optional.empty();
        }

        Broker existing = existingBroker.get();

        existing.setBrokerCode(broker.getBrokerCode());
        existing.setFullName(broker.getFullName());
        existing.setEmail(broker.getEmail());
        existing.setPhone(broker.getPhone());
        existing.setPasswordHash(broker.getPasswordHash());

        if (broker.getStatus() != null) {
            existing.setStatus(broker.getStatus());
        }

        return Optional.of(brokerRepository.save(existing));
    }

    public boolean deleteBroker(Long id) {

        if (!brokerRepository.existsById(id)) {
            return false;
        }

        brokerRepository.deleteById(id);
        return true;
    }
}