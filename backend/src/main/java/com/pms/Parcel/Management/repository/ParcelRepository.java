package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ParcelRepository extends JpaRepository<Parcel, Long>{
	Optional<Parcel> findByTrackingNumber(String trackingNumber);
	List<Parcel> findBySenderId(Long senderId);

}
