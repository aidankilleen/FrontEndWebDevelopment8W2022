let url = "http://localhost:3000/users";

function addUserToTable(user) {
    $("#tbl-users tbody").append(`<tr id="tr_${ user.id }">
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.active}</td>
                    <td>
                        <button class="btnDelete" id="btnDelete_${user.id}">Delete</button>
                        <button class="btnEdit" id="btnEdit_${user.id}">Edit</button>
                        <button class="btnSave" id="btnSave_${user.id}" disabled>Save</button>
                        <button class="btnCancel" id="btnCancel_${user.id}" disabled>Cancel</button>
                    </td>
                </tr>`);
}

function getIdFromEvent(event) {
    let pieces = event.currentTarget.id.split("_");
    let id = pieces[1];
    return id;
}

function configureButtons(id, editing) {
    $(`#btnSave_${id}`).attr("disabled", !editing);
    $(`#btnCancel_${id}`).attr("disabled", !editing);
    $(`#btnEdit_${id}`).attr("disabled", editing);
}

$(document).ready(function() {
    console.log("ready() called");
    $.getJSON(url, function(users) {
        console.log("getJSON() returned");
        for(let i=0; i<users.length; i++) {
            addUserToTable(users[i]);
        }
    });
    $("#btnAdd").on("click", function() {

        //alert("Add clicked");

        let name = $("#txtName").val();
        let email = $("#txtEmail").val();
        let active = $("#chkActive").prop("checked");

        let user = {
            name: name, 
            email: email, 
            active: active
        }

        // make an ajax call to add this user to the REST service
        $.ajax({
            url: url, 
            method: "POST", 
            contentType: "application/json", 
            data: JSON.stringify(user), 
            /*
            success: function(addedUser) {
                addUserToTable(addedUser);

                $('#dlg-user').css("display", "none");
            }, 
            error: function(error) {
                alert(error);
            }
            */
        }).then((addedUser) => {
            addUserToTable(addedUser);

            $('#dlg-user').css("display", "none");
        })
        .catch((error) => {
            alert(error);
        });



    });

    $(document).on("click", ".btnEdit", function(event) {

        let id = getIdFromEvent(event);

        let name = $(`#tr_${id} td:nth-child(2)`).html();
        $(`#tr_${id} td:nth-child(2)`)
            .html(`<input 
                    id="txtName_${id}" 
                    value="${name}" 
                    data-original-value="${name}">`);

        let email = $(`#tr_${id} td:nth-child(3)`).html();
        $(`#tr_${id} td:nth-child(3)`)
            .html(`<input 
                    id="txtEmail_${id}" 
                    value="${email}"
                    data-original-value="${email}">`);

        let active = $(`#tr_${id} td:nth-child(4)`).html() == "true";
        $(`#tr_${id} td:nth-child(4)`)
            .html(`<input 
                    type="checkbox" 
                    id="chkActive_${id}" 
                    ${active ? "checked" : ""}
                    data-original-value="${active ? "true" : "false"}">`);

        // enable & disable buttons
        configureButtons(id, true);

    });

    $(document).on("click", ".btnCancel", function(event) {

        let id = getIdFromEvent(event);

        let originalName = $(`#txtName_${id}`).attr("data-original-value");
        let originalEmail = $(`#txtEmail_${id}`).attr("data-original-value");
        let originalActive = $(`#chkActive_${id}`).attr("data-original-value");
        // restore values and remove edit controls
        $(`#tr_${id} td:nth-child(2)`).html(originalName);
        $(`#tr_${id} td:nth-child(3)`).html(originalEmail);
        $(`#tr_${id} td:nth-child(4)`).html(originalActive);
        // enable & disable buttons
        configureButtons(id, false);
    });

    $(document).on("click", ".btnSave", function(event) {

        let id = getIdFromEvent(event);

        let updatedName = $(`#txtName_${id}`).val();
        let updatedEmail = $(`#txtEmail_${id}`).val();
        let updatedActive = $(`#chkActive_${id}`).prop("checked");

        let updatedUser = {
            id: id, 
            name: updatedName, 
            email: updatedEmail, 
            active: updatedActive
        }
        // make an ajax call to update the user...
        $.ajax({
            url: `${url}/${id}`, 
            method: "PUT", 
            contentType: "application/json", 
            data: JSON.stringify(updatedUser), 
            success: function() {
                // remove edit controls
                $(`#tr_${id} td:nth-child(2)`).html(updatedUser.name);
                $(`#tr_${id} td:nth-child(3)`).html(updatedUser.email);
                $(`#tr_${id} td:nth-child(4)`).html(updatedUser.active ? "true" : "false");

                // enable & disable buttons
                configureButtons(id, false);

            }, 
            error: function(error) {
                alert(error);
            }
        });
    });

    $(document).on("click", ".btnDelete", function(event) {

        let pieces = event.currentTarget.id.split("_");
        let id = pieces[1];
        if (confirm (`Delete user ${id}?`)) {
            // make an ajax call to delete this user...
            $.ajax({
                url: `${url}/${id}`, 
                method: "DELETE", 
                success: function() {
                    // remove this user from the table
                    $(`#tr_${id}`).remove();
                }, 
                error: function(error) {
                    alert(error);
                }
            });
        }
    });
    $('#btnShowDialog').on("click", function() {
        //alert("show dialog");
        $('#txtName').val("");
        $('#txtEmail').val("");
        $('#chkActive').prop("checked", false);

        $('#modal-overlay').css("display", "flex");
        $('#dlg-user').css("display", "block");
    });

    $("#btnCancelDialog").on("click", function() {
        $('#modal-overlay').css("display", "none");

        $('#dlg-user').css("display", "none");
    })
    console.log("finished");
});