package com.example.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.User;
import com.example.backend.entities.documents;
import com.example.backend.repositories.fileRepository;

@Service
public class fileServiceImpl implements fileService {

    @Autowired
    private fileRepository fileRepository;

    // Use "uploads" not "uploads/" to avoid double slashes
    private static final String UPLOAD_DIR = "uploads";

    @Override
    public documents uploadFile(User user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file uploaded or file is empty");
        }
        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        try {
            Path uploadPath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            file.transferTo(filePath.toFile());

            // Save file details to database
            documents fileDetail = new documents();
            fileDetail.setFileName(file.getOriginalFilename());
            fileDetail.setUploadDate(new Date());
            fileDetail.setFileSize(file.getSize());
            fileDetail.setUser(user); // Associate the file with the use
            return fileRepository.save(fileDetail);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error during file upload: " + e.getMessage(), e);
        }
    }

    @Override
    public documents getFile(User user, Long id) {
        try {
            Optional<documents> fiDetails = fileRepository.findByIdAndUser(id, user);

            if (!fiDetails.isPresent()) {
                throw new RuntimeException("No file detail found in database for id: " + id);
            }

            String fileName = fiDetails.get().getFileName();
            Path filePath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR, fileName);

            if (!Files.exists(filePath)) {
                throw new RuntimeException("File not found on disk: " + filePath.toAbsolutePath());
            }

            // Return the file details if the file exists
            return fiDetails.get();

        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve file: " + e.getMessage(), e);
        }
    }

    @Override
    public List<documents> getAllFiles(User user) {
        try {

            List<documents> files = fileRepository.findAllByUser(user);

            files.forEach(file -> {
                User userTemp = file.getUser();
                userTemp.setPassword(null); // Ensure password is not exposed
            });
            return files;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve file list: " + e.getMessage(), e);
        }
    }

    @Override
    public String deleteFile(User user, Long id) {
        try {
            Optional<documents> fileDetailsOpt = fileRepository.findByIdAndUser(id, user);
            if (!fileDetailsOpt.isPresent()) {
                throw new RuntimeException("File not found with id: " + id);
            }

            String fileName = fileDetailsOpt.get().getFileName();
            Path filePath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR, fileName);

            fileRepository.deleteById(id);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            return "File deleted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }
}