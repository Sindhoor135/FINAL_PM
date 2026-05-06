package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByParcelId(Long parcelId);
}
