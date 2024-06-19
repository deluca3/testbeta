
/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    var $txtSiteSearch = $("#txtSiteSearch");

    $txtSiteSearch.on("keyup", function(e) {
        e.preventDefault();

        if(e.which == 13 && $.trim($txtSiteSearch.val()).length > 0) {
            window.location = "/search/" + encodeURIComponent($.trim($txtSiteSearch.val()));
        }
    });

    $("#btnSiteSearch").on("click", function(e) {
        e.preventDefault();

        if($.trim($txtSiteSearch.val()).length > 0) {
            window.location = "/search/" + encodeURIComponent($.trim($txtSiteSearch.val()));
        }
    });

    if($txtSiteSearch) {
        var _onSuggestionClick = function(e, data, dataset) {
            if(data) {
                if(dataset == "items" && data['value']) {
                    window.location = "/search/" + encodeURIComponent($.trim(data['value']));
                }

                if(dataset == "users" && data['value']) {
                    window.location = "/profile/" + data['value'];
                }
            }
        };

        var _dropdownSizer = function() {
            $('.tt-dropdown-menu').css('width', $txtSiteSearch.closest('div').width() + 'px');
        };

        $txtSiteSearch.typeahead([
            {
                "name": 'items',
                "remote": $apiLocation + 'search/navsuggest/%QUERY'
                /*"template": '<div class="row">' +
                    '<div class="col-xs-2 flatCol"><img class="img-responsive" src="' + $apiLocation + "image/sizedimage/{{thumbImageID}}/95" + '"/></div>' +
                    '<div class="col-xs-10"><div><b>{{value}}</b></div><div class="div-ellipsis">{{description}}</div></div>' +
                    '</div>',
                "engine": Hogan*/
            }/*,
            {
                "name": 'users',
                "remote": $apiLocation + 'search/navsuggest/%QUERY',
                "template": '<div class="row">' +
                    '<div class="col-xs-2 flatCol"><img class="img-responsive" src="{{#avatar}}{{avatar}}{{/avatar}}{{^avatar}}/img/stockUser.png{{/avatar}}"/></div>' +
                    '<div class="col-xs-10"><div><b>{{#firstName}}{{firstName}}{{/firstName}}&nbsp;{{#lastName}}{{lastName}} &middot;{{/lastName}} {{value}}</b></div><div class="div-ellipsis">{{location}}</div></div>' +
                    '</div>',
                "engine": Hogan
            }*/
        ])
            .on('typeahead:selected', _onSuggestionClick)
            .on('typeahead:opened', _dropdownSizer);
    }
});