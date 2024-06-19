{#.:.}
    <div class="row feedRow">
        <div class="col-xs-1 flatCol">
            <img class="img-responsive feedAvatar" src="{avatar}">
        </div>

        <div class="col-xs-11">
            {@eq key=type value=1} {! Note !}
                {>feed_note:metadata/}
            {/eq}

            {@eq key=type value=2} {! Transaction !}
                {>feed_transaction:metadata/}
            {/eq}

            {@eq key=type value=3} {! Upload !}
                {>feed_upload:metadata/}
            {/eq}

            {@eq key=type value=4} {! Follow !}
                {>feed_follow:metadata/}
            {/eq}

            <br>

            <div class="feedTimestamp">
                {#timeFrom timestamp=addedAt /} {! Custom dust function, passed in with data during render !}
            </div>
        </div>
    </div>
{/.}