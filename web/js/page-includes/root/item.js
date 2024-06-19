/******************************************************************************
 * Item Functions
 ******************************************************************************/

function getRandomItems(username) {
    if(username) {
        $API.getRandomItems(4, username, function(items) {
            if(items) {
                var columns = {};

                //If we get less than 4 items, remove the 'more items' link.
                if(items.length < 4) {
                    $("#btnRandomItems").closest("div").remove();
                }

                for(var i = 0; i < items.length; i++) {
                    if(items[i] && items[i]['name'].length > 0) {
                        columns["C" + (i + 1)] = {
                            "itemID": items[i]['id'],
                            "itemThumb": items[i]['thumbnail'] ? items[i]['thumbnail']['url'] : "/img/noImage.jpg",
                            "itemName": items[i]['name'],
                            "itemDescription": items[i]['description']
                        };
                    }
                }

                dust.render("itemBox", columns, function(err, out) {
                    $("#randomItemList").html(out);
                });
            }
        });
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    //_ownerUsername comes from item.php head
    getRandomItems(_ownerUsername);

    //Image gallery
    Galleria.run('#imgGallery', {
        "thumbCrop": true,
        "height": 400,
        "width": 650,
        "showCounter": false,
        "dummy": "/img/noImage.jpg"
    });

    $("#btnRandomItems").on("click", function(e) {
        e.preventDefault();

        getRandomItems(_ownerUsername);
    });

    $("#btnBuyNow").on("click", function(e) {
        e.preventDefault();

        //TODO: Error case
        $API.buyOut(_itemID, 1, function(data) {
            if(data && data['url']) {
                window.location = data['url'];
            }
        });
    })
});