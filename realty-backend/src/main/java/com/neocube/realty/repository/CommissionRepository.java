package com.neocube.realty.repository;

import com.neocube.realty.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommissionRepository extends JpaRepository<Commission, Long> {

    List<Commission> findByBrokerId(Long brokerId);

    Optional<Commission> findByDealId(Long dealId);

    List<Commission> findByBrokerIdAndStatus(Long brokerId, String status);
}
