package com.pms.Parcel.Management.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMapinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.pms.Parcel.Management.entity.Parcel;
import com.pms.Parcel.Management.entity.ParcelStatusHistory;
import com.pms.Parcel.Management.entity.User;
import com.pms.Parcel.Management.repository.ParcelRepository;
import com.pms.Parcel.Management.repository.ParcelStatusHistoryRepository;
import com.pms.Parcel.Management.repository.UserRepository;

@Service
public class CustomerService {

	private final UserRepository userRepo;
	private final ParcelRepository parcelRepo;
	private final ParcelStatusHistoryRepository historyRepo;

	CustomerService(UserRepository userRepo, ParcelRepository parcelRepo, ParcelStatusHistoryRepository historyRepo) {
		this.userRepo = userRepo;
		this.parcelRepo = parcelRepo;
		this.historyRepo = historyRepo;
	}

	public Parcel bookParcel(Long userId, Parcel parcel) {

		User user = userRepo.findById(userId).orElse(null);
		if (user == null)
			return null;

		System.out.println("my user: " + user);

		parcel.setSender(user);
		if(parcel.getSender().getRole() == User.Role.CUSTOMER)
			parcel.setSenderName( user.getFullName()); 
		parcel.setTrackingNumber("TRK" + System.currentTimeMillis());
		parcel.setStatus(Parcel.Status.PENDING);
		parcel.setCreatedAt(LocalDateTime.now());

		System.out.println("my parcel: " + parcel);
		
		parcelRepo.save(parcel);

		ParcelStatusHistory history = new ParcelStatusHistory();
		history.setParcel(parcel);
		history.setStatus(parcel.getStatus());
		history.setNotes("remarks");
		history.setUpdatedAt(LocalDateTime.now());

		historyRepo.save(history);

		return parcel;
	}

	public Parcel updateStatus(String trackingNumber, Parcel.Status status, String notes) {

		Parcel parcel = parcelRepo.findByTrackingNumber(trackingNumber).orElse(null);
		if (parcel == null)
			return null;

		parcel.setStatus(status);
		parcel.setUpdatedAt(LocalDateTime.now());

		parcelRepo.save(parcel);
		
        ParcelStatusHistory history = new ParcelStatusHistory();
        history.setParcel(parcel);
        history.setStatus(parcel.getStatus());
        history.setNotes("remarks");
        history.setUpdatedAt(LocalDateTime.now());

        historyRepo.save(history);
		
		return parcel;
	}

	public List<Parcel> myParcels(Long userId) {

		List<Parcel> findBySenderId = parcelRepo.findBySenderId(userId);
		if (findBySenderId.isEmpty())
			return null;
		return findBySenderId;
	}

	public Map<Parcel.Status, String> trackParcel(Long pid) {

		List<ParcelStatusHistory> parcelStatus = historyRepo.findByParcelIdOrderByUpdatedAtAsc(pid);

		if (parcelStatus.isEmpty())
			return null;

		Map<Parcel.Status, String> tracking = new LinkedHashMap<>();

		for (ParcelStatusHistory hist : parcelStatus) {
			tracking.put(hist.getStatus(), hist.getUpdatedAt().toString());
		}

		return tracking;
	}

	/**
	 * Update parcel details based on status restrictions
	 * - If status is BOOKED: allow editing pickup date and delivery address
	 * - If status is not BOOKED: allow editing sender/receiver details and mobile numbers
	 * - Cannot edit address if status is not BOOKED
	 * - Cannot edit if status is CANCELLED or DELIVERED
	 */
	public Parcel updateParcelDetails(String trackingNumber, Map<String, String> updates) {
		Parcel parcel = parcelRepo.findByTrackingNumber(trackingNumber).orElse(null);
		if (parcel == null) return null;

		// Check if parcel status is CANCELLED or DELIVERED
		if (parcel.getStatus() == Parcel.Status.CANCELLED || parcel.getStatus() == Parcel.Status.DELIVERED) {
			return null; // Cannot edit if status is CANCELLED or DELIVERED
		}

		// If status is BOOKED, allow editing pickup date and delivery address
		if (parcel.getStatus() == Parcel.Status.BOOKED) {
			if (updates.containsKey("pickupDate")) {
				parcel.setPickupTime(updates.get("pickupDate"));
			}
			if (updates.containsKey("deliveryAddress")) {
				parcel.setDeliveryAddress(updates.get("deliveryAddress"));
			}
		} else {
			// If status is not BOOKED, allow editing sender/receiver details and mobile numbers
			// Cannot edit address
			if (updates.containsKey("senderName")) {
				parcel.setSenderName(updates.get("senderName"));
			}
			if (updates.containsKey("senderMobile") && parcel.getSender() != null) {
				parcel.getSender().setMobile(updates.get("senderMobile"));
			}
			if (updates.containsKey("receiverName")) {
				parcel.setReceiverName(updates.get("receiverName"));
			}
			if (updates.containsKey("receiverMobile")) {
				parcel.setReceiverMobile(updates.get("receiverMobile"));
			}
		}

		parcel.setUpdatedAt(LocalDateTime.now());
		return parcelRepo.save(parcel);
	}
}
