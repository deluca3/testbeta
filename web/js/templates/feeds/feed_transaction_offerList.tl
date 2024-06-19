{#offer}
{! Only 1 offer item, so we render a standard itemBox !}
    {@eq key=$len value=1}
        <div class="itemBox" data-itemID="{itemID}">
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio">
                    <a href="/item/{itemID}">
                        <img class="fullSize" src="{url}">
                    </a>
                </div>

                {?quantity}
                    <div class="qtyOverlay badge badge-primary btnEditQty">
                        <div>{quantity}x</div>
                    </div>
                {/quantity}
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="#">{name}</a>
                </div>
                <div class="itemText">{description}</div>
            </div>
        </div>
    {/eq}

    {! More than 1 offer item, render as list. !}
    {@gt key=$len value=1}
        <div class="offerListItem row" data-itemID="{itemID}">
            <div class="col-xs-4 itemImage">
                <a href="/item/{itemID}">
                    <img class="img-responsive" src="{url}" style="border-right: 1px solid #DDDDDD;">
                </a>
            </div>
            <div class="col-xs-8">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="#">{name}</a>
                </div>

                {?isHomeFeed}
                    <br/>
                {:else}
                    <div style="height: 35px;" class="itemTextWrap">{description}</div>
                {/isHomeFeed}

                {?quantity}
                    <span>Quantity: {quantity}</span>
                {/quantity}
            </div>
        </div>
    {/gt}
{/offer}