package com.pms.Parcel.Management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pms.Parcel.Management.entity.Feedback;
import com.pms.Parcel.Management.entity.Parcel;
import com.pms.Parcel.Management.entity.User;
import com.pms.Parcel.Management.repository.FeedbackRepository;
import com.pms.Parcel.Management.repository.ParcelRepository;
import com.pms.Parcel.Management.repository.UserRepository;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final UserRepository userRepo;
    private final ParcelRepository parcelRepo;

    public FeedbackService(FeedbackRepository feedbackRepo,
                              UserRepository userRepo,
                              ParcelRepository parcelRepo) {
        this.feedbackRepo = feedbackRepo;
        this.userRepo = userRepo;
        this.parcelRepo = parcelRepo;
    }

    // CUSTOMER: submit feedback
    public ResponseEntity<?> submitFeedback( Long userId, String trackingNumber, Feedback feedback) {

        User user = userRepo.findById(userId).orElse(null);
        Parcel parcel = parcelRepo.findByTrackingNumber(trackingNumber)
                .orElse(null);
        
        if( user == null || parcel == null ){
        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Parcel or User not found"));
        }

        if (!parcel.getSender().getId().equals(userId)) {
        	return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("Message", "Not Your Parcel"));
        }

        if (!feedbackRepo.findByParcelId(parcel.getId()).isEmpty()) {
        	return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("Message", "Feedback Already Exists"));
        }

        feedback.setUser(user);
        feedback.setParcel(parcel);
        feedback.setCreatedAt(LocalDateTime.now());

        feedbackRepo.save(feedback);
        
        return ResponseEntity.ok(feedback);
    }

    // CUSTOMER: view own feedback
    public List<Feedback> myFeedbacks( Long userId) {
    	
    	List<Feedback> findByUserId = feedbackRepo.findByUserId(userId);
    	
        if ( findByUserId.isEmpty() ) return null;
        
        return findByUserId;
    }

    // ADMIN: view all feedback
    public List<Feedback> allFeedbacks() {
    	
    	List<Feedback> findAll = feedbackRepo.findAll();
        if ( findAll.isEmpty() ) return null;
        
        return findAll;
    }
}
