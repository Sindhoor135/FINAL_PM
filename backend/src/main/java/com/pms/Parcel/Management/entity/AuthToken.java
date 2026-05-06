package com.pms.Parcel.Management.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name="auth_tokens")

public class AuthToken {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//@Column(unique = true)
	private String token;
	
	@OneToOne
	private User user;
	
	private LocalDateTime createdAt ;
	
	//getter and setters 
	
	public Long getId() { return id;}
	public void setId(Long id ) {
		this.id=id;
	}
	
	public String getToken() { return token;}
	public void setToken(String token) {
		this.token=token;
	}
	
	public User getUser() { return user;}
	public void setUser(User user) {
		this.user=user;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

}
