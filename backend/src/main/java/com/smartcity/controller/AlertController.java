package com.smartcity.controller;

import com.smartcity.dto.AlertResponse;
import com.smartcity.entity.Alert;
import com.smartcity.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService service;

    public AlertController(AlertService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getActive() {
        return ResponseEntity.ok(service.getActive());
    }

    @PostMapping
    public ResponseEntity<AlertResponse> create(@RequestBody Alert alert) {
        return ResponseEntity.ok(service.create(alert));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> dismiss(@PathVariable Long id) {
        service.dismiss(id);
        return ResponseEntity.noContent().build();
    }
}
