package com.savory.savoryAPI.person.dto;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class PersonDto {
    long id;
    String username;
    String email;
    String password;
    String img;
    String bio;
    boolean isAdmin;
}