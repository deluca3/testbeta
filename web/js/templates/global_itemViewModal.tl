
<div class="mfp-figure">
    <div class="mfp-close"></div>
        <div class="pull-left">
            <div class="mfp-img"></div>
        </div>

        <div class="pull-left lbSideContainer">
            <div class="lbSideWrap">
                {?isOwned}
                {:else}
                <div class="row">
                    <div class="col-xs-4">
                        {! TODO: Drop user profile pic here !}
                        <img src="/img/stockUser.png" class="img-responsive"/>
                    </div>
                    <div class="col-xs-8">
                        <ul class="list-unstyled">
                            <li>{owner.username}</li>
                            <li>
                                <div class="starContainer">
                                    {! TODO: Make this work w/ the template !}
                                    <img src="/img/multistar.png" class="img-responsive"/>
                                </div>
                            </li>
                            <li>{owner.location}</li>
                        </ul>
                    </div>
                </div>
                {/isOwned}
                <div>
                    {?isOwned}{:else}<hr class="niceLine"/>{/isOwned}
                    <h3>{itemName}</h3>
                    {?itemQty}<span><b>Quantity:&nbsp;</b>{itemQty}</span>{/itemQty}
                    <div><b>Description:&nbsp;</b>{itemDescription}</div>
                    <hr class="niceLine"/>

                    {?isOwned}
                    <div class="btn-group-responsive">
                        <a href="/item/{itemID}" class="btn btn-primary">View Item</a>
                    </div>
                    <hr class="niceLine"/>
                    {:else}
                    <div class="btn-group col-xs-12 flatCol">
                        <a href="/item/{itemID}" class="btn btn-primary col-xs-6">View Item</a>
                        {?watched}
                            <a href="#" data-itemID="{itemID}" class="btn btn-default col-xs-6 btnUnwatchItem">Watching</a>
                        {:else}
                            <a href="#" data-itemID="{itemID}" class="btn btn-default col-xs-6 btnWatchItem">Watch</a>
                        {/watched}
                    </div>
                    <hr class="niceLine"/>
                    {/isOwned}

                    {#images:.}
                    <div class="row">
                        {?C1.thumbSrc}
                        <div class="col-xs-6">
                            <div class="itemImageThumb">
                                <img src="{C1.thumbSrc}" class="img-responsive"/>
                            </div>
                        </div>
                        {/C1.thumbSrc}

                        {?C2.thumbSrc}
                        <div class="col-xs-6">
                            <div class="itemImageThumb">
                                <img src="{C2.thumbSrc}" class="img-responsive"/>
                            </div>
                        </div>
                        {/C2.thumbSrc}
                    </div>
                    {/images}
                </div>
            </div>
        </div>
    </div>
</div>