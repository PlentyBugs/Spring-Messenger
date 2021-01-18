package org.plentybugs.messenger.service.impl;

import lombok.RequiredArgsConstructor;
import org.plentybugs.messenger.model.interfaces.Imaginable;
import org.plentybugs.messenger.service.ImageService;
import org.plentybugs.messenger.util.ImageUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageUtils imageUtils;

    @Override
    public void updateLogo(Imaginable imaginable, MultipartFile logo) throws IOException {
        String filename = imageUtils.saveFile(logo);
        saveLogoFilename(imaginable, filename);
    }

    @Override
    public void cropAndUpdateLogo(Imaginable imaginable, MultipartFile logo, Integer x, Integer y, Integer width, Integer height) throws IOException {
        if (x == null) {
            updateLogo(imaginable, logo);
        } else {
            String filename = imageUtils.cropAndSaveImage(logo, x, y, width, height);
            saveLogoFilename(imaginable, filename);
        }
    }

    public void saveLogoFilename(Imaginable imaginable, String filename) {
        if (!filename.isEmpty()) {
            imaginable.setAvatar(filename);
        }
    }
}
