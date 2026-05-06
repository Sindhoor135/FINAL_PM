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
import com.pms.Parcel.Management.service.CustomerService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

	private final CustomerService customerService;

    public CustomerController( CustomerService customerService) {
    		this.customerService = customerService;
    }

    @PostMapping("/book/{userId}")
    public ResponseEntity<?> bookParcel(@PathVariable Long userId,
                             @RequestBody Parcel parcel) {
    	
    	Parcel bookedParcel = customerService.bookParcel(userId, parcel);
    	
    	if( bookedParcel == null ) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND)
    			.body(Map.of("Message","User Not Found"));
    	}
    	else {
    		return ResponseEntity.ok(bookedParcel);
    	}
    }
    
    @PutMapping("/update-status/{trackingNumber}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable String trackingNumber,
                               @PathVariable Parcel.Status status) {
    	
		Parcel updateStatus = customerService.updateStatus(trackingNumber, (Status) status, "remarks");
		if (updateStatus == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User Not Found"));
		}

		return ResponseEntity.ok(updateStatus);
    }
    
    @GetMapping("/track/{pid}")
    public ResponseEntity<?> trackMyParcel(@PathVariable Long pid){
    	
    	Map<Status, String> trackParcel = customerService.trackParcel(pid);
    	if( trackParcel == null || trackParcel.isEmpty()) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND)
    			.body(Map.of("Message","Parcel Not Found"));
    	}
    	else {
    		return ResponseEntity.ok(trackParcel);
    	}
    }
    
    @GetMapping("/my-parcels/{userId}")
    public ResponseEntity<?> myParcels(@PathVariable Long userId) {
    	
    	List<Parcel> parcels = customerService.myParcels(userId);
    	if( parcels == null || parcels.isEmpty()) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND)
    			.body(Map.of("Message","Parcel Not Found"));
    	}
    	else {
    		return ResponseEntity.ok(parcels);
    	}
    }

    @PutMapping("/update-details/{trackingNumber}")
    public ResponseEntity<?> updateParcelDetails(@PathVariable String trackingNumber, @RequestBody Map<String, String> updates) {

    	Parcel updatedParcel = customerService.updateParcelDetails(trackingNumber, updates);
    	
    	if (updatedParcel == null) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Parcel Not Found"));
    	}

    	return ResponseEntity.ok(updatedParcel);
    }
}
