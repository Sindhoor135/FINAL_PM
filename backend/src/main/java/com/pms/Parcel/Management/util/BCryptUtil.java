package com.pms.Parcel.Management.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptUtil {
	private static final BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
	
	public static String hash(String password) {
		return encoder.encode(password);
	}
	
	public static boolean match(String rawPassword, String hashedPassword) {
		return encoder.matches(rawPassword, hashedPassword);
	}

}
