
package com.pms.Parcel.Management.repository;

import com.pms.Parcel.Management.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUserId(Long userId);

    List<Feedback> findByParcelId(Long parcelId);
}


