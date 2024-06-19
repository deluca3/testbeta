{?noOffers}
    <a href="#" id="btnSelectOffer">
        <img src="/img/selectOffer.png" class="img-responsive" />
    </a>
{/noOffers}

{#offers:.}
    {! Only 1 offer item, so we render a standard itemBox !}
    {@eq key=$len value=1}
        <div class="itemBox" data-itemID="{itemID}" data-qty="{?itemQty}{itemQty}{:else}1{/itemQty}">
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio">
                    <a href="/item/{itemID}">
                        <img class="fullSize" src="{itemThumb}">
                    </a>
                </div>

                {?itemQty}
                    <div class="qtyOverlay badge badge-primary btnEditQty">
                        <div>{itemQty}x</div>
                    </div>
                {/itemQty}
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{itemID}">{itemName}</a>
                </div>
                <div class="itemText">{itemDescription}</div>
            </div>
        </div>
    {/eq}

    {! More than 1 offer item, render as list. !}
    {@gt key=$len value=1}
        <div class="offerListItem row" data-itemID="{itemID}" data-qty="{?itemQty}{itemQty}{:else}1{/itemQty}">
            <div class="col-xs-4 itemImage">
                <a href="/item/{itemID}">
                    <img class="img-responsive" src="{itemThumb}" style="border-right: 1px solid #DDDDDD;">
                </a>
            </div>
            <div class="col-xs-8">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{itemID}">{itemName}</a>
                </div>

                <div style="height: 55px;" class="itemTextWrap">{itemDescription}</div>

                {?itemQty}
                    <span>Quantity: {itemQty}</span>
                {/itemQty}
            </div>
        </div>
    {/gt}
{/offers}