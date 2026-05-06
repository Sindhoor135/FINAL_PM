package com.pms.Parcel.Management.entity;

import jakarta.persistence.*;

@Entity
@Table(name="users")

public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Long id;
	private String fullName;
	
	@Column(unique = true)
	private String email;
	
	
	private String passwordHash;
	
	private String mobile;
	private String address;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	public enum Role{
		CUSTOMER,
		ADMIN
	}
	
	
	
	public User() {
		
	}
	
	
	
	public User(String fullName, String email, String passwordHash, String mobile, String address, Role role) {
		super();
		this.fullName = fullName;
		this.email = email;
		this.passwordHash = passwordHash;
		this.mobile = mobile;
		this.address = address;
		this.role = role;
	}



	public Long getId() { return id;}
	public void setId(Long id ) {
		this.id=id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	
	

	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public Role getRole() { return role;}
	public void setRole(Role role ) {
		this.role=role;
		
	}
	
	
	

}
