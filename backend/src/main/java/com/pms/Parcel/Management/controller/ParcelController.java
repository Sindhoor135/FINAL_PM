package com.pms.Parcel.Management.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.Parcel.Management.entity.Parcel;
import com.pms.Parcel.Management.service.AdminService;
import com.pms.Parcel.Management.service.CustomerService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/parcel")
public class ParcelController {

	private final AdminService adminService;
	private final CustomerService customerService;

	public ParcelController(AdminService adminService, CustomerService customerService) {
		this.adminService = adminService;
		this.customerService = customerService;
	}

	@PutMapping("/update-details/{trackingNumber}")
	public ResponseEntity<?> updateParcelDetails(@PathVariable String trackingNumber, @RequestBody Map<String, String> updates) {

		// Try to update via admin service first
		Parcel updatedParcel = adminService.updateParcelDetails(trackingNumber, updates);
		
		// If not found or not updateable, try customer service
		if (updatedParcel == null) {
			updatedParcel = customerService.updateParcelDetails(trackingNumber, updates);
		}
		
		if (updatedParcel == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Parcel Not Found or Cannot be updated"));
		}

		return ResponseEntity.ok(updatedParcel);
	}
}
