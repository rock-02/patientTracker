package com.example.backend.controller;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.documents;
import com.example.backend.response.fileResponse;
import com.example.backend.services.fileService;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
// @RequestMapping("/documents/")
public class fileController {

    @Autowired
    private fileService fileService;

    // Upload file with error handling
    @PostMapping("/documents/upload")
    public ResponseEntity<fileResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = (file != null) ? file.getOriginalFilename() : null;
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(new fileResponse(null, "No file uploaded"));
        }
        try {
            documents fileDetails = fileService.uploadFile(file);
            if (fileDetails == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new fileResponse(fileName, "File upload failed"));
            }
            return ResponseEntity.ok(new fileResponse(fileName, "File uploaded successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new fileResponse(fileName, "Exception during upload: " + e.getMessage()));
        }
    }

    // Download file with robust error handling
    @GetMapping("/documents/{id}")
    public ResponseEntity<?> downloadFileById(@PathVariable Long id) {
        final String UPLOAD_DIR = "uploads";
        try {
            documents details = fileService.getFile(id);
            if (details == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File metadata not found for id: " + id);
            }

            Path filePath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR, details.getFileName());
            System.out.println("file Details : " + details);
            System.out.println("Resolved file path: " + filePath.toAbsolutePath());

            if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
                System.out.println("File not found or not readable.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("File not found or not readable: " + filePath.toAbsolutePath());
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("File resource not found or not readable.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception during download: " + e.getMessage());
        }
    }

    // List all files with error handling
    @GetMapping("/documents")
    public ResponseEntity<?> getAllFiles() {
        try {
            List<documents> files = fileService.getAllFiles();
            if (files == null || files.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No files found.");
            }
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception while fetching file list: " + e.getMessage());
        }
    }

    // Delete file with error handling
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        try {
            String result = fileService.deleteFile(id);
            if (result == null || result.toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found for id: " + id);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception during file deletion: " + e.getMessage());
        }
    }
}