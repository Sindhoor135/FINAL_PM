package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.AuthToken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long>{
	Optional<AuthToken> findByToken(String token);
	AuthToken findByUserId(Long uid);

}
