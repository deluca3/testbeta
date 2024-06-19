{#.:.}
    <div class="row wishRow" {?notEditor}{:else}data-id="{id}"{/notEditor}>
        {?notEditor}{:else}
            <div style="margin-top: 5px;" class="col-xs-1">
                <input class="chkWish" type="checkbox">
            </div>
        {/notEditor}

        <div style="margin-top: 5px;" class="{?notEditor}col-xs-4{:else}col-xs-3{/notEditor}">
            <div class="responsive-text">
                {identifier}
            </div>
        </div>

        <div style="margin-top: 5px;" class="{?notEditor}col-xs-8{:else}col-xs-6{/notEditor}">
            <div class="responsive-text">
                {tags}
            </div>
        </div>

        <div class="col-xs-2">
            {?notEditor}{:else}
                <div class="pull-right">
                    <button class="btn btn-sm btn-info btnEditWish"><i class="glyphicon glyphicon-edit"></i></button>
                    &nbsp;
                    <button class="btn btn-sm btn-danger btnDeleteWish"><i class="glyphicon glyphicon-remove"></i></button>
                </div>
            {/notEditor}
        </div>
    </div>
{/.}