{?iconMode}
    {#results:.}
        <div class="row" style="margin-top: 15px;">
            {?C1}
                <div class="col-xs-4">
                    <div style="margin: 0;" class="itemBox" data-itemID="{C1.id}">
                        <div class="itemImage fixedRatioContainer">
                            <div class="fixedRatioDummy"></div>
                            <div class="fixedRatio">
                                <a href="/item/{C1.id}">
                                    <img src="{C1.url}" class="fullSize">
                                </a>
                            </div>
                        </div>
                        <div class="itemInfo">
                            <div style="font-weight: bold;" class="itemText itemLink">
                                <a href="/item/{C1.id}">{C1.name}</a>
                            </div>
                            <div class="itemText">{C1.description}</div>
                        </div>
                    </div>
                </div>
            {/C1}

            {?C2}
                <div class="col-xs-4">
                    <div style="margin: 0;" class="itemBox" data-itemID="{C2.id}">
                        <div class="itemImage fixedRatioContainer">
                            <div class="fixedRatioDummy"></div>
                            <div class="fixedRatio">
                                <a href="/item/{C2.id}">
                                    <img src="{C2.url}" class="fullSize">
                                </a>
                            </div>
                        </div>
                        <div class="itemInfo">
                            <div style="font-weight: bold;" class="itemText itemLink">
                                <a href="/item/{C2.id}">{C2.name}</a>
                            </div>
                            <div class="itemText">{C2.description}</div>
                        </div>
                    </div>
                </div>
            {/C2}

            {?C3}
                <div class="col-xs-4">
                    <div style="margin: 0;" class="itemBox" data-itemID="{C3.id}">
                        <div class="itemImage fixedRatioContainer">
                            <div class="fixedRatioDummy"></div>
                            <div class="fixedRatio">
                                <a href="/item/{C3.id}">
                                    <img src="{C3.url}" class="fullSize">
                                </a>
                            </div>
                        </div>
                        <div class="itemInfo">
                            <div style="font-weight: bold;" class="itemText itemLink">
                                <a href="/item/{C3.id}">{C3.name}</a>
                            </div>
                            <div class="itemText">{C3.description}</div>
                        </div>
                    </div>
                </div>
            {/C3}
        </div>
    {/results}
{:else}
    {#results:.}
        <div class="searchRow" data-itemID="{id}">
            <div class="row">
                <div style="margin-left: 15px;" class="pull-left">
                    <a href="/profile/{username}">
                        <img class="img-responsive" style="width: 60px; border: 1px solid #DDD;" src="{?avatar}{avatar}{:else}/img/stockUser.png{/avatar}">
                    </a>
                </div>
                <div style="font-size: 11px; margin-left: 5px;" class="col-xs-3 flatCol">
                    <a href="/profile/{username}">{username}</a>
                    <div>
                        {>stars:. /}
                    </div>
                    <div>{location}</div>
                </div>
            </div>
            <div style="border-bottom: 1px solid #DDD; padding: 10px 0 10px 0;" class="row">
                <div class="col-xs-3">
                    <a href="/item/{id}">
                        <img class="img-responsive" src="{url}">
                    </a>
                </div>
                <div class="col-xs-9">
                    <div class="pull-right">
                        <a href="/offer/{id}" class="btn btn-success" style="width: 125px; margin-bottom: 2px;">Make Offer</a>
                        {!<br/>
                        <a href="#" class="btn btn-default" style="width: 125px;">Watch</a>!}
                    </div>
                    <h4 style="margin-top: 0;"><a href="/item/{id}">{name}</a></h4>
                    <div style="width: 60%" class="pull-left">{description}</div>
                </div>
            </div>
        </div>
    {/results}
{/iconMode}