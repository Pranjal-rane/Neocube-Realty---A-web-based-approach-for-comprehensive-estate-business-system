package com.neocube.realty.service;

import com.neocube.realty.entity.Commission;
import com.neocube.realty.repository.CommissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommissionService {

    private final CommissionRepository commissionRepository;

    public CommissionService(CommissionRepository commissionRepository) {
        this.commissionRepository = commissionRepository;
    }

    public Commission createCommission(Commission commission) {
        return commissionRepository.save(commission);
    }

    public List<Commission> getAllCommissions() {
        return commissionRepository.findAll();
    }

    public Optional<Commission> getCommissionById(Long id) {
        return commissionRepository.findById(id);
    }

    public Optional<Commission> getCommissionByDealId(Long dealId) {
        return commissionRepository.findByDealId(dealId);
    }

    public List<Commission> getCommissionsByBrokerId(Long brokerId) {
        return commissionRepository.findByBrokerId(brokerId);
    }

    public List<Commission> getCommissionsByBrokerAndStatus(
            Long brokerId, String status) {
        return commissionRepository.findByBrokerIdAndStatus(brokerId, status);
    }

    public Commission updateCommission(Long id, Commission updatedCommission) {
        return commissionRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(updatedCommission.getStatus());
                    existing.setCommissionAmount(
                            updatedCommission.getCommissionAmount()
                    );
                    return commissionRepository.save(existing);
                })
                .orElseThrow(() ->
                        new RuntimeException("Commission not found with id: " + id)
                );
    }

    public void deleteCommission(Long id) {
        commissionRepository.deleteById(id);
    }
}
