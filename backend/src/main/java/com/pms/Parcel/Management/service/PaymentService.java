package com.pms.Parcel.Management.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pms.Parcel.Management.entity.Parcel;
import com.pms.Parcel.Management.entity.ParcelStatusHistory;
import com.pms.Parcel.Management.entity.Payment;
import com.pms.Parcel.Management.repository.ParcelRepository;
import com.pms.Parcel.Management.repository.ParcelStatusHistoryRepository;
import com.pms.Parcel.Management.repository.PaymentRepository;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepo;
	private final ParcelRepository parcelRepo;
	private final ParcelStatusHistoryRepository historyRepo;

	public PaymentService(PaymentRepository paymentRepo,
			ParcelRepository parcelRepo,
			ParcelStatusHistoryRepository historyRepo
			) {
		this.paymentRepo = paymentRepo;
		this.parcelRepo = parcelRepo;
		this.historyRepo = historyRepo;
	}

	public ResponseEntity<?> makePayment(Long parcelId, Map<String, String> req) {

		Parcel parcel = parcelRepo.findById(parcelId).orElse(null);
		if(parcel == null) 
        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Parcel not Found."));

		boolean success = validatePayment(req);

		if (!success) {
			throw new RuntimeException("Payment failed");
		}

		// Check if payment already exists
		var existingPayment = paymentRepo.findByParcelId(parcelId);
		Payment payment;

		if (existingPayment.isPresent()) {
			// Update existing payment
			payment = existingPayment.get();
			payment.setStatus("COMPLETED");
			payment.setSuccess(true);
			payment.setPaidAt(LocalDateTime.now());
		} else {
			// Create new payment
			payment = new Payment();
			payment.setParcel(parcel);
			payment.setAmount(parcel.getCost());
			payment.setPaymentMethod(req.get("method"));
			payment.setSuccess(true);
			payment.setStatus("COMPLETED");
			payment.setPaidAt(LocalDateTime.now());
		}

		// Update parcel status and payment due
		parcel.setStatus(Parcel.Status.BOOKED);
		parcel.setPaymentDue(0.0);  // Payment is complete

        ParcelStatusHistory history = new ParcelStatusHistory();
        history.setParcel(parcel);
        history.setStatus(parcel.getStatus());
        history.setNotes("Payment completed - Parcel booked");
        history.setUpdatedAt(LocalDateTime.now());

        historyRepo.save(history);
        parcelRepo.save(parcel);
		paymentRepo.save(payment);
		
		return ResponseEntity.ok(payment);

	}

	private boolean validatePayment(Map<String, String> req) {

//		String method = req.get("method");
//
//		if ("CREDIT".equals(method)) {
//			return "4111111111111111".equals(req.get("number")) && "123".equals(req.get("cvv"))
//					&& "12/26".equals(req.get("expiry"));
//		}
//
//		if ("DEBIT".equals(method)) {
//			return "5222222222222222".equals(req.get("number")) && "456".equals(req.get("cvv"))
//					&& "11/27".equals(req.get("expiry"));
//		}
//
//		if ("UPI".equals(method)) {
//			return "test@upi".equals(req.get("upiId"));
//		}
//
//		return false;
		return true;
	}

	/**
	 * Get payment status for a parcel
	 * Returns payment due amount based on payment status
	 */
	public Map<String, Object> getPaymentStatus(Long parcelId) {
		Parcel parcel = parcelRepo.findById(parcelId).orElse(null);
		if (parcel == null) {
			return new java.util.HashMap<>(Map.of("error", "Parcel not found"));
		}

		var paymentOpt = paymentRepo.findByParcelId(parcelId);
		double paymentDue = parcel.getCost() != null ? parcel.getCost() : 0.0;

		if (paymentOpt.isPresent()) {
			Payment payment = paymentOpt.get();
			if ("COMPLETED".equals(payment.getStatus()) || (payment.isSuccess() != null && payment.isSuccess())) {
				paymentDue = 0.0;  // Payment is complete
			} else {
				paymentDue = parcel.getCost() != null ? parcel.getCost() : 0.0;
			}
		}

		// Update parcel paymentDue field
		parcel.setPaymentDue(paymentDue);
		parcelRepo.save(parcel);

		// Use HashMap to handle potential null values
		Map<String, Object> response = new java.util.HashMap<>();
		response.put("parcelId", parcelId);
		response.put("trackingNumber", parcel.getTrackingNumber() != null ? parcel.getTrackingNumber() : "N/A");
		response.put("cost", parcel.getCost() != null ? parcel.getCost() : 0.0);
		response.put("paymentDue", paymentDue);
		response.put("paymentStatus", paymentOpt.isPresent() && paymentOpt.get().getStatus() != null ? paymentOpt.get().getStatus() : "NO_PAYMENT");
		response.put("status", parcel.getStatus() != null ? parcel.getStatus().toString() : "PENDING");
		
		return response;
	}
}
