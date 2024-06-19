function _showItemModal(itemID) {
    if(itemID) {
        var modalData = null;

        //Load the item's data
        $API.getItem(itemID, true, function(itemData) {
            modalData = {
                "itemID": itemData['id'],
                "isOwned": itemData['isOwner'] ? itemData['isOwner'] : false,
                "itemName": itemData['name'],
                "itemDescription": itemData['description'],
                "watched": itemData['watched'] ? itemData['watched'] : false
            };

            //Check for owner
            if(itemData['owner']) {
                modalData['owner'] = itemData['owner'];
            }

            //Load in image data
            modalData['images'] = [];

            for(var i=0; i < itemData['images'].length ; i += 2) {
                var columns = {};

                if(itemData['images'][i] && itemData['images'][i]['id'] > 0) {
                    columns["C1"] = {
                        "thumbSrc": $apiLocation + "image/sizedimage/" + itemData['images'][i]['id'] + "/150"
                    };
                }


                if(itemData['images'][i+1] && itemData['images'][i+1]['id'] > 0) {
                    columns["C2"] = {
                        "thumbSrc": $apiLocation + "image/sizedimage/" + itemData['images'][i+1]['id'] + "/150"
                    };
                }

                modalData['images'].push(columns);
            }

            dust.render("itemViewModal", modalData, function(err, out) {
                $.magnificPopup.open({
                    "image": {
                        "markup": out,
                        "cursor": null,
                        "verticalGap": 88,
                        "verticalFit": true
                    },
                    "items": {
                        "src": $apiLocation + "image/sizedimage/" + itemData['thumbnail']['isThumb'] + "/800"
                    },
                    "type": 'image',
                    "tLoading": '<img src="/img/ajax-loader-blk.gif" />'
                });

                _applyWatchHandlers();

            });
        });
    }
}

function _applyWatchHandlers() {
    $(".btnWatchItem").on("click", function(e) {
        e.preventDefault();

        var $this = $(this);
        var itemID = $this.attr("data-itemID");

        if(itemID) {
            $API.addWatch(itemID, function(data) {
                if(data) {
                    $this.removeClass("btnWatchItem")
                        .addClass("btnUnwatchItem")
                        .text("Watching")
                        .off("click");

                    _applyWatchHandlers();
                }
            });
        }
    });

    $(".btnUnwatchItem").on("click", function(e) {
        e.preventDefault();

        var $this = $(this);
        var itemID = $this.attr("data-itemID");

        if(itemID) {
            $API.removeWatch(itemID, function(data) {
                if(data) {
                    $this.removeClass("btnUnwatchItem")
                        .addClass("btnWatchItem")
                        .text("Watch")
                        .off("click");

                    _applyWatchHandlers();
                }
            });
        }
    });
}

function _showImageModal(itemImage) {
    
}