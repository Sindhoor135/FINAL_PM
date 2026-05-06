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


		if (paymentRepo.findByParcelId(parcelId).isPresent()) {
        	return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("Message", "Payment already done for this parcel"));
		}

		boolean success = validatePayment(req);

		if (!success) {
			throw new RuntimeException("Payment failed");
		}

		Payment payment = new Payment();
		payment.setParcel(parcel);
		payment.setAmount(parcel.getCost());
		payment.setPaymentMethod(req.get("method"));
		payment.setSuccess(true);
		payment.setPaidAt(LocalDateTime.now());

		parcel.setStatus(Parcel.Status.BOOKED);
		

        ParcelStatusHistory history = new ParcelStatusHistory();
        history.setParcel(parcel);
        history.setStatus(parcel.getStatus());
        history.setNotes("remarks");
        history.setUpdatedAt(LocalDateTime.now());

        historyRepo.save(history);
        


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
}
