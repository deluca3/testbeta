var searchXHR = null,
    searchTimer = null,
    searchLastVal = "",
    searchRender = false;

var selectedItems = {},
    selectedCount = 0,
    targetQuantity = 1;

/******************************************************************************
 * Offer Add/Remove Functions
 ******************************************************************************/

function offerAddItem($itemBox, qty) {
    var templateData = {};
    var itemID = $itemBox.attr("data-itemID");

    if(itemID && !selectedItems[itemID]) {
        //Grab item data for template.
        //TODO: Redo this using jq data attached to elements.
        templateData['itemID'] = itemID;
        templateData['itemQty'] = $itemBox.attr("data-offerQty");
        templateData['itemThumb'] = $itemBox.find("img.fullSize").attr("src");
        templateData['itemName'] = $itemBox.find("div.itemLink a").text();
        templateData['itemDescription'] = $itemBox.find("div.itemDesc").text();
        templateData['offerQty'] = qty ? parseInt(qty) : 1;

        //Add to selected item object
        selectedItems[itemID] = templateData;
        selectedCount++;

        renderOfferItems();
    }
}

function offerRemoveItem($itemBox) {
    var itemID = $itemBox.attr("data-itemID");

    if(itemID && selectedItems[itemID]) {
        //Remove it from the selected item object
        delete(selectedItems[itemID]);
        selectedCount--;

        if($itemBox.hasClass("offerListItem")) { //Removing using remove buttons in offerList
            //Remove glow from item in item list if it's there.
            var $itemList_itemBox = $("#itemList .itemBox[data-itemID='"+ itemID +"']");

            if($itemList_itemBox.length > 0) {
                $itemList_itemBox.removeClass("selectedGlow");

                //Find button and change
                var $toggleBtn = $itemList_itemBox.find(".btnToggleOffer");

                if($toggleBtn.hasClass("offered")) {
                    $toggleBtn
                        .removeClass("offered btn-danger")
                        .addClass("btn-success")
                        .text("Add to Offer");
                }
            }
        }

        renderOfferItems();
    }
}

/******************************************************************************
 * Inline Search Functions
 ******************************************************************************/

function searchUserItems(e) {
    var txtItemSearch = $("#txtItemSearch").val();

    if(txtItemSearch.length == 0 && searchLastVal.length != 0) {
        searchLastVal = txtItemSearch;
        loadUserItems();
        return;
    }

    searchLastVal = txtItemSearch;

    if(txtItemSearch.length > 2) {
        if(searchTimer) clearTimeout(searchTimer);
        if(searchXHR) searchXHR.abort();

        var callbacks = {
            "success": function(items) {
                searchXHR = null;

                if(items) {
                    searchRender = true;
                    loadUserItems(items);
                }
            },
            "noItems": function() {
                $("#itemList")
                    .empty()
                    .append('<div style="text-align: center;"><h4>No Items Found</h4></div>');
            }
        };

        searchTimer = setTimeout(function() {
            searchXHR = $API.searchItems(txtItemSearch, true, callbacks);
        }, 150);
    } else if(searchRender) {
        searchRender = false;
        loadUserItems();
    }
}

/******************************************************************************
 * Offer Functions
 ******************************************************************************/

function resetOffer() {
    $("#itemList .itemBox").removeClass("selectedGlow");

    selectedItems = {};
    selectedCount = 0;

    $("#offerButtons").hide();
    $("#txtItemSearch").val("");

    loadUserItems();
    renderOfferItems();
}

function btnFinalizeOffer(e) {
    e.preventDefault();

    $("#mdlSubmitOffer .mdlView, #mdlSubmitOffer_btnDone").hide();
    $("#mdlSubmitOffer .mdlSubmitOffer_sendView").show();
    $("#mdlSubmitOffer").modal("show");

    var itemID = $("#targetItemBox").attr("data-itemID");

    if(itemID) {
        var offerData = [];

        for(var itemKey in selectedItems) {
            if(selectedItems.hasOwnProperty(itemKey)) {
                var offerItem = {
                    "id": selectedItems[itemKey]['itemID'],
                    "qty": selectedItems[itemKey]['offerQty']
                };

                offerData.push(offerItem);
            }
        }

        offerData.reverse();

        var callbacks = {
            "maxOffers": function(data) {
                $("#mdlSubmitOffer_error").text("You cannot have more than 3 active offers on an item.");
                $("#mdlSubmitOffer .mdlView").hide();
                $(".mdlSubmitOffer_errorView, #mdlSubmitOffer_btnDone").show();
            },
            "success": function(data) {
                $("#mdlSubmitOffer .mdlView").hide();
                $(".mdlSubmitOffer_successView, #mdlSubmitOffer_btnDone").show();
            }
        };

        $API.addOffer(itemID, targetQuantity, offerData, callbacks);
    }
}

