package com.pms.Parcel.Management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name="parcels")
public class Parcel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private String trackingNumber;
	
	@ManyToOne
	private User sender;
	
	private String senderName;
	
	private String receiverName;
	private String receiverMobile;
	private String deliveryAddress; 
	
	private Double weight;
	private String deliveryType;
	private String packingType;
	private Double cost;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	private String pickupTime;
	private String dropTime;
	
	public enum Status{
		PENDING,
		BOOKED,
		PICKED_UP,
		IN_TRANSIT,
		OUT_FOR_DELIVERY,
		DELIVERED,
		CANCELLED
	}
	
	
	
	public Parcel() {
	}
	
	
	
	public Parcel(String trackingNumber, User sender, String senderName, String receiverName, String receiverMobile,
			String deliveryAddress, Double weight, String deliveryType, String packingType, Double cost, Status status,
			LocalDateTime createdAt, LocalDateTime updatedAt, String pickupTime, String dropTime ) {
		
		this.trackingNumber = trackingNumber;
		this.sender = sender;
		this.senderName = senderName;
		this.receiverName = receiverName;
		this.receiverMobile = receiverMobile;
		this.deliveryAddress = deliveryAddress;
		this.weight = weight;
		this.deliveryType = deliveryType;
		this.packingType = packingType;
		this.cost = cost;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.pickupTime = pickupTime;
		this.dropTime = dropTime;
		
	}
	public Long getId() {
		return id;
	}



	public User getSender() {
		return sender;
	}
	public void setSender(User sender) {
		this.sender=sender;
	}
	public String getTrackingNumber() {
		return trackingNumber;
	}
	public void setTrackingNumber(String trackingNumber) {
		this.trackingNumber=trackingNumber;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}



	public String getReceiverName() {
		return receiverName;
	}

	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}

	public String getReceiverMobile() {
		return receiverMobile;
	}

	public void setReceiverMobile(String receiverMobile) {
		this.receiverMobile = receiverMobile;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getDeliveryType() {
		return deliveryType;
	}

	public void setDeliveryType(String deliveryType) {
		this.deliveryType = deliveryType;
	}

	public String getPackingType() {
		return packingType;
	}

	public void setPackingType(String packingType) {
		this.packingType = packingType;
	}

	public Double getCost() {
		return cost;
	}

	public void setCost(Double cost) {
		this.cost = cost;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status=status;
	}
	
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getPickupTime() {
		return pickupTime;
	}

	public void setPickupTime(String pickupTime) {
		this.pickupTime = pickupTime;
	}

	public String getDropTime() {
		return dropTime;
	}

	public void setDropTime(String dropTime) {
		this.dropTime = dropTime;
	}



	@Override
	public String toString() {
		return "Parcel [id=" + id + ", trackingNumber=" + trackingNumber + ", sender=" + sender + ", senderName="
				+ senderName + ", receiverName=" + receiverName + ", receiverMobile=" + receiverMobile
				+ ", deliveryAddress=" + deliveryAddress + ", weight=" + weight + ", deliveryType=" + deliveryType
				+ ", packingType=" + packingType + ", cost=" + cost + ", status=" + status + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + ", pickupTime=" + pickupTime + ", dropTime=" + dropTime + "]";
	}

	
	
}
