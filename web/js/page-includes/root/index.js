
/*function loadTransactionFeed() {
    $("#transactionFeedData").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(feedData) {
            var dustCtx = dust.makeBase({
                "timeFrom": function(chunk, context, bodies, params) {
                    var output = timeFrom(parseInt(params['timestamp']));
                    return chunk.write(output);
                }
            });

            dust.render("transactionFeed", dustCtx.push(feedData), function(err, out) {
                $("#transactionFeedData").html(out);
            });
        },
        "noFeed": function() {
            $("#transactionFeedData").html('<div style="text-align: center;">No feed data.</div>');
        }
    };

    $API.getTransactionFeed(callbacks);
}

function tabAdjust(elem) {
    if ($mediaSize.indexOf("smartphone portrait") == -1) {
        if($(elem).is(".feedTab:first")) {
            $("div.tab-content").css({
                "border-radius": "0 5px 5px 5px"
            });
        } else {
            $("div.tab-content").css({
                "border-radius": "5px"
            });
        }
    }
}*/

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {

    $API.getRandomItems(16, "stephen", function(items) {
        if(items) {
            var chunked = items.chunk(8);

            chunked[0] = {
                "items": chunked[0]
            };

            chunked[1] = {
                "items": chunked[1]
            };

            dust.render("itemBox", chunked[0], function(err, out) {
                $("#sec1").html(out);
            });

            dust.render("itemBox", chunked[1], function(err, out) {
                $("#sec2").html(out);
            })
        }
    });

    /*loadTransactionFeed();

    //Make tabs work
    $("#feedTabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        var $parentTab = $(this).parent("li");

        if($parentTab.is(".feedTab:visible")) {
            tabAdjust($parentTab);
        }

        if($(this).hasClass("tabTransactionFeed")) {
            loadTransactionFeed();
        }
    });*/

    /********************************************
     *  Transaction Feed Tab
     *******************************************/

    /*$("#transactionFeed_txtNote").on("keyup", function(e) {
        if(e.which == 13) { //Enter key
            confirmDialog("Are you sure you wish to post this note?", "Post Note?", function(result) {
                if(result) {
                    $API.addFeedNote($.trim($("#transactionFeed_txtNote").val()), function(data) {
                        if(data) {
                            $("#transactionFeed_txtNote").val("");
                            loadTransactionFeed();
                        } else {
                            bootbox.alert("Failed to post note. This is a bug.");
                        }
                    });
                } else $("#transactionFeed_txtNote").focus();
            });
        }
    });*/

});