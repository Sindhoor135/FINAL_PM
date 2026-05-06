package com.pms.Parcel.Management.Config;

import com.pms.Parcel.Management.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthTokenRepository tokenRepository;

    public AuthInterceptor(AuthTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

    	if("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
    	
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        String token = header.substring(7);

        if (tokenRepository.findByToken(token).isEmpty()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        return true;
    }
}

