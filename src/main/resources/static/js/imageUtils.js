$(() => {
    let modal = $("#modal-upload-image");
    let modalBlock = $("<div class='modal fade' id='upload-image-modal' tabindex='-1' role='dialog' aria-hidden='true' style='z-index: 1051 !important;'></div>");
    let modalDialog = $("<div class='modal-dialog' role='document'></div>");
    let modalContent = $("<div class='modal-content bg-dark'></div>");
    let modalHeader = $("<div class='modal-header text-center d-block'><h5 class='modal-title'>Upload Image</h5></div>");
    let modalBody = $("<div class='modal-body' id='upload-image-body'></div>");
    let modalError = $("<div class='alert-danger d-none' id='upload-image-alert'>Image is too big</div>");
    let modalImagePreview = $("<div class='w-100' id='upload-image-preview'></div>");
    let modalImageResult = $("<div class='mw-100' id='upload-image-result'></div>");
    let modalCustomFile = $("<div class='custom-file'></div>");
    let modalCustomFileInput = $("<input type='file' class='custom-file-input' id='upload-image-input' name='title' accept='image/png, image/jpeg'/>");
    let modalCustomFileLabel = $("<label class='custom-file-label file-label' for='customFile'>Upload image</label>");

    modalCustomFile.append(modalCustomFileInput);
    modalCustomFile.append(modalCustomFileLabel);
    modalImagePreview.append(modalImageResult);
    modalBody.append(modalCustomFile);
    modalBody.append(modalError);
    modalBody.append(modalImagePreview);
    modalContent.append(modalHeader);
    modalContent.append(modalBody);
    modalDialog.append(modalContent);
    modalBlock.append(modalDialog);
    modal.append(modalBlock);

    let maxImageSize = 8388608;

    modalCustomFileInput.change((e) => {
        modalError.addClass("d-none");
        $("#upload-image-button").remove();
        let reader = new FileReader();
        reader.onload = (e) => {
            if (e.total > maxImageSize) {
                modalError.removeClass("d-none");
            } else {
                let uploadImageButton = $("<button type='button' class='btn btn-custom btn-block btn-outline-info' id='upload-image-button'>Upload</button>");

                uploadImageButton.click(() => {
                    let data = new FormData();
                    data.append("avatar", modalCustomFileInput.prop("files")[0]);
                    $.ajax({
                        type: 'PUT',
                        url: getHostname() + modal.data("url") + "/image",
                        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                        data: data,
                        enctype: 'multipart/form-data',
                        cache: false,
                        async: false,
                        processData: false,
                        contentType: false,
                    });
                    refreshPage();
                });
                modalImagePreview.after(uploadImageButton);
                let img = $("<img class='mw-100' alt='preview' id='uploaded-image-cropper' src='" + e.target.result + "' style='max-width: 100%'>");
                modalImageResult.empty();
                modalImageResult.append(img);
                createCropper(uploadImageButton, modal, modalCustomFileInput);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    });
});

function createCropper(button, modal, imageInput) {
    new Croppr("#uploaded-image-cropper", {
        returnMode: "real",
        aspectRatio: 1,
        maxSize: [100, 100, '%'],
        minSize: [100, 100, 'px'],
        onCropEnd: (image) => {
            button.unbind("click");
            button.click(() => {
                let data = new FormData();
                data.append("avatar", imageInput.prop("files")[0]);
                data.append("x", image.x);
                data.append("y", image.y);
                data.append("width", image.width);
                data.append("height", image.height);
                $.ajax({
                    type: 'PUT',
                    url: getHostname() + modal.data("url") + "/image",
                    beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                    data: data,
                    enctype: 'multipart/form-data',
                    cache: false,
                    async: false,
                    processData: false,
                    contentType: false,
                });
                refreshPage();
            });
        }
    });
}

function refreshPage() {
    location.reload();
}