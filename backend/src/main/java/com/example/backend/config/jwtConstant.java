
package com.example.backend.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Base64;

public class jwtConstant {
    public static SecretKey JWT_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String JWT_SECRET = Base64.getEncoder().encodeToString(JWT_SECRET_KEY.getEncoded());

    public static String JWT_HEADER = "Authorization";
}
