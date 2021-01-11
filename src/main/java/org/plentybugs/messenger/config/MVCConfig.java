package org.plentybugs.messenger.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

    @Value("{upload.path}")
    private String uploadPath;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/registration").setViewName("registration");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(
                "/webjars/**",
                "/img/**",
                "/favicon.png",
                "/css/**",
                "/js/**"
        ).addResourceLocations(
                "classpath:/META-INF/resources/webjars/",
                "file:///" + uploadPath + "/",
                "classpath:/static/css/",
                "classpath:/static/js/",
                "classpath:/static/img/",
                "classpath:/static/",
                "/webjars/"
        );
    }
}
