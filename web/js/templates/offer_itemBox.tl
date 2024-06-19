{#.:.}
<div class="row rowFit">

    {?C1}
    <div class="col-xs-4">
        <div class="itemBox{?C1.itemSelected} selectedGlow{/C1.itemSelected}" data-itemID="{C1.itemID}" data-qty="{?C1.itemQty}{C1.itemQty}{:else}1{/C1.itemQty}">
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio">
                    <a href="/item/{C1.itemID}">
                        <img class="fullSize" src="{C1.itemThumb}">
                    </a>
                </div>
                <div class="btnOverlay">
                    <button class="btn btn-sm btnToggleOffer {?C1.itemSelected}btn-danger offered{:else}btn-success{/C1.itemSelected}" style="width: 100%;">
                        {?C1.itemSelected}
                            Remove from Offer
                        {:else}
                            Add to Offer
                        {/C1.itemSelected}
                    </button>
                </div>
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{C1.itemID}">{C1.itemName}</a>
                </div>
                <div class="itemText itemDesc">{C1.itemDescription}</div>
            </div>
        </div>
    </div>
    {/C1}

    {?C2}
    <div class="col-xs-4">
        <div class="itemBox{?C2.itemSelected} selectedGlow{/C2.itemSelected}" data-itemID="{C2.itemID}" data-qty="{?C2.itemQty}{C2.itemQty}{:else}1{/C2.itemQty}">
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio">
                    <a href="/item/{C2.itemID}">
                        <img class="fullSize" src="{C2.itemThumb}">
                    </a>
                </div>
                <div class="btnOverlay">
                    <button class="btn btn-sm btnToggleOffer {?C2.itemSelected}btn-danger offered{:else}btn-success{/C2.itemSelected}" style="width: 100%;">
                        {?C2.itemSelected}
                            Remove from Offer
                        {:else}
                            Add to Offer
                        {/C2.itemSelected}
                    </button>
                </div>
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{C2.itemID}">{C2.itemName}</a>
                </div>
                <div class="itemText itemDesc">{C2.itemDescription}</div>
            </div>
        </div>
    </div>
    {/C2}

    {?C3}
    <div class="col-xs-4">
        <div class="itemBox{?C3.itemSelected} selectedGlow{/C3.itemSelected}" data-itemID="{C3.itemID}" data-qty="{?C3.itemQty}{C3.itemQty}{:else}1{/C3.itemQty}">
            <div class="itemImage fixedRatioContainer">
                <div class="fixedRatioDummy"></div>
                <div class="fixedRatio">
                    <a href="/item/{C3.itemID}">
                        <img class="fullSize" src="{C3.itemThumb}">
                    </a>
                </div>
                <div class="btnOverlay">
                    <button class="btn btn-sm btnToggleOffer {?C3.itemSelected}btn-danger offered{:else}btn-success{/C3.itemSelected}" style="width: 100%;">
                        {?C3.itemSelected}
                            Remove from Offer
                        {:else}
                            Add to Offer
                        {/C3.itemSelected}
                    </button>
                </div>
            </div>
            <div class="itemInfo">
                <div class="itemText itemLink" style="font-weight: bold;">
                    <a href="/item/{C3.itemID}">{C3.itemName}</a>
                </div>
                <div class="itemText itemDesc">{C3.itemDescription}</div>
            </div>
        </div>
    </div>
    {/C3}

</div>
{/.}