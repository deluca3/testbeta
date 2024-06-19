{! This template requires the inclusion of the profile_tradeOfferList template !}
{#transactions}
    <div class="transactionBlock"{?accepted} data-transactionID="{.transactionID}"{/accepted}>
        <div class="row flatCols" style="margin-top: 25px; margin-bottom: 3px;">
            <div class="col-xs-3">
                <div class="col-xs-5">
                    <a href="#">
                        {?.toUser}
                            <a href="/profile/{.username}">
                                <img src="{.avatar}" class="img-responsive">
                            </a>
                        {:else}
                            <a href="/profile/{user.username}">
                                <img src="{user.avatar}" class="img-responsive">
                            </a>
                        {/.toUser}
                    </a>
                </div>
                <div class="col-xs-7">
                    <ul class="feedList noBottomBorder" style="margin-bottom: 0; margin-left: 5px;">
                        <li>
                            <div class="responsive-text">
                                {?.toUser}
                                    <a href="/profile/{.username}" class="profileHeader">{.displayName}</a>
                                {:else}
                                    <a href="/profile/{user.username}" class="profileHeader">{user.displayName}</a>
                                {/.toUser}
                            </div>
                        </li>
                        <li>
                            <div>
                                {?.toUser}
                                    <a href="/profile/{.username}">
                                        {>stars:. /}
                                    </a>
                                {:else}
                                    <a href="/profile/{user.username}">
                                        {>stars:user /}
                                    </a>
                                {/.toUser}
                            </div>
                        </li>
                        <li>
                            {?.toUser}
                                {.location}
                            {:else}
                                {user.location}
                            {/.toUser}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-xs-1"></div>
            <div class="col-xs-3">
                <div class="col-xs-5">
                    <a href="#">
                        {?.toUser}
                            <a href="/profile/{user.username}">
                                <img src="{user.avatar}" class="img-responsive">
                            </a>
                        {:else}
                            <a href="/profile/{.username}">
                                <img src="{.avatar}" class="img-responsive">
                            </a>
                        {/.toUser}
                    </a>
                </div>
                <div class="col-xs-7">
                    <ul class="feedList noBottomBorder" style="margin-bottom: 0; margin-left: 5px;">
                        <li>
                            <div class="responsive-text">
                                {?.toUser}
                                    <a href="/profile/{user.username}" class="profileHeader">{user.displayName}</a>
                                {:else}
                                    <a href="/profile/{.username}" class="profileHeader">{.displayName}</a>
                                {/.toUser}
                            </div>
                        </li>
                        <li>
                            <div>
                                {?.toUser}
                                    <a href="/profile/{user.username}">
                                        {>stars:user /}
                                    </a>
                                {:else}
                                    <a href="/profile/{.username}">
                                        {>stars:. /}
                                    </a>
                                {/.toUser}
                            </div>
                        </li>
                        <li>
                            {?.toUser}
                                {user.location}
                            {:else}
                                {.location}
                            {/.toUser}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row transactionRow">
            <div class="col-xs-3 flatCol">
                <div class="offerList" style="height: 264px;" data-offerID="{.offerID}">
                    {>transactionOfferList:.offers/}
                </div>
            </div>
            <div class="col-xs-1 flatCol">
                <div style="margin: 90px 10px; text-align: center;">
                    <img class="img-responsive" src="/img/forDot.png">
                </div>
            </div>
            <div class="col-xs-3 flatCol">
                {>transactionOfferList:.forItem/}
            </div>
            <div class="row">
                <div class="col-xs-5">
                    <div class="transactionStatus">
                        <span>Status:&nbsp;</span>

                        {?.accepted}
                            <span style="color: #008800;">Accepted</span>
                        {/.accepted}

                        {?.pending}
                            <span style="color: #ff8d05;">Pending</span>
                        {/.pending}

                        {?.declined}
                            <span style="color: #c60f0f;">Declined</span>
                        {/.declined}
                    </div>
                    <br/>

                    {?toUser}
                        {?.pending}
                            <a href="#" class="btn btn-primary">View Offer</a>
                        {/.pending}
                    {:else}
                        {?.pending}
                            <a href="#" class="btn btn-danger">Cancel Offer</a>
                        {/.pending}
                    {/toUser}

                    {?.accepted}
                        <a href="/transaction/{.transactionID}" class="btn btn-warning">Review Transaction</a>
                    {/.accepted}
                </div>
            </div>
        </div>
    </div>
{/transactions}