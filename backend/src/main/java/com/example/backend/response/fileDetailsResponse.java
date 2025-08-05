package com.example.backend.response;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class fileDetailsResponse {
    

    private Long id;
    private String fileName;
    private Date uploadDate;
    private Long fileSize;
    private MultipartFile file;
    private String message;
}
