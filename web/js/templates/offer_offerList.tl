{?noOffers}
    <a href="#" id="btnSelectItem">
        <img src="/img/selectItems.png" class="img-responsive" />
    </a>
{/noOffers}

{#offers:.}
    {! Only 1 offer item, so we render a standard itemBox !}
    {@eq key=$len value=1}
        <div class="itemBox" data-itemID="{itemID}" data-qty="{?itemQty}{itemQty}{:else}1{/itemQty}" {?offerQty}data-offerQty="{offerQty}"{/offerQty}>
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio itemImg">
                    <a href="#">
                        <img class="fullSize" src="{itemThumb}">
                    </a>
                </div>

                {?offerQty}
                    <div class="qtyOverlay badge badge-primary btnEditQty">
                        <div>{offerQty}x</div>
                    </div>
                {/offerQty}
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="#">{itemName}</a>
                </div>
                <div class="itemText">{itemDescription}</div>
            </div>
        </div>
    {/eq}

    {! More than 1 offer item, render as list. !}
    {@gt key=$len value=1}
        <div class="offerListItem row" data-itemID="{itemID}" data-qty="{?itemQty}{itemQty}{:else}1{/itemQty}" {?offerQty}data-offerQty="{offerQty}"{/offerQty}>
            <div class="col-xs-4 itemImage itemImg">
                <a href="/item/{itemID}">
                    <img class="img-responsive" src="{itemThumb}" style="border-right: 1px solid #DDDDDD;">
                </a>
            </div>
            <div class="col-xs-8">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{itemID}">{itemName}</a>
                </div>
                <div style="height: 60px;" class="itemTextWrap">{itemDescription}</div>

                {?offerQty}
                    <div class="pull-left" style="line-height: 35px;">
                        <span>Quantity:&nbsp;<a href="#" class="btnEditQty">{offerQty}</a></span>
                    </div>
                {/offerQty}

                <div class="pull-right" style="margin-right: 5px;">
                    <button type="button" title="Remove offer" class="btn btn-danger btnRemoveOffer"><i class="glyphicon glyphicon-remove"></i></button>
                </div>
            </div>
        </div>
    {/gt}
{/offers}