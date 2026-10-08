package com.neocube.realty.controller;

import com.neocube.realty.entity.Commission;
import com.neocube.realty.service.CommissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@CrossOrigin(origins = "*")
public class CommissionController {

    private final CommissionService commissionService;

    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @PostMapping
    public ResponseEntity<Commission> createCommission(
            @RequestBody Commission commission) {
        return ResponseEntity.ok(
                commissionService.createCommission(commission)
        );
    }

    @GetMapping
    public ResponseEntity<List<Commission>> getAllCommissions() {
        return ResponseEntity.ok(
                commissionService.getAllCommissions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commission> getCommissionById(
            @PathVariable Long id) {
        return commissionService.getCommissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<Commission> getCommissionByDealId(
            @PathVariable Long dealId) {
        return commissionService.getCommissionByDealId(dealId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<Commission>> getCommissionsByBrokerId(
            @PathVariable Long brokerId) {
        return ResponseEntity.ok(
                commissionService.getCommissionsByBrokerId(brokerId)
        );
    }

    @GetMapping("/broker/{brokerId}/status/{status}")
    public ResponseEntity<List<Commission>> getCommissionsByBrokerAndStatus(
            @PathVariable Long brokerId,
            @PathVariable String status) {
        return ResponseEntity.ok(
                commissionService.getCommissionsByBrokerAndStatus(
                        brokerId, status
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commission> updateCommission(
            @PathVariable Long id,
            @RequestBody Commission commission) {
        try {
            return ResponseEntity.ok(
                    commissionService.updateCommission(id, commission)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommission(
            @PathVariable Long id) {
        commissionService.deleteCommission(id);
        return ResponseEntity.noContent().build();
    }
}
