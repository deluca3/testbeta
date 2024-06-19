
function getQueryParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateUser(user) {
    var re = /^[A-Za-z][A-Za-z0-9]{4,35}$/;
    return re.test(user);
}

function showLoginView(withUser) {
    $("#viewRegister").fadeOut();

    $("#loginForm").animate({
        "height": "270px",
        "margin-top": "-85px"
    }, function() {
        $("#viewLogin").fadeIn(function() {
            $("#viewRegister").find(":input").val('');

            if(withUser) {
                $("#txtComboLogin").val(withUser);
                $("#txtPassword").focus();
            }
        });
    });
}

function showRegisterView() {
    var comboField = $("#txtComboLogin").val();

    if(comboField.length > 0) {
        if(validateEmail(comboField)) {
            $("#txtRegEmail").val(comboField);
        } else {
            $("#txtRegUsername").val(comboField);
        }
    }

    $("#viewLogin").fadeOut();

    $("#loginForm").animate({
        "height": "440px",
        "margin-top": "-220px"
    }, function() {
        $("#viewRegister").fadeIn(function() {
            $("#viewLogin").find(":input").val('');
        });
    });
}

function shakeForm() {
    var l = 20;

    for( var i = 0; i < 5; i++ ) {
        $("#loginForm").animate( { 'margin-left': "+=" + ( l = -l ) + 'px' }, 75, function() {
            $("#loginForm").animate({'margin-left': '-160px'}, 75);
        });
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    $('input, textarea').placeholder();

    //TODO: This is not a great way to do it.. fix it.
    if((/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent)) {
        $(".touNav").removeClass("navbar-fixed-top").css("margin-bottom", "0");
        $(".container").removeClass("fixedHeaderPadding");
    }

    $("#btnLogin").click(function(e) {
        e.preventDefault();

        var username = $("#txtComboLogin").val();
        var password = $("#txtPassword").val();
        var rememberLogin = $("#chkRememberLogin").is(":checked");

        if(username.length == 0 || password.length == 0) {
            shakeForm();
            return;
        }

        var callbacks = {
            "success": function() {
                var path = getQueryParameterByName("path"); //TODO: URL rewrite broke this.

                if(path.length > 0) {
                    window.location = path;
                } else window.location = "/";
            },
            "failure": function() {
                $("#txtPassword").val('').focus();
                shakeForm();
            }
        };

        $API.login(username, password, rememberLogin, callbacks);
    });

    $("#btnForgotLogin").click(function(e) {
        //TODO: Make this work for real
        e.preventDefault();
        alert("Forgot your password? During this phase of development you'll have to contact us to remedy this.")
    });

    $("#btnRegister").click(function(e) {
        e.preventDefault();

        var username = $.trim($("#txtRegUsername").val());
        var email = $.trim($("#txtRegEmail").val());
        var password = $.trim($("#txtRegPassword").val());
        var cpassword = $.trim($("#txtRegConfirmPassword").val());
        var code = $.trim($("#txtRegInviteCode").val());

        //TODO: Make this use nice looking validation instead of alerts.
        if(password != cpassword) {
            alert("Passwords do not match.");
            return;
        }

        if(username.length < 4 || username.length > 35 || !validateUser(username)) {
            alert("Username must be 4-35 characters and can only contain letters and numbers, it must also start with a letter.");
            return;
        }

        //TODO: Password strength checks

        if(password.length < 6 || password.length > 30) {
            alert("Password must be 6-30 characters.");
            return;
        }

        if(email.length < 5 || email.length > 40) {
            alert("E-mail must be 5-40 characters.");
            return;
        }

        if(!validateEmail(email)) {
            alert("E-mail address is invalid. Please enter a valid e-mail address.");
            return;
        }

        if(code.length == 0) {
            alert("Invite code is required to make an account.");
            return;
        }

        if($API.register(username, email, password, code)) {
            alert("Account creation successful."); //TODO: Make this nicer.
            showLoginView(username);
        } else {
            alert("Error occured during account creation."); //TODO: Proper error handling
            location.reload();
        }
    });

    $("#btnNewUser, #btnNavSignUp").click(function(e) {
        e.preventDefault();

        showRegisterView();
    });

    $("#btnCancelRegister, #btnNavLogin").click(function(e) {
        e.preventDefault();

        showLoginView();
    });

    $("#txtComboLogin, #txtPassword, #chkRememberLogin").keyup(function(event) {
        if(event.which == 13) { //Enter key
            $("#btnLogin").trigger("click");
        }
    });

});