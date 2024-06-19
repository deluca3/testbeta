var selectedOffer = null;

/******************************************************************************
 * Trade Functions
 ******************************************************************************/

function renderOfferItems() {
    if(!selectedOffer) {
        $("#tradeButtons, #offerUserData, #targetQuantity").hide();

        var $noOfferBtn = $("<a></a>")
            .attr("href", "#")
            .attr("id", "btnSelectOffer")
            .html(
                $("<img>")
                    .attr("src", "/img/selectOffer.png")
                    .addClass("img-responsive")
            );

        $("#offerList").html($noOfferBtn);

        //Select offer button
        $("#btnSelectOffer").on("click", function(e) {
            e.preventDefault();

            scrollToElement($("#offerItemPanel"));
        });
    } else {
        $("#tradeButtons").show();

        var $offer = $("#mainOfferList .offerBox[data-offerid='" + selectedOffer + "']");
        var $offerUserData = $offer.closest(".offerCol").find(".userData");

        if($offer && $offerUserData) {
            $("#offerList").html($offer.contents().clone(true));

            var $userData = $offerUserData.contents().clone(true);

            $userData.find(".reviewStar-static").removeClass("reviewStar-static").addClass("profileStar");

            $("#offerUserData").html($userData).show();
        }
    }
}

function loadItemOffers(overrideOffers) {
    var _doOfferRender = function(offers) {
        if(offers) {
            var offerData = [];

            //TODO: Replace this with a better system that allows user to choose between 1-4 offers per row.
            for(var i=0; i < offers.length; i+=3) {
                var columns = {};

                if(offers[i]) {
                    columns["C1"] = {
                        "offerID": offers[i]['offerID'],
                        "forQuantity": offers[i]['forQuantity'],
                        "username": offers[i]['username'],
                        "displayName": offers[i]['displayName'],
                        "location": offers[i]['location'],
                        "starRating": offers[i]['starRating'],
                        "avatar": offers[i]['avatar'] ? offers[i]['avatar'] : "/img/stockUser.png",
                        "offers": []
                    };

                    for(var x=0; x < offers[i]['items'].length; x++) {
                        var thisItem = offers[i]['items'][x];

                        var offerItem = {
                            "itemID": thisItem['itemID'],
                            "itemQty": thisItem['quantity'],
                            "itemThumb": thisItem['url'] ? thisItem['url'] : "/img/noImage.jpg",
                            "itemName": thisItem['name'],
                            "itemDescription": thisItem['description']
                        };

                        columns["C1"]["offers"].push(offerItem);
                    }
                }

                if(offers[i+1]) {
                    columns["C2"] = {
                        "offerID": offers[i+1]['offerID'],
                        "forQuantity": offers[i+1]['forQuantity'],
                        "username": offers[i+1]['username'],
                        "displayName": offers[i+1]['displayName'],
                        "location": offers[i+1]['location'],
                        "starRating": offers[i+1]['starRating'],
                        "avatar": offers[i+1]['avatar'] ? offers[i+1]['avatar'] : "/img/stockUser.png",
                        "offers": []
                    };

                    for(var x=0; x < offers[i+1]['items'].length; x++) {
                        var thisItem = offers[i+1]['items'][x];

                        var offerItem = {
                            "itemID": thisItem['itemID'],
                            "itemQty": thisItem['quantity'],
                            "itemThumb": thisItem['url'] ? thisItem['url'] : "/img/noImage.jpg",
                            "itemName": thisItem['name'],
                            "itemDescription": thisItem['description']
                        };

                        columns["C2"]["offers"].push(offerItem);
                    }
                }

                if(offers[i+2]) {
                    columns["C3"] = {
                        "offerID": offers[i+2]['offerID'],
                        "forQuantity": offers[i+2]['forQuantity'],
                        "username": offers[i+2]['username'],
                        "displayName": offers[i+2]['displayName'],
                        "location": offers[i+2]['location'],
                        "starRating": offers[i+2]['starRating'],
                        "avatar": offers[i+2]['avatar'] ? offers[i+2]['avatar'] : "/img/stockUser.png",
                        "offers": []
                    };

                    for(var x=0; x < offers[i+2]['items'].length; x++) {
                        var thisItem = offers[i+2]['items'][x];

                        var offerItem = {
                            "itemID": thisItem['itemID'],
                            "itemQty": thisItem['quantity'],
                            "itemThumb": thisItem['url'] ? thisItem['url'] : "/img/noImage.jpg",
                            "itemName": thisItem['name'],
                            "itemDescription": thisItem['description']
                        };

                        columns["C3"]["offers"].push(offerItem);
                    }
                }

                offerData.push(columns);
            }

            dust.render("itemBox", offerData, function(err, out) {
                $("#mainOfferList").html(out);

                //TODO: All these 'on' handlers need to be redone using bubbling events across the entire site's JS. (Performance)

                $("#mainOfferList .itemImage, #mainOfferList .itemLink").on("click", function(e) {
                    e.preventDefault();

                    var itemID = $(this).closest(".itemBox").attr("data-itemID");
                    if(!itemID) itemID = $(this).closest(".offerListItem").attr("data-itemID");

                    if(itemID) {
                        _showItemModal(itemID);
                    }
                });

                $("#mainOfferList .btnOfferAccept").on("click", function(e) {
                    e.preventDefault();

                    var $offerBox = $(this).closest(".offerCol").find(".offerBox");
                    var offerID = $offerBox.attr("data-offerid");
                    var targetQty = $offerBox.attr("data-forquantity");

                    if(parseInt(targetQty) <= 0) targetQty = 1;

                    if(offerID) {
                        selectedOffer = offerID;

                        $("#targetQuantity").text(targetQty + "x").show();

                        renderOfferItems();
                        scrollToElement($("#pageContainer"));
                    }
                });

                $("#mainOfferList .btnOfferReject").on("click", function(e) {
                    e.preventDefault();

                    var offerID = $(this).closest(".offerCol").find(".offerBox").attr("data-offerid");

                    confirmDialog("Are you sure you want to reject this offer?", "Reject Offer?", function(result) {
                        if(result) {
                            if(offerID) {
                                $API.rejectOffer(offerID, function(data) {
                                    if(data) {
                                        loadItemOffers();
                                    }
                                });
                            }
                        }
                    });
                });
            });
        }
    };

    $("#mainOfferList").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    if(overrideOffers) {
        _doOfferRender(overrideOffers);
    } else {
        var callbacks = {
            "success": function(offers) {
                _doOfferRender(offers);
            },
            "noOffers": function() {
                $("#mainOfferList").html('<div style="text-align: center;">No offers found for this item.</div>');
            }
        };

        $API.getOffers($("#targetItemBox").attr("data-itemID"), callbacks);
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    //Load item offers
    loadItemOffers();

    //Load default offer list state
    renderOfferItems();

    //Init modal manager
    $('body').modalmanager({
        "backdropLimit": 1,
        "spinner": "/img/ajax-loader.gif"
    });

    //Activate preview for target item
    $("#targetItemBox .itemImage, #targetItemBox .itemLink").on("click", function(e) {
        e.preventDefault();

        var itemID = $(this).closest(".itemBox").attr("data-itemID");

        if(itemID) {
            _showItemModal(itemID);
        }
    });

    //Reset offer button
    $("#btnResetOffer").on("click", function(e) {
        e.preventDefault();

        confirmDialog("Are you sure you want to clear the selected offer?", "Reset Trade", function(result) {
            if(result) {
                selectedOffer = null;
                renderOfferItems();
            }
        });
    });

    //Finalize trade button
    $("#btnFinalizeTrade").on("click", function(e) {
        if(selectedOffer) {
            var itemID = $("#targetItemBox").attr("data-itemID");

            if(itemID) {
                $API.acceptOffer(itemID, selectedOffer, function(data) {
                    if(data) {
                        alert("Trade successful!\nThis will look better soon.");
                        window.location = "/profile";
                    } else {
                        alert("Trade failure.\nReport this as a bug including all steps you took to get here.");
                    }
                });
            }
        }
    });
});