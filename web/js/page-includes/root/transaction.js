function loadTransactionData() {
    if(_transactionID) {
        $API.getTransaction(_transactionID, function(offerData) {
            if(offerData) {
                if(!offerData['hasReview']) {
                    $("#btnReview").show();
                }

                dust.render("offerList", offerData, function(err, out) {
                    $("#offerList").html(out);

                    if(offerData['offer']['user']['avatar']) {
                        $("#offerUserAvatar").attr("src", offerData['offer']['user']['avatar']);
                    }

                    $("#offerUserAvatarLink").attr("href", "/profile/" + offerData['offer']['user']['username']);
                    $("#offerUserName").text(offerData['offer']['user']['username']);
                    $("#offerUserLocation").text(offerData['offer']['user']['location']);
                    $("#offerUserData").show();

                    offerData['offer']['user']['bigStars'] = true;
                    dust.render("stars", offerData['offer']['user'], function(err, out) {
                        $("#offerUserStars").html(out);
                    });
                });
            }
        });
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    loadTransactionData();

    //Init modal manager
    $('body').modalmanager({
        "backdropLimit": 1,
        "spinner": "/img/ajax-loader.gif"
    });

    $("#starRating").rateit({
        "step": 1,
        "value": 1,
        "max": 5,
        "starwidth": 20,
        "starheight": 20,
        "resetable": false
    });

    $("#reviewEntry").NobleCount("#reviewEntry_count", {
        "max_chars": 256
    });

    //Modal(s)
    $("#mdlReview").modal({
        "keyboard": false,
        "show": false
    }).on('hide.bs.modal', function() {
        $("#starRating").rateit('value', 1);

        $("#reviewEntry").val("").NobleCount("#reviewEntry_count", {
            "max_chars": 256
        });
    });

    $("#btnMessage").on('click', function(e) {
        e.preventDefault();

        window.location = "/messages/compose/" + _msgUser;
    });

    $("#btnReview").on('click', function(e) {
        e.preventDefault();

        $("#mdlReview").modal('show');
    });

    //Review Modal

    $("#mdlReview_btnDone").on('click', function(e) {
        e.preventDefault();

        var starRating = $("#starRating").rateit('value');
        var $reviewEntry = $("#reviewEntry");

        if($reviewEntry.val().length <= 256) {
            confirmDialog("Are you sure you wish to rate this transaction " + starRating + " stars?", "Confirm review", function(result) {
                if(result) {
                    $API.addReview(_transactionID, starRating, $reviewEntry.val(), function(data) {
                        bootbox.alert("Review Successfully Submitted.");
                        location.reload();
                    });
                }
            });
        } else bootbox.alert("Your review cannot be longer than 256 characters.");
    });

});