function invertOfferSelection($itemBox, qty) {
    if($itemBox.hasClass("selectedGlow")) {
        $itemBox.removeClass("selectedGlow");

        offerRemoveItem($itemBox);
    } else {
        $itemBox.addClass("selectedGlow");

        offerAddItem($itemBox, qty);
    }
}

function renderOfferItems() {
    var templateData = {};

    if(selectedCount <= 0) {
        $("#offerButtons").hide();

        templateData['noOffers'] = true;
    } else {
        $("#offerButtons").show();

        templateData['offers'] = [];

        for(var itemKey in selectedItems) {
            if(selectedItems.hasOwnProperty(itemKey)) {
                templateData['offers'].push(selectedItems[itemKey]);
            }
        }

        templateData['offers'].reverse();
    }

    dust.render("offerList", templateData, function(err, out) {
        $("#offerList").html(out);

        if(selectedCount == 0) {
            //Select item button
            $("#btnSelectItem").on("click", function(e) {
                e.preventDefault();

                scrollToElement($("#offerItemPanel"));
            });
        } else {
            $(".btnRemoveOffer").on("click", function(e) {
                e.preventDefault();

                var $offerListItem = $(this).closest(".offerListItem");

                if($offerListItem) {
                    offerRemoveItem($offerListItem);
                }
            });

            $(".btnEditQty").on("click", function(e) {
                e.preventDefault();

                var $offerListItem = $(this).closest(".offerListItem");
                //var itemQty = $offerListItem.attr("data-qty");
                var offerQty = $offerListItem.attr("data-offerQty");

                $("#mdlChangeQty_qtyField").val(parseInt(offerQty));
                $("#mdlChangeQty").modal('show');

                //$(this).closest(".offerListItem").attr("data-offerQty", params['value']);

            });

            $("#offerList .itemImg, #offerList .itemLink").on("click", function(e) {
                e.preventDefault();
                var itemID = '';

                if(selectedCount == 1) {
                    itemID = $(this).closest(".itemBox").attr("data-itemID");
                } else {
                    itemID = $(this).closest(".offerListItem").attr("data-itemID");
                }

                if(itemID) {
                    _showItemModal(itemID);
                }
            });
        }
    });
}

