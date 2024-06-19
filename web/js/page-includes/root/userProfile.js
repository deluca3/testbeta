/******************************************************************************
 * Profile Functions
 ******************************************************************************/

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
}

function loadWishlist() {
    $("#wishRows").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(data) {
            for(var i=0;i<data.length;i++) { //TODO: Gross, get rid of this crap.
                data[i]['notEditor'] = true;
            }

            dust.render("wishRow", data, function(err, out) {
                $("#wishRows").html(out);
            });
        },
        "noWishes": function() {
            $("#wishRows").html('<div style="text-align: center;">No wishes yet.</div>');
        }
    };

    $API.getWishlist(_profileUsername, callbacks);
}

function loadReviews() {
    $("#reviewTab").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(feedData) {
            var dustCtx = dust.makeBase({
                "timeFrom": function(chunk, context, bodies, params) {
                    var output = timeFrom(parseInt(params['timestamp']));
                    return chunk.write(output);
                }
            });

            dust.render("review", dustCtx.push(feedData), function(err, out) {
                $("#reviewTab").html(out);
            });
        },
        "noReviews": function() {
            $("#reviewTab").html('<div style="text-align: center;">No reviews found.</div>');
        }
    };

    $API.getReviews(_profileUsername, callbacks);
}

function loadActivityFeed() {
    $("#feedData").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(feedData) {
            var dustCtx = dust.makeBase({
                "timeFrom": function(chunk, context, bodies, params) {
                    var output = timeFrom(parseInt(params['timestamp']));
                    return chunk.write(output);
                }
            });

            dust.render("activityFeed", dustCtx.push(feedData), function(err, out) {
                $("#feedData").html(out);
            });
        },
        "noFeed": function() {
            $("#feedData").html('<div style="text-align: center;">No feed data.</div>');
        }
    };

    $API.getActivityFeed(_profileUsername, callbacks);
}

function loadFollowList(followers) {
    var _doFollowRender = function(data) {
        dust.render("followList", data, function(err, out) {
            $("#followContent").html(out);
        });
    };

    if(followers && followers == true) {
        $API.getFollowers(_profileUsername, function(data) {
            if(data) _doFollowRender(data);
        });
    } else {
        $API.getFollowing(_profileUsername, function(data) {
            if(data) _doFollowRender(data);
        });
    }
}

function loadUserItems(uid) {
    $("#itemsTab").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(items) {
            var itemData = {};

            itemData['items'] = items;

            dust.render("itemBox", itemData, function(err, out) {
                $("#itemsTab").html(out);
            });
        },
        "noItems": function() {
            $("#itemsTab").html('<div style="text-align: center;">No items here.</div>');
        }
    };

    $API.getListedItems(uid, callbacks);
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {

    //Load user's items from the API & template them in.
    loadUserItems(_profileUsername);

    //Make tabs work
    $("#profileTabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        var $parentTab = $(this).parent("li");

        if($parentTab.is(".feedTab:visible")) {
            tabAdjust($parentTab);
        }

        if($(this).hasClass("tabItems")) {
            loadUserItems(_profileUsername);
        }

        if($(this).hasClass("tabConnections")) {
            loadFollowList($("#btnConnFollowers").hasClass("active"));
        }

        if($(this).hasClass("tabActivity")) {
            loadActivityFeed();
        }

        if($(this).hasClass("tabReview")) {
            loadReviews();
        }
    });

    //Init modal manager
    $('body').modalmanager({
        "backdropLimit": 1,
        "spinner": "/img/ajax-loader.gif"
    });

    $("#mdlWishlist").modal({
        "keyboard": true,
        "show": false
    });

    /********************************************
     *  General
     *******************************************/

    $("#btnFollowUser").on("click", function(e) {
        e.preventDefault();

        var $this = $(this);

        if(!$this.hasClass("followed")) { //Not followed yet.
            $API.addFollow(_profileUsername, function(data) {
                if(data) {
                    $this.addClass("followed")
                        .text("Unfollow");
                }
            });
        } else { //Is already followed.
            $API.removeFollow(_profileUsername, function(data) {
                if(data) {
                    $this.removeClass("followed")
                        .text("Follow");
                }
            });
        }
    });

    $("#btnShowReviews").on('click', function(e) {
        e.preventDefault();

        $(".tabReview").trigger('click');
    });

    $("#btnViewWishes").on('click', function(e) {
        e.preventDefault();

        loadWishlist();
        $("#mdlWishlist").modal('show');
    });

    /********************************************
     *  Connections Tab
     *******************************************/

    $("#btnShowFollowing").on("click", function(e) {
        e.preventDefault();

        $(".tabConnections").trigger("click");
    });

    $("#btnShowFollowers").on("click", function(e) {
        e.preventDefault();

        $(".tabConnections").trigger("click");
    });

    $("#btnConnFollowing").on("click", function(e) {
        e.preventDefault();

        $(this).closest("ul").find("li").removeClass("active");
        $(this).addClass("active");
        loadFollowList();
    });

    $("#btnConnFollowers").on("click", function(e) {
        e.preventDefault();

        $(this).closest("ul").find("li").removeClass("active");
        $(this).addClass("active");
        loadFollowList(true);
    });

});