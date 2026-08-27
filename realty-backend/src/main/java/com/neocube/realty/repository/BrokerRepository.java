package com.neocube.realty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Broker;

public interface BrokerRepository extends JpaRepository<Broker, Long> {

    Optional<Broker> findByEmail(String email);

    Optional<Broker> findByBrokerCode(String brokerCode);

    boolean existsByEmail(String email);

    boolean existsByBrokerCode(String brokerCode);

    List<Broker> findByStatusOrderByBrokerIdAsc(String status);
}