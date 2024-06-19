{#.:.}
    {! This template requires the inclusion of the trade_offerList & stars templates !}

    <div class="row rowFit">

        {?C1}
            <div class="col-xs-4 offerCol">
                <div class="row rowFit flatCols userData">
                    <div class="col-xs-4">
                        <a href="/profile/{C1.username}"><img src="{C1.avatar}" class="img-responsive"></a>
                    </div>
                    <div class="col-xs-8">
                        <ul class="feedList noBottomBorder">
                            <li><a href="/profile/{C1.username}" class="profileHeader">{C1.displayName}</a></li>
                            <li>
                                <div>
                                    {>stars:C1 /}
                                </div>
                            </li>
                            <li>{C1.location}</li>
                        </ul>
                    </div>
                </div>

                <div class="offerBox" data-offerID="{C1.offerID}" data-forQuantity="{C1.forQuantity}" data-qty="{?C1.offerQty}{C1.offerQty}{:else}1{/C1.offerQty}">
                    {>offerList:C1/}
                </div>

                <div class="offerBtns btn-group col-xs-12 flatCol">
                    <button class="btn btn-lg btn-danger pull-left col-xs-6 btnOfferReject"><i class="icon-thumbs-down"></i></button>
                    <button class="btn btn-lg btn-success pull-right col-xs-6 btnOfferAccept"><i class="icon-thumbs-up"></i></button>
                </div>
            </div>
        {/C1}

        {?C2}
            <div class="col-xs-4 offerCol">
                <div class="row rowFit flatCols userData">
                    <div class="col-xs-4">
                        <a href="/profile/{C2.username}"><img src="{C2.avatar}" class="img-responsive"></a>
                    </div>
                    <div class="col-xs-8">
                        <ul class="feedList noBottomBorder">
                            <li><a href="/profile/{C2.username}" class="profileHeader">{C2.displayName}</a></li>
                            <li>
                                <div>
                                    {>stars:C2 /}
                                </div>
                            </li>
                            <li>{C2.location}</li>
                        </ul>
                    </div>
                </div>

                <div class="offerBox" data-offerID="{C2.offerID}" data-forQuantity="{C2.forQuantity}"  data-qty="{?C2.offerQty}{C2.offerQty}{:else}1{/C2.offerQty}">
                    {>offerList:C2/}
                </div>

                <div class="offerBtns btn-group col-xs-12 flatCol">
                    <button class="btn btn-lg btn-danger pull-left col-xs-6 btnOfferReject"><i class="icon-thumbs-down"></i></button>
                    <button class="btn btn-lg btn-success pull-right col-xs-6 btnOfferAccept"><i class="icon-thumbs-up"></i></button>
                </div>
            </div>
        {/C2}

        {?C3}
            <div class="col-xs-4 offerCol">
                <div class="row rowFit flatCols userData">
                    <div class="col-xs-4">
                        <a href="/profile/{C3.username}"><img src="{C3.avatar}" class="img-responsive"></a>
                    </div>
                    <div class="col-xs-8">
                        <ul class="feedList noBottomBorder">
                            <li><a href="/profile/{C3.username}" class="profileHeader">{C3.displayName}</a></li>
                            <li>
                                <div>
                                    {>stars:C3 /}
                                </div>
                            </li>
                            <li>{C3.location}</li>
                        </ul>
                    </div>
                </div>

                <div class="offerBox" data-offerID="{C3.offerID}" data-forQuantity="{C3.forQuantity}"  data-qty="{?C3.offerQty}{C3.offerQty}{:else}1{/C3.offerQty}">
                    {>offerList:C3/}
                </div>

                <div class="offerBtns btn-group col-xs-12 flatCol">
                    <button class="btn btn-lg btn-danger pull-left col-xs-6 btnOfferReject"><i class="icon-thumbs-down"></i></button>
                    <button class="btn btn-lg btn-success pull-right col-xs-6 btnOfferAccept"><i class="icon-thumbs-up"></i></button>
                </div>
            </div>
        {/C3}

    </div>
{/.}