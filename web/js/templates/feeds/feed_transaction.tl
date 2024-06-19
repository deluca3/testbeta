{! This template requires the inclusion of the feed_transaction_offerList template !}
<div class="feedHeader">
    {#ownOffer}
        {@eq key=$idx value=0}
            {@gt key=$len value=1}
                <a href="/profile/{ownUser}">{ownUser}</a> traded <a href="#">{@size key=ownOffer /} items</a> for <a href="/profile/{forUser}">{forUser}</a>'s <a href="#">{forItem}</a>
            {:else}
                <a href="/profile/{ownUser}">{ownUser}</a> traded their <a href="#">{.name}</a> for <a href="/profile/{forUser}">{forUser}</a>'s <a href="#">{forItem}</a>
            {/gt}
        {/eq}
    {/ownOffer}
</div>
<div>
    <div class="row">
        <div class="col-xs-4">
            <div class="offerBox offerBox-sm {?isHomeFeed}offerBox-tiny{/isHomeFeed}">
                {>offerList offer=ownOffer isHomeFeed=isHomeFeed /}
            </div>
        </div>
        <div class="col-xs-2"><img src="/img/forDot.png" class="img-responsive forDot"></div>
        <div class="col-xs-4">
            <div class="itemBox" style="margin: 0;">
                <div class="itemImage fixedRatioContainer">
                    <div class="fixedRatioDummy"></div>
                    <div class="fixedRatio">
                        <a href="#">
                            <img class="fullSize" src="{forThumb}">
                        </a>
                    </div>
                </div>
                <div class="itemInfo">
                    <div class="itemText itemLink" style="font-weight: bold;">
                        <a href="#">{forItem}</a>
                    </div>
                    <div class="itemText">{forDescription}</div>
                </div>
            </div>
        </div>
    </div>
</div>