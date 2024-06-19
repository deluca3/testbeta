{#.:.}

    {?hasThumb}
    <div class="col-xs-2">
        <div class="listingThumb">
            {?serverThumb}
                <img src="{serverThumb}" style="width: 75px; height: auto;"/>
            {/serverThumb}
        </div>
    </div>
    {/hasThumb}
    <div class="{?hasThumb}col-xs-10{:else}col-xs-12{/hasThumb}">
        {?fileName}
        <div title="{fileName}" class="listingFileData">
            <b>Filename:</b>
            {fileName}
        </div>
        {:else}
            {?serverThumb}
                <div title="This picture is already attached to the item." class="listingFileData mdlItem_preUploaded">
                    <i class="icon-upload"></i>&nbsp;Uploaded
                </div>
            {/serverThumb}
        {/fileName}


        <div class="picListingRightTray">
            <div class="mdlItem_isThumb" style="display: {?isThumb}inline-block{:else}none{/isThumb};" title="Currently set as thumbnail"><span class="icon-pushpin"></span></div>
            <button {?isThumb}style="display: none;"{/isThumb} type="button" title="Set as item thumbnail" data-isThumb="{?isThumb}{isThumb}{/isThumb}" class="btn btn-sm btn-info mdlItem_btnSetThumb"><span class="glyphicon glyphicon-pushpin"></span></button>
            <button type="button" title="Remove picture" class="btn btn-sm btn-danger mdlItem_btnRemoveImg"><span class="glyphicon glyphicon-remove"></span></button>
            <button type="button" style="display: none;" title="Undo remove" class="btn btn-sm btn-warning mdlItem_btnUndoRemove"><span class="icon-undo"></span></button>
        </div>
    </div>

{/.}