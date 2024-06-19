<ul class="itemList">
    {?showAddItem}
        <li>
            <a href="#mdlAddItem" id="btnAddItem" title="Add Item">
                <img class="fullSize" src="/img/addItem.jpg" />
            </a>
        </li>
    {/showAddItem}

    {#items}
        <li data-itemID="{.id}" class="itemBox {?showAddItem}
                {@math key=$idx method="mod" operand=4}
                    {@eq value=2}
                        last
                    {/eq}
                {/math}
            {:else}
                {@if cond="({$idx} - 1) % 4 == 2"} {! yea.... !}
                    last
                {/if}
            {/showAddItem}"
        >
            <div class="itemImage">
                <a href="/item/{.id}">
                    <img src="
                            {?.thumbnail.url}
                                {.thumbnail.url}
                            {:else}
                                /img/noImage.jpg
                            {/.thumbnail.url}
                            " class="img-responsive">
                </a>

                {?.offers}
                    <a href="/trade/{.id}">
                        <div class="offerOverlay">
                            {.offers} Offer{@gt key=.offers value=1}s{/gt}
                        </div>
                    </a>
                {/.offers}
            </div>
            <div class="itemInfo">
                <div class="itemData" style="height:40px;">
                    <div><a class="itemText" href="/item/{.id}" style="color: #000;">{.name}</a></div>
                    <div>Quantity: {.quantity}</div>
                </div>

                {?ownProfile}<a href="#" class="toolbarBtn"><i class="icon-chevron-down"></i></a>{/ownProfile}
            </div>
        </li>
    {/items}
</ul>