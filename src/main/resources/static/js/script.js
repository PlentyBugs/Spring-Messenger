let contactList = $("#contact-list");

$(() => {
    let $body = $('body');
    $('.js-menu-toggle').click(function(e) {
        const $this = $(this);

        if ( $body.hasClass('show-sidebar') ) {
            $body.removeClass('show-sidebar');
            $this.removeClass('active');
        } else {
            $body.addClass('show-sidebar');
            $this.addClass('active');
        }

        e.preventDefault();
    });

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "user/contact",
        async: false,
        cache: false,
        success: (contacts) => {
            for (let contact of contacts) {
                addContactToSideBar(contact);
            }
        }
    });

    $.ajax({
        type: 'GET',
        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
        url: getHostname() + "user/simple?removeFriends=true",
        async: false,
        cache: false,
        success: (userList) => {
            let container = $("#user-list-contacts-add");
            for (let user of userList) {
                let id = user.id + "-contact";
                let userId = user.id;
                let username = user.username;
                let userBlock = $(`
                    <div class='row m-2 user-modal' style='display: flow-root'>
                        <label for='` + id + `' data-id='` + userId + `' class='user-modal-checkbox'>
                            <span>` + username + `</span>
                            <button class="fa fa-plus add-contact-button float-right btn-info"></button>
                        </label>
                    </div>
                `);
                userBlock.click(() => {
                    $.ajax({
                        type: 'PUT',
                        beforeSend: (xhr) => xhr.setRequestHeader(header, token),
                        url: getHostname() + "user/follow/" + user.id,
                        async: true,
                        cache: false,
                    });
                    userBlock.remove();
                });
                container.append(userBlock);
            }
        }
    });

    let searchUsersInput = $("#modal-contacts-filter");
    let searchUsers = $(".user-modal");

    searchUsersInput.keyup(() => filter(searchUsersInput.val(), searchUsers));
});

function addContactToSideBar(contact) {
    let contactBlock = $(`
        <li class="person">
            <a href="#" class="d-flex align-items-center">
                <img src="/img/` + contact.contactAvatarFilename + `" alt="Image" class="img-fluid mr-vw" onerror="this.onerror = null; this.src= + /img/logo.png">
                <span class="user-name">` + contact.contactUsername + `</span>
            </a>
        </li>
    `)
    contactList.prepend(contactBlock);
}

function filter(filter, items) {
    for (let item of items) {
        if ($(item).text().toLowerCase().includes(filter.toLowerCase())) {
            $(item).css("display", "block");
        } else {
            $(item).css("display", "none");
        }
    }
}

function getHostname() {
    return document.URL.match(/(https?:\/\/.+?\/)\/?.*/)[1];
}