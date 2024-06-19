{#.:.}
<div class="row rowFit col-xs-12 reviewRow">
    <div style="margin-bottom: 15px;" class="row">
        <div class="col-xs-12 flatCol reviewHeader">
            <div style="margin-top: 3px;" class="col-xs-1">
                <img class="img-responsive feedAvatar" src="{avatar}">
            </div>

            <div style="margin-top: 15px;" class="col-xs-10 flatCol">
                <span>Reviewed by <a href="/profile/{username}">{username}</a></span>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-2">
            <img class="img-responsive feedAvatar" src="{url}">
        </div>

        <div class="col-xs-10 flatCol">
            <a href="#"><b>{name}</b></a>

            <div>
                {>stars:. /}
            </div>

            <div class="feedText reviewText">
                {reviewText}
            </div>

            <br/>
            <div class="feedTimestamp">{#timeFrom timestamp=addedAt /} {! Custom dust function, passed in with data during render !}</div>
        </div>
    </div>
</div>
{/.}