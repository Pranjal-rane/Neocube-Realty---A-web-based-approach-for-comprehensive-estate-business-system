package com.neocube.realty.repository;

import com.neocube.realty.entity.Broker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrokerRepository extends JpaRepository<Broker, Long> {

    Optional<Broker> findByEmail(String email);

    Optional<Broker> findByBrokerCode(String brokerCode);

    boolean existsByEmail(String email);

    boolean existsByBrokerCode(String brokerCode);
}