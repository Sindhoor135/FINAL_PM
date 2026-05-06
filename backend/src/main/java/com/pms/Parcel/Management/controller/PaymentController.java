package com.pms.Parcel.Management.controller;

import com.pms.Parcel.Management.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay/{parcelId}")
    public ResponseEntity<?> makePayment(@PathVariable Long parcelId,
                               @RequestBody Map<String, String> req) {

        return paymentService.makePayment(parcelId, req);
    }

    @GetMapping("/status/{parcelId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long parcelId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(parcelId));
    }

}
