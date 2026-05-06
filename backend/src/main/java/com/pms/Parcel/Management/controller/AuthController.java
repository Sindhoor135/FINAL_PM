package com.pms.Parcel.Management.controller;

import com.pms.Parcel.Management.entity.*;

import com.pms.Parcel.Management.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController( AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        
    	User registered = authService.register(user);
        
		if (registered == null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("Message", "User Already Exists"));
		} else {
			return ResponseEntity.ok( registered );
		}
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

    	Map<String, String> login = authService.login(req.get("email"), req.get("password"));
    	
        if(login == null)
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        			.body(Map.of("Message", "Invalid email or password"));
        
        return ResponseEntity.ok( login );
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String header) {

    	Map<String, String> logout = authService.logout(header);
    	
        if ( logout == null )
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        			.body(Map.of("Message", "Invalid email or password"));
        
        return ResponseEntity.ok( logout );
    }
    
    @GetMapping("getUserByToken/{token}")
    public User getUserByToken(@PathVariable String token) {
    		
    		return authService.getUserByToken(token);
    }
}
