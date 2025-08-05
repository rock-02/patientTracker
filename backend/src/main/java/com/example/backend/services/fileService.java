package com.example.backend.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.documents;

public interface fileService {

    public documents uploadFile(MultipartFile file);

    public documents getFile(Long id);

    public List<documents> getAllFiles();

    public String deleteFile(Long id);

}
