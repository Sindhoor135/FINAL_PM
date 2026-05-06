package com.pms.Parcel.Management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.Parcel.Management.entity.Parcel;
import com.pms.Parcel.Management.entity.Parcel.Status;
import com.pms.Parcel.Management.service.AdminService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;

	}

	@PostMapping("/book/{userId}")
	public ResponseEntity<?> bookParcel(@PathVariable Long userId, @RequestBody Parcel parcel) {

		Parcel bookedParcel = adminService.bookParcel(userId, parcel);

		if (bookedParcel == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User Not Found"));
		} else {
			return ResponseEntity.ok(bookedParcel);
		}
	}

	@PutMapping("/update-status/{trackingNumber}/{status}")
	public ResponseEntity<?> updateStatus(@PathVariable String trackingNumber, @PathVariable Parcel.Status status) {

		Parcel updateStatus = adminService.updateStatus(trackingNumber, (Status) status, "remarks");
		if (updateStatus == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User Not Found"));
		}

		return ResponseEntity.ok(updateStatus);
	}

	@PutMapping("/update-timings/{trackingNumber}")
	public ResponseEntity<?> updateTimings(@PathVariable String trackingNumber, @RequestBody Map<String, String> timings) {

		Parcel updateTimings = adminService.updateTimings(trackingNumber, timings.get("pickupTime"), timings.get("dropTime"));
		
		if (updateTimings == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User Not Found"));
		}

		return ResponseEntity.ok(updateTimings);
	}

	@PutMapping("/update-details/{trackingNumber}")
	public ResponseEntity<?> updateParcelDetails(@PathVariable String trackingNumber, @RequestBody Map<String, String> updates) {

		Parcel updatedParcel = adminService.updateParcelDetails(trackingNumber, updates);
		
		if (updatedParcel == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Parcel Not Found"));
		}

		return ResponseEntity.ok(updatedParcel);
	}

	@GetMapping("/all-parcels")
	public ResponseEntity<?> getAllParcels() {
		List<Parcel> allParcels = adminService.getAllParcels();
		
		if (allParcels == null || allParcels.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User Not Found"));
		}

		return ResponseEntity.ok(allParcels);
	}
}
