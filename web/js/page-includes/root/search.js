
function doSearch(query) {
    var callbacks = {
        "success": function(data) {
            var templateData = {};

            if($("#btnViewIcons").hasClass("active")) { //Icon view
                var items = data['results'];
                var itemData = [];

                for(var i=0; i < items.length; i+=3) {
                    var columns = {};

                    if(items[i] && items[i]['name'].length > 0) {
                        columns["C1"] = items[i];
                    }

                    if(items[i+1] && items[i+1]['name'].length > 0) {
                        columns["C2"] = items[i+1];
                    }

                    if(items[i+2] && items[i+2]['name'].length > 0) {
                        columns["C3"] = items[i+2];
                    }

                    itemData.push(columns);
                }

                templateData['iconMode'] = true;
                templateData['results'] = itemData;
            } else { //List view
                templateData = data;
            }

            dust.render("searchRow", templateData, function(err, out) {
                $("#searchResults").html(out);
            });
        },
        "noItems": function() {
            $("#searchResults").html('<div style="text-align: center">No results found.</div>');
        }
    };

    $API.searchItems(query, false, callbacks);
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    if(_searchFor && _searchFor.length > 0) {
        doSearch(_searchFor);
    } else window.location = "/";

    $("#btnViewIcons, #btnViewList").on("click", function(e) {
        e.preventDefault();

        if(!$(this).hasClass("active")) {
            $("#viewButtons button").removeClass("active");
            $(this).addClass("active");

            doSearch(_searchFor);
        }
    });
});

$(window).load(function() {
    if(_searchFor && _searchFor.length > 0) {
        $("#txtSiteSearch").val(_searchFor);
    }
});