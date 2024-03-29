package com.savory.savoryAPI.person.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@RequiredArgsConstructor
@SuppressWarnings("unused")
@Entity
@Table (name = "Person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private int id;
    @Column(name = "Username", nullable = false)
    private String username;
    @Column(name = "Email", nullable = false)
    private String email;
    @Column (name = "Img")
    private String img;
    @Column (name = "Bio")
    private String bio;
}
