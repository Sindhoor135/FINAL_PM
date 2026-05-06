package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.ParcelStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParcelStatusHistoryRepository
        extends JpaRepository<ParcelStatusHistory, Long> {

    List<ParcelStatusHistory> findByParcelIdOrderByUpdatedAtAsc(Long parcelId);
}
