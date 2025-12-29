package com.project.paymentservice.web;

import com.project.paymentservice.dtos.PaymentRequest;
import com.project.paymentservice.dtos.PaymentResponse;
import com.project.paymentservice.repositories.PaymentRepository;
import com.project.paymentservice.service.PaymentBusinessService;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentBusinessService paymentBusinessService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentBusinessService paymentBusinessService,
                             PaymentRepository paymentRepository) {
        this.paymentBusinessService = paymentBusinessService;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    public PaymentResponse pay(@RequestBody PaymentRequest req) {
        return paymentBusinessService.pay(req.getReservationId());
    }

    @GetMapping("/user/{userId}")
    public java.util.List<PaymentResponse> byUser(@PathVariable Long userId) {
        return paymentRepository.findByUserId(userId).stream().map(p -> {
            PaymentResponse r = new PaymentResponse();
            r.setId(p.getId());
            r.setReservationId(p.getReservationId());
            r.setTotalAmount(p.getTotalAmount());
            r.setStatus(p.getStatus());
            r.setCreatedAt(p.getCreatedAt());
            return r;
        }).collect(Collectors.toList());
    }
}