function loadUserItems(overrideItems) {
    var _doItemRender = function(items) {
        if(items) {
            var itemData = [];

            //TODO: Replace this with a better system that allows user to choose between 1-4 items per row.
            for(var i=0; i < items.length; i+=3) {
                var columns = {};

                if(items[i] && items[i]['name'].length > 0) {
                    columns["C1"] = {
                        "itemID": items[i]['id'],
                        "itemQty": items[i]['quantity'],
                        "itemThumb": items[i]['thumbnail'] ? items[i]['thumbnail']['url'] : "/img/noImage.jpg",
                        "itemName": items[i]['name'],
                        "itemDescription": items[i]['description'],
                        "itemSelected": selectedItems[items[i]['id']] != undefined
                    };
                }

                if(items[i+1] && items[i+1]['name'].length > 0) {
                    columns["C2"] = {
                        "itemID": items[i+1]['id'],
                        "itemQty": items[i+1]['quantity'],
                        "itemThumb": items[i+1]['thumbnail'] ? items[i+1]['thumbnail']['url'] : "/img/noImage.jpg",
                        "itemName": items[i+1]['name'],
                        "itemDescription": items[i+1]['description'],
                        "itemSelected": selectedItems[items[i+1]['id']] != undefined
                    };
                }

                if(items[i+2] && items[i+2]['name'].length > 0) {
                    columns["C3"] = {
                        "itemID": items[i+2]['id'],
                        "itemQty": items[i+2]['quantity'],
                        "itemThumb": items[i+2]['thumbnail'] ? items[i+2]['thumbnail']['url'] : "/img/noImage.jpg",
                        "itemName": items[i+2]['name'],
                        "itemDescription": items[i+2]['description'],
                        "itemSelected": selectedItems[items[i+2]['id']] != undefined
                    };
                }

                itemData.push(columns);
            }

            dust.render("itemBox", itemData, function(err, out) {
                $("#itemList").html(out);

                //TODO: All these 'on' handlers need to be redone using bubbling events across the entire site's JS. (Performance)

                $(".btnToggleOffer").on("click", function(e) {
                    e.preventDefault();

                    var $this = $(this);
                    var itemQty = $this.closest(".itemBox").attr("data-qty");

                    if($this.hasClass("offered")) {
                        $this
                            .removeClass("offered btn-danger")
                            .addClass("btn-success")
                            .text("Add to Offer");

                        invertOfferSelection($this.closest(".itemBox"));
                    } else {
                        if(itemQty && itemQty > 1) { //More than 1, show popup to allow for quantity selection.
                            $this.editable({
                                "type": "text",
                                "title": "How many? (Have " + parseInt(itemQty) + ")",
                                "clear": false,
                                "value": "1",
                                "toggle": "manual",
                                "placeholder": "Quantity",
                                "highlight": false,
                                "send": "always",
                                "display": false,
                                "savenochange": true,
                                "validate": function(value) {
                                    value = parseInt(value);

                                    if(value < 1) {
                                        value = 1;
                                        return {"newValue": value, "msg": "Invalid quantity."};
                                    } else if(value > itemQty) {
                                        value = itemQty;
                                        return {"newValue": value, "msg": "You don't have that many."};
                                    }
                                },
                                "url": function(params) {
                                    $this
                                        .removeClass("btn-success")
                                        .addClass("offered btn-danger")
                                        .text("Remove from Offer");

                                    invertOfferSelection($this.closest(".itemBox"), params['value']);

                                    return true;
                                }
                            }).editable('show');
                        } else {
                            $this
                                .removeClass("btn-success")
                                .addClass("offered btn-danger")
                                .text("Remove from Offer");

                            invertOfferSelection($this.closest(".itemBox"));
                        }
                    }
                });
            });
        }
    };

    $("#itemList").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    if(overrideItems) {
        _doItemRender(overrideItems);
    } else {
        var callbacks = {
            "success": function(items) {
                _doItemRender(items);
            },
            "noItems": function() {
                $("#itemList").html('<div style="text-align: center;">No items available to offer.</div>');
            }
        };

        $API.getItems(false, callbacks);
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    //Load user items
    loadUserItems();

    //Default offerList state
    renderOfferItems();

    //Init modal manager
    $('body').modalmanager({
        "backdropLimit": 1,
        "spinner": "/img/ajax-loader.gif"
    });

    //Modal(s)
    $("#mdlSubmitOffer").modal({
        "keyboard": false,
        "show": false
    });

    $("#mdlChangeQty").modal({
        "show": false
    });

    //Quantity modification for target item
    var $btnTargetItemQty = $("#btnTargetItemQty");
    if($btnTargetItemQty) {
        var targetItemQty = parseInt($btnTargetItemQty.attr("data-totalQty"));
        $btnTargetItemQty.editable({
            "type": "text",
            "title": "How many do you want? (Has " + parseInt(targetItemQty) + ")",
            "clear": false,
            "value": "1",
            "placeholder": "Quantity",
            "highlight": false,
            "send": "always",
            "display": false,
            "savenochange": true,
            "validate": function(value) {
                value = parseInt(value);

                if(value < 1) {
                    value = 1;
                    return {"newValue": value, "msg": "Invalid quantity."};
                } else if(value > targetItemQty) {
                    value = targetItemQty;
                    return {"newValue": value, "msg": "There aren't that many."};
                }
            },
            "url": function(params) {
                params['value'] = parseInt(params['value']) > 0 ? parseInt(params['value']) : 1;

                targetQuantity = params['value']
                $("#targetItemQty").text(params['value']);

                return true;
            }
        });
    }

    //Submit offer done button
    $("#mdlSubmitOffer_btnDone").on("click", function(e) {
        e.preventDefault();

        resetOffer();

        $("#mdlSubmitOffer").modal("hide");
    });

    //Reset offer button
    $("#btnResetOffer").on("click", function(e) {
        e.preventDefault();

        confirmDialog("Are you sure you want to clear all selected items?", "Reset Offer", function(result) {
            if(result) {
                resetOffer();
            }
        });
    });

    //Finalize offer button
    $("#btnFinalizeOffer").on("click", btnFinalizeOffer);

    //Item search field
    $("#txtItemSearch").on("keyup", searchUserItems);

    //Offer cash button
    $("#btnOfferCash").on("click", function(e) {
        e.preventDefault();

        prompt("Please enter a cash value you'd like to add to the offer");
    });
});