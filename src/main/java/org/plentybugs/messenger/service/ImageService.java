package org.plentybugs.messenger.service;

import org.plentybugs.messenger.model.interfaces.Imaginable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface ImageService {

    void updateLogo(Imaginable imaginable, MultipartFile logo) throws IOException;

    void cropAndUpdateLogo(
            Imaginable imaginable,
            MultipartFile logo,
            Integer x, Integer y, Integer width, Integer height
    ) throws IOException;
}
