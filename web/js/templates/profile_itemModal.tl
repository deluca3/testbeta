<div class="modal-content">
    <div class="modal-header">
        <button type="button" class="close hideForUpload" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4><i class="{?editMode}icon-edit{:else}icon-upload-alt{/editMode}"></i>&nbsp;{?editMode}Item Editor{:else}Item Upload{/editMode}</h4>
    </div>
    <div class="modal-body">
        <div class="panel panel-primary hideForUpload">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="icon-pencil">&nbsp;</i>What is your item?</h3>
            </div>
            <div class="panel-body">
                <form class="form-horizontal label-justify-left" role="form" id="mdlItem_inputForm">
                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_nameField">Name:</label>
                        <div class="col-xs-10">
                            <input type="text" value="{itemName}" class="form-control" id="mdlItem_nameField" data-required="true" data-minlength="4" data-maxlength="64">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_descField">Description:</label>
                        <div class="col-xs-10">
                            <textarea class="form-control" style="resize: vertical;" id="mdlItem_descField" data-required="true" data-rangelength="[10,512]">{itemDescription}</textarea>
                            <label class="control-label" for="mdlItem_descField">Characters remaining:&nbsp;</label>
                            <label id="mdlItem_descCount" class="control-label" for="mdlItem_descField"></label>
                            <div class="form-error-container"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_condField">Condition:</label>
                        <div class="col-xs-10">
                            <select class="form-control" id="mdlItem_condField" data-trigger="change" data-required="true">
                                <option value=""></option>
                                <option value="1">Used</option>
                                <option value="2">New</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_qtyField">Quantity:</label>
                        <div class="col-xs-10">
                            <input type="text" id="mdlItem_qtyField" value="{?itemQty}{itemQty}{:else}1{/itemQty}"
                                   class="form-control" data-type="digits" data-min="1" data-max="1000" maxlength="4"
                                   data-required="true" style="width: 80px; display: inline-block;"/>

                            <div class="btn-group" style="margin-left: 1px;">
                                <button id="mdlItem_btnQtyDown" type="button" class="btn btn-default"><i class="icon-arrow-down"></i></button>
                                <button id="mdlItem_btnQtyUp" type="button" class="btn btn-default"><i class="icon-arrow-up"></i></button>
                            </div>
                            &nbsp;
                            <div class="form-error-container" style="display: inline-block;"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_tagField">Tags:</label>
                        <div class="col-xs-10">
                            <div class="input-group">
                                <input type="text" id="mdlItem_tagField" class="form-control tagField" class="tm-input" maxlength="16"/>
                                <span class="input-group-btn tagFieldBtn">
                                    <button id="mdlItem_btnAddTag" class="btn btn-success" type="button"><i class="glyphicon glyphicon-plus"></i></button>
                                </span>
                            </div>

                            <input type="hidden" id="mdlItem_tagData" data-maxlength="256"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-2 control-label" for="mdlItem_btnSelCategory">Category:</label>
                        <div class="col-xs-8">
                            <div class="responsive-text" style="margin-top: 7px;">
                                <span id="mdlItem_categoryName">{?itemCategory.name}{itemCategory.name}{:else}Please choose a category.{/itemCategory.name}</span>
                            </div>

                            <input type="hidden" id="mdlItem_categoryID" data-required="true" value="{?itemCategory.id}{itemCategory.id}{/itemCategory.id}"/>
                            <div class="form-error-container"></div>
                        </div>
                        <div class="col-xs-2">
                            <button id="mdlItem_btnSelCategory" type="button" class="btn btn-sm btn-primary pull-right">Choose</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="panel panel-primary hideForUpload">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="icon-shopping-cart">&nbsp;</i>How do you want to list it?</h3>
            </div>
            <div class="panel-body" style="padding-bottom: 0;">
                <form class="label-justify-left" role="form">

                    <div class="row" style="border-bottom: 1px solid #CCCCCC; margin-bottom: 10px;">
                        <div class="row rowFit form-group" style="margin: 0;">
                            <label class="col-xs-6 control-label toggleLabel">List item now?</label>
                            <div class="col-xs-6">
                                &nbsp;<div id="mdlItem_toggleListing" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                                <input type="checkbox" id="mdlItem_chkListItem" style="display: none;" {?editMode}{itemListed}{:else}checked="checked"{/editMode} />
                            </div>
                        </div>
                        <div class="col-xs-12" id="mdlItem_isUnlisted" style="{?editMode}{?itemListed}display: none;{/itemListed}{:else}display: none;{/editMode}">
                            <span class="help-block">
                                If you turn this option off your item will not show up in search results or on your public profile.&nbsp;
                                We provide this option to allow you to bulk upload but only offer a partial selection of your&nbsp;
                                inventory at a given time. The item will still be visible to you.
                            </span>
                        </div>
                    </div>

                    <div class="row form-group" style="border-bottom: 1px solid #CCCCCC;">
                        <label class="col-xs-6 control-label toggleLabel">Allow trade offers?</label>
                        <div class="col-xs-6">
                            &nbsp;<div id="mdlItem_toggleAllowTrade" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                            <input type="checkbox" style="display: none;" id="mdlItem_chkAllowTrade" {?editMode}{allowTrades}{:else}checked="checked"{/editMode}/>
                        </div>
                    </div>

                    <div class="row form-group" style="border-bottom: 1px solid #CCCCCC;">
                        <label class="col-xs-6 control-label toggleLabel">Allow cash offers?</label>
                        <div class="col-xs-6">
                            &nbsp;<div id="mdlItem_toggleAllowCash" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                            <input type="checkbox" style="display: none;" id="mdlItem_chkAllowCash" {?editMode}{allowCash}{/editMode}/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="row rowFit form-group" style="margin: 0;">
                            <label class="col-xs-6 control-label toggleLabel">Set a Buy Now price?</label>
                            <div class="col-xs-6">
                                &nbsp;<div id="mdlItem_toggleBuyNow" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                                <input type="checkbox" style="display: none;" id="mdlItem_chkBuyNow" {?editMode}{?buyNow}checked="checked"{/buyNow}{/editMode}/>
                            </div>
                        </div>
                        <div class="col-xs-12" id="mdlItem_hasBuyNow" style="{?buyNow}{:else}display: none;{/buyNow} margin-bottom: 10px;">
                            What price would you like to set for this item?&nbsp;
                            <div class="input-group">
                                <span class="input-group-addon">$</span>
                                <input type="text" class="form-control" id="mdlItem_buyPrice" value="{?editMode}{buyNow}{/editMode}" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="panel panel-primary hideForUpload">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="icon-truck">&nbsp;</i>How are you going to deliver it?</h3>
            </div>
            <div class="panel-body" style="padding-bottom: 0;">
                <form class="label-justify-left" role="form">

                    <div class="row" style="border-bottom: 1px solid #CCCCCC; margin-bottom: 10px;">
                        <div class="row rowFit form-group" style="margin: 0;">
                            <label class="col-xs-6 control-label toggleLabel">Are you willing to meet up?</label>
                            <div class="col-xs-6">
                                &nbsp;<div id="mdlItem_toggleMeetup" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                                <input type="checkbox" style="display: none;" id="mdlItem_chkMeetup" {?editMode}{@gt key=travelDistance value=0}checked="checked"{/gt}{/editMode}/>
                            </div>
                        </div>
                        <div class="col-xs-12" id="mdlItem_willMeetup" style="{?editMode}{@gt key=travelDistance value=0}{:else}display: none;{/gt}{:else}display: none;{/editMode} margin-bottom: 10px;">
                            How far are you willing to travel?&nbsp;
                            <select class="form-control" id="mdlItem_travelDistance">
                                <option value="0"></option>
                                <option value="1">No limit</option>
                                <option value="2">5 - 10 miles</option>
                                <option value="3">10 - 20 miles</option>
                                <option value="4">20 - 30 miles</option>
                                <option value="5">30 - 40 miles</option>
                                <option value="6">40 - 50 miles</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="row rowFit form-group" style="margin: 0;">
                            <label class="col-xs-6 control-label toggleLabel">Are you willing to ship the item?</label>
                            <div class="col-xs-6">
                                &nbsp;<div id="mdlItem_toggleShip" style="display: inline-block;" class="toggle toggle-light pull-right"></div>
                                <input type="checkbox" style="display: none;" id="mdlItem_chkShip" {?editMode}{@gt key=shipTimeframe value=0}checked="checked"{/gt}{/editMode}/>
                            </div>
                        </div>
                        <div class="col-xs-12" id="mdlItem_willShip" style="{?editMode}{@gt key=shipTimeframe value=0}{:else}display: none;{/gt}{:else}display: none;{/editMode} margin-bottom: 10px;">
                            What is the estimated shipping time frame?&nbsp;
                            <select class="form-control" id="mdlItem_shipTime">
                                <option value="0"></option>
                                <option value="1">1 - 3 Days</option>
                                <option value="2">3 - 5 Days</option>
                                <option value="3">5 - 10 Days</option>
                                <option value="4">10 - 15 Days</option>
                                <option value="5">15 - 20 Days</option>
                                <option value="6">20+ Days</option>
                            </select>
                        </div>
                    </div>

                </form>
            </div>
        </div>

        <div class="panel panel-primary hideForUpload" style="margin-bottom: 0;">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <i class="glyphicon glyphicon-camera" style="margin-right: 7px;"></i>
                    What does it look like?
                </h3>
            </div>
            <div class="panel-body fileinput-div" id="mdlItem_dropzone">
                    <span style="width: 100%;" class="btn btn-large btn-success fileinput-button">
                        <i class="glyphicon glyphicon-plus"></i>
                        <span>Add Pictures</span>
                        <input type="file" name="files[]" multiple>
                    </span>

                <br/>

                <div style="text-align: center;">
                    Click the button or drag and drop to add pictures.
                    <br/>
                    <div style="display: none;" id="mdlItem_imageError" class="label label-danger div-ellipsis">You must add at least one picture.</div>
                </div>

                <div class="picListing" style="display: none;">
                    <div style="overflow:hidden;" id="mdlItem_picListing"></div>
                </div>
            </div>
        </div>

        <div class="panel panel-default" id="mdlItem_progressPanel" style="margin-bottom: 0; display: none;">
            <div class="panel-body">
                <div style="text-align: center" id="mdlItem_uploadStatus">Please wait while your item is uploaded...</div>
                <div class="progress progress-striped active" style="margin-bottom: 0;">
                    <div style="width: 0;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="progress-bar" id="mdlItem_uploadProgress">
                        <span class="sr-only">0% Complete</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer" style="margin-top: 0;">
        <div class="hideForUpload">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>

            {?editMode}
                <button type="button" id="mdlItem_btnEditItem" class="btn btn-success">Done</button>
            {:else}
                <button type="button" id="mdlItem_btnAddItem" class="btn btn-success">Add Item</button>
            {/editMode}
        </div>

        <div style="display: none; text-align: center;" id="mdlItem_finishDiv">
            <img src="img/ajax-loader.gif" id="mdlItem_spinner"/>
            <button style="display: none;" class="btn btn-lg btn-success" id="mdlItem_btnFinish" type="button">Finish</button>
        </div>
    </div>
</div>