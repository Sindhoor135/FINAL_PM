package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);
		
	

}
