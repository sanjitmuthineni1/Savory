package com.savory.savoryAPI.authorization;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.jwt.*;
import java.util.List;

public class AuthVerifier {
    @Value("${auth0.namespace}")
    private String namespace;
    @Value("${auth0.domain}")
    private String domain;

    private final JwtDecoder decoder;

    public AuthVerifier(String issuer) {
        this.decoder = NimbusJwtDecoder.withJwkSetUri(issuer).build();
    }

    public Jwt validateJwtToken(String token) throws JwtException {
        return decoder.decode(token);
    }

    public String getEmail(Jwt jwt) {
        if(jwt == null) return "";
        return jwt.getClaimAsString(namespace+"email");
    }

    public String getRoles(Jwt jwt) {
        if(jwt == null) return "";
        return jwt.getClaimAsString(namespace+"roles");
    }

    public String getIssuer(Jwt jwt) {
        if(jwt == null) return "";
        return jwt.getClaimAsString("iss");
    }

    public Authentication getAuthentication(String token) {
        Jwt jwt = validateJwtToken(token);
        String email = getEmail(jwt), roles = getRoles(jwt), iss = getIssuer(jwt);
        if(email.isEmpty() || !iss.equals(domain)) return null;
        if(roles.isEmpty()) roles = "ANONYMOUS";
        List<String> rolesList = List.of(roles);
        List<SimpleGrantedAuthority> authorities = rolesList.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
        User principal = new User(email, "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}