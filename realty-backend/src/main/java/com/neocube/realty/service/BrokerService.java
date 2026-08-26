package com.neocube.realty.service;

import com.neocube.realty.entity.Broker;
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
        return brokerRepository.save(broker);
    }

    public Broker updateBroker(Broker broker) {
        return brokerRepository.save(broker);
    }

    public void deleteBroker(Long id) {
        brokerRepository.deleteById(id);
    }
}