package com.example.backend.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.User;
import com.example.backend.entities.documents;

public interface fileService {

    public documents uploadFile(User user,MultipartFile file);

    public documents getFile(User user,Long id);

    public List<documents> getAllFiles(User user);

    public String deleteFile(User user, Long id);

}
