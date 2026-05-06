package com.pms.Parcel.Management.controller;

import com.pms.Parcel.Management.entity.Feedback;
import com.pms.Parcel.Management.service.FeedbackService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // CUSTOMER: submit feedback
    @PostMapping("/submit/{userId}/{trackingNumber}")
    public ResponseEntity<?> submitFeedback(@PathVariable Long userId,
                                   @PathVariable String trackingNumber,
                                   @RequestBody Feedback feedback) {

        
        return feedbackService.submitFeedback(userId, trackingNumber, feedback);
    }

    // CUSTOMER: view own feedback
    @GetMapping("/my-feedback/{userId}")
    public ResponseEntity<?> myFeedback(@PathVariable Long userId) {
    	
    	
        List<Feedback> myFeedbacks = feedbackService.myFeedbacks(userId);
        
        if(myFeedbacks == null)
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("Message", "No Feedbacks Given"));
        
        return ResponseEntity.ok(myFeedbacks);
        
    }

    // ADMIN: view all feedback
    @GetMapping("/all")
    public ResponseEntity<?> allFeedbacks() {
        List<Feedback> allFeedbacks = feedbackService.allFeedbacks();
        
        if(allFeedbacks == null)
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of("Message", "No Feedbacks Given"));
        
        return ResponseEntity.ok(allFeedbacks);
    }
}
