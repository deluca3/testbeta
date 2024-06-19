<ul class="itemList">
    {#items}
        <li data-itemID="{.id}" class="itemBox {@if cond="({$idx} - 1) % 4 == 2"}last{/if}">
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
                    <div><a href="/profile/stephen">Stephen DeLuca</a></div> {! For home mock TODO: Change this to use username of who owns items !}
                </div>
            </div>
        </li>
    {/items}
</ul>