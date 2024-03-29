package org.plentybugs.messenger.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ImageUtils {

    @Value("${upload.path}")
    private String uploadPath;

    public String saveFile(MultipartFile file) throws IOException {
        if (checkFile(file)) {
            String resultFilename = createFile() + "." + file.getOriginalFilename();
            file.transferTo(new File(uploadPath + "/" + resultFilename));
            return resultFilename;
        }

        return "";
    }

    public String cropAndSaveImage(MultipartFile file, int x, int y, int width, int height) throws IOException {
        if (checkFile(file)) {
            BufferedImage image = ImageIO.read(file.getInputStream());
            int maxWidth = image.getWidth();
            int maxHeight = image.getHeight();
            BufferedImage newImage = image.getSubimage(
                    x < 0 ? 0 : Math.min(x, maxWidth),
                    y < 0 ? 0 : Math.min(y, maxHeight),
                    width < 0 ? 0 : Math.min(width, maxWidth) - 1,
                    height < 0 ? 0 : Math.min(height, maxHeight) - 1
            );

            String resultFilename = createFile() + "." + file.getOriginalFilename();

            Matcher formatFinder = Pattern.compile(".+\\.(.+)").matcher(resultFilename);
            if (formatFinder.find()) {
                ImageIO.write(newImage, formatFinder.group(1), new File(uploadPath + "/" + resultFilename));
            }

            return resultFilename;
        }
        return "";
    }

    private boolean checkFile(MultipartFile file) {
        return file != null && file.getOriginalFilename() != null && !file.getOriginalFilename().isEmpty();
    }

    private String createFile() {
        File uploadDir = new File(uploadPath);
        if (uploadDir.exists()) uploadDir.mkdir();
        return UUID.randomUUID().toString();
    }
}
