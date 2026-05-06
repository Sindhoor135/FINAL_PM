package com.pms.Parcel.Management.service;

import com.pms.Parcel.Management.entity.AuthToken;
import com.pms.Parcel.Management.entity.User;
import com.pms.Parcel.Management.repository.AuthTokenRepository;
import com.pms.Parcel.Management.repository.UserRepository;
import com.pms.Parcel.Management.util.BCryptUtil;

import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final AuthTokenRepository tokenRepo;

    public AuthService(UserRepository userRepo, AuthTokenRepository tokenRepo) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
    }
    
    public User register(User user) {
    	
    	User u = userRepo.findByEmail( user.getEmail() ).orElse(null);
    	if (u != null ) return null;
    	
        user.setPasswordHash(BCryptUtil.hash(user.getPasswordHash()));
        return userRepo.save(user);
    }

    public Map<String,String> login(String email, String password) {

    	User user = userRepo.findByEmail(email).orElse(null);
    	if (user == null ) return null;

        if (!BCryptUtil.match(password, user.getPasswordHash())) {
            //throw new RuntimeException("Invalid credentials");
        	return null;
        }
        AuthToken temp = tokenRepo.findByUserId(user.getId());
        if(temp != null) {
        	tokenRepo.delete(temp);
        }

        String tokenValue = UUID.randomUUID().toString();

        AuthToken token = new AuthToken();
        token.setToken(tokenValue);
        token.setUser(user);
        token.setCreatedAt(LocalDateTime.now());
        tokenRepo.save(token);

        return Map.of(
                "token", tokenValue,
                "role", user.getRole().name(),
                "userId", user.getId().toString(),
                "userName", user.getFullName()
        );
    }
    
    public Map<String, String> logout(String header) {

        String token = header.substring(7); // Bearer xxx
        Optional<AuthToken> byToken = tokenRepo.findByToken(token);
        
        if(byToken.isEmpty()) return null; 
        
        tokenRepo.findByToken(token).ifPresent(tokenRepo::delete);

        return Map.of("message","Logged out successfully");
    }
    
    public User getUserByToken( String token) {
		
		Optional<AuthToken> byToken = tokenRepo.findByToken(token);
		
		User u = byToken.get().getUser();
		
		return u;
}
}

