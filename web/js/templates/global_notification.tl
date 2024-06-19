{#.:.}
    <a href="{url}" class="row rowFit notifRow flatCols">
        <div class="col-xs-2">
            <img class="img-responsive notifAvatar" src="{avatar}">
        </div>
        <div class="col-xs-10">
            <div class="notifData">
                <div class="notifText">
                    {@eq key=type value=1} {! Message !}
                        {>notif_message:metadata/}
                    {/eq}

                    {@eq key=type value=2} {! Offer !}
                        {>notif_offer:metadata/}
                    {/eq}

                    {@eq key=type value=3} {! Transaction !}
                        {>notif_transaction:metadata/}
                    {/eq}
                </div>

                <div class="notifTimestamp">
                    {#timeFrom timestamp=addedAt /} {! Custom dust function, passed in with data during render !}
                </div>
            </div>
        </div>
    </a>
{/.}