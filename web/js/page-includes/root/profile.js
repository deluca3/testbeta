/******************************************************************************
 * Globals
 ******************************************************************************/

var jcrop = null;
var thumb_width, thumb_height, thumb_itemID;
var file_count = 0, firstImage = false;
var editItemID = 0, editWishID = 0;
var maxFileSize = 26214400; //25MB
var spinnerTimer = 0;

/******************************************************************************
 * Wishlist Functions
 ******************************************************************************/

function wishlist_showAdd() {
    $(".wishlist_modeView").hide();
    $(".wishlist_modeAddEdit").find(":input").val("").end().show();

    $("#mdlWishlist_txtTags").tagsManager('empty');
}

function wishlist_showEdit(wishID) {
    $(".wishlist_modeView").hide();
    $("#wishlist_modeLoading").show();

    var callbacks = {
        "success": function(data) {
            editWishID = wishID;

            $("#mdlWishlist_txtWishName").val(data['identifier']);

            $("#mdlWishlist_txtTags").tagsManager('empty').tagsManager('fill', data['tags']);

            $("#wishlist_modeLoading").hide();
            $(".wishlist_modeAddEdit").show();
        },
        "noWish": function() {
            bootbox.alert("Failed to load wish");
            wishlist_showView();
        }
    };

    $API.getWish(wishID, callbacks);
}

function wishlist_showView() {
    $(".wishlist_modeAddEdit").hide();

    loadWishlist();
    $(".wishlist_modeView").show();
}

function wishlist_add() {
    var ident = $("#mdlWishlist_txtWishName").val();
    var tags = $("#mdlWishlist_tagData").val();

    if(ident.length > 0 && tags.length > 0) {
        $API.addWishlist(ident, tags, function() {
            wishlist_showView();
        });

        //TODO: Error handling
    } else bootbox.alert("You must enter a valid wish and tags to help identify it.");
}

function wishlist_edit() {
    var ident = $("#mdlWishlist_txtWishName").val();
    var tags = $("#mdlWishlist_tagData").val();

    if(ident.length > 0 && tags.length > 0) {
        $API.updateWishlist(editWishID, ident, tags, function() {
            wishlist_showView();
        });

        //TODO: Error handling
    } else bootbox.alert("You must enter a valid wish and tags to help identify it.");
}

function wishlist_delete(wishID) {
    $API.removeWishlist(wishID, function() {
        wishlist_showView();
    });
}

/******************************************************************************
 * Image Upload Functions
 ******************************************************************************/

function imgUpload_add(e, data) {
    var uploadErrors = [];
    var acceptFileTypes = /^image\/(jpe?g|png)$/i;

    //Check file type
    if(!acceptFileTypes.test(data.originalFiles[0]['type'])) {
        uploadErrors.push('You cannot upload anything beside JPEG and PNG images.');
    }

    //Check file size
    if(data.originalFiles[0]['size'] > maxFileSize) {
        uploadErrors.push('File size is too big.');
    }

    if(uploadErrors.length > 0) { //We had errors
        bootbox.alert(uploadErrors.join("\n"));
    } else { //Good to go
        $("#mdlItem_imageError").hide();

        data.context = $('<div/>')
            .addClass("row picListingRow uploadImage")
            .css("display", "none")
            .data("file", data)
            .appendTo('#mdlItem_picListing');

        //First image, make it the default thumb.
        if(file_count == 0) {
            data.context.data("isThumb", true);
            firstImage = true;
        }

        ++file_count;
    }
}

function imgUpload_process(e, data) {
    if(data.context) {
        var index = data.index,
            file = data.files[index],
            templateData = {};

        if (file.preview) {
            templateData['hasThumb'] = true;
        }

        if (file.name) {
            templateData['fileName'] = file.name;
        }

        if (file.error) {
            bootbox.alert(file.error);
        }

        if(firstImage) {
            templateData['isThumb'] = true;
            firstImage = false;
        }

        dust.render("picListing", templateData, function(err, out) {
            data.context.html(out).fadeIn();

            if (file.preview) {
                data.context.find(".listingThumb").append(file.preview);
            }

            mdlItem_initPicListing(data);
        });
    }
}

function imgUpload_stop(e) {
    //Upload was successful
    $("#mdlItem_uploadProgress").stop(true).css("width", "100%");
    $("#mdlItem_uploadStatus").html("<b>Upload Complete!</b>");
    $("#mdlItem_spinner").hide();
    $("#mdlItem_btnFinish").show();
}

function imgUpload_progress(e, data) {
    var progress = parseInt(data.loaded / data.total * 100, 10);
    $("#mdlItem_uploadProgress").animate({"width": progress + "%"}, 99);
}

function doImageUpload(itemID) {
    var fileData = [];

    //Get image file data together in an array
    $("#mdlItem_picListing .uploadImage").each(function(index, elem) {
        if($(elem).data("file") != undefined) {
            fileData.push($(elem).data("file"));

            if($(elem).data("isThumb") != undefined) {
                fileData[fileData.length - 1]['isThumb'] = true;
            }
        }
    });

    //Ship images off to server
    if(fileData.length > 0) {
        for(var fileIndex in fileData) {
            $('#mdlItem_dropzone').fileupload('option', 'formData', {
                "itemID": itemID,
                "isThumb": (fileData[fileIndex]['isThumb'] ? 1 : 0)
            });

            fileData[fileIndex].submit();
        }
    } else { //No images to upload, just finish.
        imgUpload_stop(null);
    }
}

/******************************************************************************
 * Item Modal Functions
 ******************************************************************************/

function mdlItem_doItemAdd() {
    //Hide info, button & image panels
    $(".hideForUpload").stop(true).fadeOut().last().queue(function(){
        //Show spinner
        $("#mdlItem_finishDiv").fadeIn();

        //Show progress panel
        $("#mdlItem_progressPanel").slideDown(function() {
            var itemQty = parseInt($("#mdlItem_qtyField").val());
            if(itemQty < 1) itemQty = 1;

            //Create item itself.
            var newItem = {
                "name": $("#mdlItem_nameField").val(),
                "quantity": itemQty,
                "description": $("#mdlItem_descField").val(),
                "condition": $("#mdlItem_condField").val(),
                "tags": $("#mdlItem_tagData").val(),
                "category": $("#mdlItem_categoryID").val(),
                "allowTrades": $("#mdlItem_chkAllowTrade").is(":checked") ? 1 : 0,
                "allowCash": $("#mdlItem_chkAllowCash").is(":checked") ? 1 : 0,
                "buyNow": $("#mdlItem_chkBuyNow").is(":checked") ? parseFloat($("#mdlItem_buyPrice").val()) : null,
                "travelDistance": $("#mdlItem_travelDistance").val(),
                "shipTimeframe": $("#mdlItem_shipTime").val(),
                "listed": $("#mdlItem_chkListItem").is(":checked") ? true : false
            };

            //Execute the item add
            $API.addItem(newItem, function(itemID) {
                if(itemID) {
                    //Upload any images
                    doImageUpload(itemID);
                }
            });
        });
    });
}

function mdlItem_doItemEdit() {
    if(editItemID) {
        //Hide info, button & image panels
        $(".hideForUpload").stop(true).fadeOut().last().queue(function(){
            //Show spinner
            $("#mdlItem_finishDiv").fadeIn();

            //Show progress panel
            $("#mdlItem_progressPanel").slideDown(function() {
                var itemQty = parseInt($("#mdlItem_qtyField").val());
                if(itemQty < 1) itemQty = 1;

                //Do item edit call
                var updatedItem = {
                    "name": $("#mdlItem_nameField").val(),
                    "quantity": itemQty,
                    "description": $("#mdlItem_descField").val(),
                    "condition": $("#mdlItem_condField").val(),
                    "tags": $("#mdlItem_tagData").val(),
                    "category": $("#mdlItem_categoryID").val(),
                    "allowTrades": $("#mdlItem_chkAllowTrade").is(":checked") ? 1 : 0,
                    "allowCash": $("#mdlItem_chkAllowCash").is(":checked") ? 1 : 0,
                    "buyNow": $("#mdlItem_chkBuyNow").is(":checked") ? parseFloat($("#mdlItem_buyPrice").val()) : null,
                    "travelDistance": $("#mdlItem_travelDistance").val(),
                    "shipTimeframe": $("#mdlItem_shipTime").val(),
                    "listed": $("#mdlItem_chkListItem").is(":checked") ? true : false
                };

                var deletedImages = [];

                //Get deleted server image IDs together
                $("#mdlItem_picListing .serverImage").each(function(index, elem) {
                    if($(elem).data("imageID") != undefined) {
                        if($(elem).hasClass("picList_serverDelete")) {
                            deletedImages.push($(elem).data("imageID"));
                        }

                        if($(elem).data("isThumb") != undefined && !$(elem).data("originalThumb")) {
                            updatedItem['thumbID'] = $(elem).data("imageID");
                        }
                    }
                });

                //Add to the update
                if(deletedImages.length > 0) {
                    updatedItem['deleteImages'] = deletedImages;
                }

                //Execute the item update
                $API.updateItem(editItemID, updatedItem, function(data) {
                    if(data) {
                        //Upload any new images
                        doImageUpload(editItemID);
                    }
                });
            });
        });
    } else bootbox.alert("Edit mode failure. This is a bug.");
}

function mdlItem_btnRemoveImg(e) {
    e.preventDefault();

    var mThis = this;
    var $picListingRow = $(this).closest(".picListingRow");
    var isUploadImg = $picListingRow.hasClass("uploadImage");
    var isThumb = $picListingRow.data("isThumb") ? true : false;

    var _postDelete = function() {
        --file_count;

        //If we just removed the thumb then set a new one.
        var $validPics = $(".picListingRow:not(.picList_serverDelete)");

        if($validPics.length > 0 && isThumb) {
            if($($validPics[0])) mdlItem_setThumbContext({"context": $($validPics[0])});

            if(!isUploadImg) {
                $picListingRow.find(".mdlItem_btnSetThumb").hide();
            }
        }
    };

    //Kill the tooltips
    $(this).siblings(".mdlItem_btnSetThumb").tooltip("destroy");
    $(this).tooltip("destroy");

    if(!isUploadImg) { //Server side image
        var _removeServerImg = function() {
            if(isThumb) {
                //Reset the indicators/buttons to default
                $(".mdlItem_isThumb").hide();
                $(".mdlItem_btnSetThumb").show();
            }

            $(mThis).hide();
            $picListingRow.find(".mdlItem_btnSetThumb").hide();
            $picListingRow.find(".mdlItem_btnUndoRemove").show();

            $picListingRow.addClass("picList_serverDelete");

            $(".mdlItem_btnUndoRemove").tooltip({
                "placement": "right",
                "container": "body"
            });

            _postDelete();
        };

        if(isThumb) {
            confirmDialog("This image is set as the thumbnail, are you sure you want to mark it for removal?", "Remove Picture", function(result) {
                if(result) {
                    _removeServerImg();
                }
            });
        } else _removeServerImg();
    } else { //New image for upload
        confirmDialog("Do you want to remove this picture?", "Remove Picture", function(result) {
            if(result) {
                var $picListingParent = $("#mdlItem_picListing").parent();

                //Check if we're removing the last listing row, if so hide the listing div
                if($("#mdlItem_picListing .picListingRow").length == 1) {
                    $picListingParent.slideUp(function() {
                        e.data.context.remove();
                    });
                } else { //Otherwise fade out the row & remove it.
                    e.data.context.fadeOut(function() {
                        $(this).remove();
                    });
                }

                e.data.files.length = 0;

                _postDelete();
            }
        });
    }
}

function mdlItem_btnSetThumb(e) {
    e.preventDefault();

    mdlItem_setThumbContext(e.data);
}

function mdlItem_btnUndoRemove(e) {
    e.preventDefault();

    var mThis = this;
    var $picListingRow = $(mThis).closest(".picListingRow");
    var isServerImg = $picListingRow.hasClass("serverImage");

    if(isServerImg) {
        $(mThis).hide();
        $picListingRow.find(".mdlItem_btnRemoveImg, .mdlItem_btnSetThumb").show();

        $picListingRow.removeClass("picList_serverDelete");
    } else bootbox.alert("Internal error. This is a bug.");
}

function mdlItem_initPicListing(data) {
    var $picListingParent = $("#mdlItem_picListing").parent();

    //Activate button tooltips
    $(".mdlItem_btnSetThumb, .mdlItem_isThumb").tooltip({
        "placement": "left",
        "container": "body"
    });

    $(".mdlItem_btnRemoveImg, .mdlItem_preUploaded").tooltip({
        "placement": "right",
        "container": "body"
    });

    //Activate remove button functionality
    data.context.find(".mdlItem_btnRemoveImg").on("click", null, data, mdlItem_btnRemoveImg);

    //Activate set thumbnail button functionality
    data.context.find(".mdlItem_btnSetThumb").on("click", null, data, mdlItem_btnSetThumb);

    //Activate undo remove button
    data.context.find(".mdlItem_btnUndoRemove").on("click", null, data, mdlItem_btnUndoRemove);

    //Show the pic listing if it's not yet visible
    if($picListingParent.is(":not(:visible)")) {
        $picListingParent.slideDown();
    }
}

function mdlItem_setThumbContext(data) {
    //Clear any previous thumbnail data
    $("#mdlItem_picListing .picListingRow").removeData("isThumb");

    //Reset the indicators/buttons to default
    var $thumbIndicators = $(".mdlItem_isThumb");
    var $setThumbButtons = $(".mdlItem_btnSetThumb");

    $thumbIndicators.hide();
    $setThumbButtons.show();

    //Set thumb data attribute & change indicator
    data.context.data("isThumb", true);
    data.context.find(".mdlItem_btnSetThumb").hide();
    data.context.find(".mdlItem_isThumb").css("display", "inline-block");

    //Reactivate tooltips
    $thumbIndicators.tooltip({
        "placement": "left",
        "container": "body"
    });

    $setThumbButtons.tooltip({
        "placement": "left",
        "container": "body"
    });
}

function mdlItem_validateItem() {
    //Validate form fields
    var formValid = $("#mdlItem_inputForm").parsley("validate");

    //Check file count
    if(file_count <= 0) {
        $("#mdlItem_imageError").fadeIn();
    }

    return formValid && (file_count > 0);
}

function mdlItem_prepEditMode(itemID) {
    if(itemID) {
        var modalData = null;
        var retVal = [];

        //Load the item's data
        $API.getItem(itemID, true, function(itemData) {
            modalData = {
                "editMode": true,
                "itemName": itemData['name'],
                "itemQty": itemData['quantity'],
                "itemDescription": itemData['description'],
                "itemCondition": itemData['itemCondition'],
                "itemTags": itemData['tags'],
                "itemListed": parseInt(itemData['listed']) ? 'checked="checked"' : '',
                "allowTrades": parseInt(itemData['allowTrades']) ? 'checked="checked"' : '',
                "allowCash": parseInt(itemData['allowCash']) ? 'checked="checked"' : '',
                "buyNow": itemData['buyNow'],
                "travelDistance": parseInt(itemData['travelDistance']),
                "shipTimeframe": parseInt(itemData['shipTimeframe']),
                "itemCategory": itemData['category'],
                "thumbnail": itemData['thumbnail'],
                "images": itemData['images']
            };

            retVal['data'] = [];
            retVal['data']['modalData'] = modalData;
            retVal['data']['editMode'] = true;

            if(itemData['isOwner']) {
                editItemID = itemID;

                prepareItemModal(retVal);
            } else bootbox.alert("Cannot modify items owned by other users.");
        });
    }
}

function mdlItem_setupQtySpinner() {
    var _doSpinUp = function() {
        var $qtyField = $("#mdlItem_qtyField");
        var curQty = parseInt($qtyField.val());

        if(curQty < 1000) {
            ++curQty;
        } else curQty = 1000;

        $qtyField.val(curQty);
    };

    var _doSpinDown = function() {
        var $qtyField = $("#mdlItem_qtyField");
        var curQty = parseInt($qtyField.val());

        if(curQty > 1) {
            --curQty;
        } else curQty = 1;

        $qtyField.val(curQty);
    };

    $('#mdlItem_btnQtyUp').mousedown(function() {
        spinnerTimer = setInterval(_doSpinUp, 200);
    }).on('mouseup mouseleave', function() {
        clearTimeout(spinnerTimer);
    }).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        _doSpinUp();
    });

    $('#mdlItem_btnQtyDown').mousedown(function() {
        spinnerTimer = setInterval(_doSpinDown, 200);
    }).on('mouseup mouseleave', function() {
        clearTimeout(spinnerTimer);
    }).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        _doSpinDown();
    });
}

function prepareItemModal(e) {
    var modalData;

    //Load in modal data (edit mode)
    if(e.data['modalData']) {
        modalData = e.data['modalData'];
    } else modalData = [];

    //Template in item modal
    dust.render("itemModal", modalData, function(err, out) {
        var $itemModal = $("#mdlItem");

        $itemModal.html(out);

        //Reset item modal
        $(".hideForUpload, #mdlItem_spinner").show();
        $("#mdlItem_progressPanel, #mdlItem_finishDiv, #mdlItem_btnFinish, #mdlItem_imageError").hide();
        $("#mdlItem_uploadProgress").stop(true).css("width", "0%");
        $("#mdlItem_picListing").empty().parent().hide();
        file_count = 0;
        firstImage = false;

        var uploadStatus = "Please wait while your item is uploaded...";

        if(e.data['editMode']) { //Edit mode
            $("#mdlItem_condField").val(modalData['itemCondition']);

            //Edit item button click
            $("#mdlItem_btnEditItem").on('click', function(e) {
                e.preventDefault();

                //Validate, then upload
                if(mdlItem_validateItem()) {
                    mdlItem_doItemEdit();
                }
            });

            //Tags field
            $("#mdlItem_tagField").tagsManager({
                "output": "#mdlItem_tagData",
                "prefilled": modalData['itemTags'],
                "backspace": [],
                "maxTags": 16
            });

            //Set travel distance / ship timeframe
            $("#mdlItem_travelDistance").val(modalData['travelDistance']);
            $("#mdlItem_shipTime").val(modalData['shipTimeframe']);

            //Load in images
            var imageData = modalData['images'];

            //Render picture rows
            for(var imgIndex in imageData) {
                if(imageData[imgIndex]['id']) {
                    var templateData = {
                        "hasThumb": true,
                        "serverThumb": $apiLocation + "image/sizedimage/" + imageData[imgIndex]['id'] + "/75",
                        "isThumb": (modalData['thumbnail']['isThumb'] == imageData[imgIndex]['id'])
                    };

                    dust.render("picListing", templateData, function (err, out) {
                        var $picRow = $('<div/>')
                            .addClass("row picListingRow serverImage")
                            .data("imageID", imageData[imgIndex]['id'])
                            .html(out)
                            .appendTo('#mdlItem_picListing');

                        if(templateData['isThumb']) {
                            $picRow.data("isThumb", true);
                            $picRow.data("originalThumb", true);
                        }

                        ++file_count;

                        mdlItem_initPicListing({"context": $picRow});
                    });
                }
            }
        } else { //Add mode
            //Tags field
            $("#mdlItem_tagField").tagsManager({
                "output": "#mdlItem_tagData",
                "backspace": [],
                "maxTags": 16
            });

            //Add item button click
            $("#mdlItem_btnAddItem").on('click', function(e) {
                e.preventDefault();

                //Validate, then upload
                if(mdlItem_validateItem()) {
                    mdlItem_doItemAdd();
                } else $itemModal.modal("attention");
            });
        }

        //Category
        $("#mdlItem_btnSelCategory").on('click', function(e) {
            e.preventDefault();

            $("#mdlCategory").modal('show');
        });

        //Add tag button click event
        $("#mdlItem_btnAddTag").on('click', function(e) {
            e.preventDefault();

            var $tagField = $("#mdlItem_tagField");

            $tagField.tagsManager('pushTag', $tagField.val());
            $tagField.val('');
        });

        $("#mdlItem_uploadStatus").text(uploadStatus);

        //Finish button click
        $("#mdlItem_btnFinish").on('click', function(e) {
            e.preventDefault();

            //Hide modal
            $("#mdlItem").modal("hide");

            //Reload item list
            loadUserItems();
        });

        //Quantity increase / decrease
        mdlItem_setupQtySpinner();

        //Item description field character counter
        $("#mdlItem_descField").NobleCount("#mdlItem_descCount", {
            "max_chars": 512
        });

        //Enable styled checkboxes
        $("#mdlItem_toggleListing").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkListItem")
        }).on("toggle", function(e, active) {
            if(!active) {
                $("#mdlItem_isUnlisted").fadeIn();
            } else {
                $("#mdlItem_isUnlisted").fadeOut();
            }
        });

        $("#mdlItem_toggleAllowTrade").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkAllowTrade")
        });

        $("#mdlItem_toggleAllowCash").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkAllowCash")
        });

        $("#mdlItem_toggleBuyNow").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkBuyNow")
        }).on("toggle", function(e, active) {
            if(active) {
                $("#mdlItem_hasBuyNow").fadeIn();
            } else {
                $("#mdlItem_hasBuyNow").fadeOut();
                $("#mdlItem_buyPrice").val("");
            }
        });

        $("#mdlItem_toggleMeetup").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkMeetup")
        }).on("toggle", function(e, active) {
            if(active) {
                $("#mdlItem_willMeetup").fadeIn();
            } else {
                $("#mdlItem_willMeetup").fadeOut();
                $("#mdlItem_travelDistance").val("0");
            }
        });

        $("#mdlItem_toggleShip").toggles({
            "text": {
                "on": "YES",
                "off": "NO"
            },
            "checkbox": $("#mdlItem_chkShip")
        }).on("toggle", function(e, active) {
            if(active) {
                $("#mdlItem_willShip").fadeIn();
            } else {
                $("#mdlItem_willShip").fadeOut();
                $("#mdlItem_shipTime").val("0");
            }
        });

        //Init form validation
        $("#mdlItem_inputForm").parsley({
            "successClass": "has-success",
            "errorClass": "has-error",
            "errors": {
                "classHandler": function (elem, isRadioOrCheckbox) {
                    if(!isRadioOrCheckbox) {
                        return $(elem).closest(".form-group");
                    }

                    return false;
                },
                "container": function (elem, isRadioOrCheckbox) {
                    if(!isRadioOrCheckbox) {
                        var $container = $(elem).closest(".form-group").find(".form-error-container");

                        if ($container.length === 0) {
                            $container = $("<div class='form-error-container'></div>").insertAfter(elem);
                        }

                        return $container;
                    }

                    return false;
                }
            }
        });

        //Init file upload
        $("#mdlItem_dropzone").fileupload({
            "autoUpload": false,
            "url": '/api/v1/upload/image',
            "dataType": 'json',
            "dropZone": '#mdlItem',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            "disableImageResize": /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            "previewMaxWidth": 75,
            "previewMaxHeight": 75,
            "singleFileUploads": true,
            "limitConcurrentUploads": 2,
            "sequentialUploads": false
        })
        .on('fileuploadstop', imgUpload_stop)
        .on('fileuploadprogressall', imgUpload_progress)
        .on('fileuploadadd', imgUpload_add)
        .on('fileuploadprocessalways', imgUpload_process);

        //Toggle modal visibility
        $itemModal.modal("show");
    });
}

/******************************************************************************
 * Thumbnail Crop Modal
 ******************************************************************************/

function thumb_doPreview(c) {
    if (!c.w || !c.h)
        return;

    var scaleX = 100 / c.w;
    var scaleY = 100 / c.h;

    $('#thumb_smallImg').css({
        "width": Math.round(scaleX * thumb_width ),
        "height": Math.round(scaleY * thumb_height ),
        "marginLeft": -Math.round(scaleX * c.x),
        "marginTop": -Math.round(scaleY * c.y)
    });
}

/******************************************************************************
 * Profile Functions
 ******************************************************************************/

function tabAdjust(elem) {
    if ($mediaSize.indexOf("smartphone portrait") == -1) {
        if($(elem).is(".feedTab:first")) {
            $("div.tab-content").css({
                "border-radius": "0 5px 5px 5px"
            });
        } else {
            $("div.tab-content").css({
                "border-radius": "5px"
            });
        }
    }
}

function loadWishlist() {
    $("#wishRows").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(data) {
            dust.render("wishRow", data, function(err, out) {
                $("#wishRows").html(out);
            });
        },
        "noWishes": function() {
            $("#wishRows").html('<div style="text-align: center;">No wishes yet.</div>');
        }
    };

    $API.getWishlist(null, callbacks);
}

function loadCategories(category) {
    $API.getCategory(category, function(categories) {
        if(categories) {
            dust.render("categoryBox", categories, function(err, out) {
                if(!category) {
                    $("#mdlCategory_catScroll").html(out);
                } else {
                    $("#mdlCategory_catScroll").append(out);
                }

                $(".inlineScrollPanel").fadeIn("fast");

                $(".categoryLink").off("click").on("click", function(e) {
                    e.preventDefault();

                    var $parentListItem = $(this).closest("li");

                    $(this).closest(".inlineScrollPanel")
                        .nextAll(".inlineScrollPanel")
                        .fadeOut('fast', function() {
                            $(this).remove();
                        });

                    if($parentListItem.hasClass("hasSubs")) {
                        loadCategories($(this).attr("data-catid"));
                    }

                    $(this).closest("ul")
                        .find("li")
                        .removeClass("active");

                    $parentListItem.addClass("active");
                });
            });
        }
    });
}

function loadReviews() {
    $("#reviewTab").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(feedData) {
            var dustCtx = dust.makeBase({
                "timeFrom": function(chunk, context, bodies, params) {
                    var output = timeFrom(parseInt(params['timestamp']));
                    return chunk.write(output);
                }
            });

            dust.render("review", dustCtx.push(feedData), function(err, out) {
                $("#reviewTab").html(out);
            });
        },
        "noReviews": function() {
            $("#reviewTab").html('<div style="text-align: center;">No reviews yet.</div>');
        }
    };

    $API.getReviews(null, callbacks);
}

function loadActivityFeed() {
    $("#feedData").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(feedData) {
            var dustCtx = dust.makeBase({
                "timeFrom": function(chunk, context, bodies, params) {
                    var output = timeFrom(parseInt(params['timestamp']));
                    return chunk.write(output);
                }
            });

            dust.render("activityFeed", dustCtx.push(feedData), function(err, out) {
                $("#feedData").html(out);
            });
        },
        "noFeed": function() {
            $("#feedData").html('<div style="text-align: center;">No feed data.</div>');
        }
    };

    $API.getTransactionFeed(callbacks);
}

function loadTransactions() {
    var time = $("#transactionTab_selTime").val();
    var view = $("#transactionTab_selView").val();

    $("#transactionTab_listing").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(transactions) {
            if(transactions) {
                //These two sections are temporary. TODO: Implement user avatar system proper.
                if(transactions['user']['avatar'] == null) {
                    transactions['user']['avatar'] = "/img/stockUser.png";
                }

                for(var i=0; i < transactions['transactions'].length; i++) {
                    if(transactions['transactions'][i]['avatar'] == null) {
                        transactions['transactions'][i]['avatar'] = "/img/stockUser.png";
                    }
                }
                //End Temporary

                dust.render("transactionTab", transactions, function(err, out) {
                    $("#transactionTab_listing").html(out);
                });
            } else {
                $("#transactionTab_listing").html('<br/><div style="text-align: center;">No offers or transactions found.</div>');
            }
        },
        "noTransactions": function() {
            $("#transactionTab_listing").html('<br/><div style="text-align: center;">No offers or transactions found.</div>');
        }
    };

    $API.getTransactionList(time, view, callbacks);
}

function loadFollowList(followers) {
    var _doFollowRender = function(data) {
        dust.render("followList", data, function(err, out) {
            $("#followContent").html(out);
        });
    };

    if(followers && followers == true) {
        $API.getFollowers(null, function(data) {
            if(data) _doFollowRender(data);
        });
    } else {
        $API.getFollowing(null, function(data) {
            if(data) _doFollowRender(data);
        });
    }
}

function loadWatchItems() {
    $("#watchingTab").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    $API.getWatch(function(items) {
        var itemData = {};

        itemData['items'] = items;

        dust.render("itemBox", itemData, function(err, out) {
            $("#watchingTab").html(out);
        });
    });
}

function loadUserItems() {
    $("#itemsTab").html('<div style="text-align: center;"><img src="/img/ajax-loader.gif"/></div>');

    var callbacks = {
        "success": function(items) {
            var itemData = {};

            itemData['showAddItem'] = true;
            itemData['ownProfile'] = true;
            itemData['items'] = items;

            dust.render("itemBox", itemData, function(err, out) {
                $("#itemsTab").html(out);

                //Add item button click event
                $("#btnAddItem").on("click", null, {"editMode": false}, prepareItemModal);

                //Toolbars
                $('.toolbarBtn').toolbar({
                    "content": '#itemToolbar',
                    "position": 'bottom',
                    "hideOnClick": true
                }).on("toolbarShown", function() {
                    $(this).parent().data("toolbar", true);
                }).on("toolbarHidden", function() {
                    $(this)
                        .parent().data("toolbar", false);
                }).on("toolbarItemClick", function(event, elem) {
                    if($(elem).hasClass("toolbarEdit")) { //Edit toolbar btn
                        mdlItem_prepEditMode($(event.target).closest(".itemBox").attr("data-itemID"));
                    } else if($(elem).hasClass("toolbarThumb")) { //Thumbnail toolbar btn
                        //TODO: Clean all of this up, its gross.
                        thumb_itemID = $(event.target).closest(".itemBox").attr("data-itemID");
                        var mainImg = $apiLocation + "image/sizeditemthumb/" + thumb_itemID; //TODO: PHP generated thumbs are bad.
                        var $thumbModal = $("#mdlCropThumb");

                        $("#thumb_bigImg, #thumb_smallImg").attr("src", mainImg);

                        $("#thumb_bigImg").one('load', function() {
                            if(jcrop) {
                                jcrop.destroy();
                                jcrop = null;
                            }

                            jcrop = $.Jcrop('#thumb_bigImg', {
                                "onChange": thumb_doPreview,
                                "onSelect": thumb_doPreview,
                                "bgOpacity": 0.5,
                                "aspectRatio": 1,
                                "keySupport": false
                            });

                            $("#selThumb_btnDone").off('click').on('click', function(e) {
                                e.preventDefault();

                                var cropSize = jcrop.tellSelect();
                                var $cropModal = $("#mdlCropThumb");

                                if(cropSize['w'] > 0 && cropSize['h'] > 0) {
                                    cropSize['id'] = thumb_itemID;

                                    $API.cropThumb(cropSize, function(data) {
                                        if(data) {
                                            loadUserItems();
                                        }

                                        $cropModal.modal("hide");
                                    });
                                } else {
                                    $cropModal.modal("attention");
                                    bootbox.alert("You must select part of the image first.");
                                }
                            });

                            $thumbModal.modal("show");
                        }).each(function() {
                            if(this.complete) $(this).load();
                        });
                    } else if($(elem).hasClass("toolbarDelete")) { //Delete toolbar btn
                        confirmDialog("Are you sure you wish to delete this item? (Cannot undo this action)", "Delete Item?", function(result) {
                            if(result) {
                                var itemID = $(event.target).closest(".itemBox").attr("data-itemID");

                                if(itemID) {
                                    $API.removeItem(itemID, function(data) {
                                        if(data) loadUserItems();
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }
    };

    $API.getItems(true, callbacks);
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {

    //Load user's items from the API & template them in.
    loadUserItems();

    //Make tabs work
    $("#profileTabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        var $parentTab = $(this).parent("li");

        if($parentTab.is(".feedTab:visible")) {
            tabAdjust($parentTab);
        }

        if($(this).hasClass("tabItems")) {
            loadUserItems();
        }

        if($(this).hasClass("tabWatching")) {
            loadWatchItems();
        }

        if($(this).hasClass("tabConnections")) {
            loadFollowList($("#btnConnFollowers").hasClass("active"));
        }

        if($(this).hasClass("tabTransactions")) {
            loadTransactions();
        }

        if($(this).hasClass("tabActivity")) {
            loadActivityFeed();
        }

        if($(this).hasClass("tabReview")) {
            loadReviews();
        }
    });

    //Init modal manager
    $('body').modalmanager({
        "backdropLimit": 1,
        "spinner": "/img/ajax-loader.gif"
    });

    //Modal(s)
    $("#mdlItem").modal({
        "keyboard": false,
        "show": false
    }).on('hide.bs.modal', function () {
        //Kill form validation
        $("#mdlItem_inputForm").parsley("destroy");

        thumbChanged = false;
    });

    $("#mdlCategory").modal({
        "keyboard": true,
        "show": false
    }).on('shown.bs.modal', function() {
        loadCategories();
    });

    $("#mdlWishlist").modal({
        "keyboard": true,
        "show": false
    });

    $("#mdlCropThumb").modal({
        "keyboard": false,
        "show": false
    }).on('hide.bs.modal', function () {
        if(jcrop) {
            jcrop.destroy();
            jcrop = null;

            $("#thumb_bigImg").css({
                "width": "",
                "height": ""
            }).removeAttr("src");
        }

        thumb_itemID = null;
    }).on('shown.bs.modal', function() {
        var $bigThumb = $("#thumb_bigImg");

        thumb_height = $bigThumb.height();
        thumb_width = $bigThumb.width();
    });

    /********************************************
     *  Category Modal
     *******************************************/

    $("#selCategory_btnDone").on('click', function(e) {
        e.preventDefault();

        var $activeListItem = $("#mdlCategory").find("li.active:last a");

        if($activeListItem.length > 0) {
            $("#mdlItem_categoryName").text($activeListItem.text());
            $("#mdlItem_categoryID").val($activeListItem.attr("data-catid"));

            $("#mdlCategory").modal('hide');
        }
    });

    /********************************************
     *  Wishlist Modal
     *******************************************/

    $("#mdlWishlist_txtTags").tagsManager({
        "output": "#mdlWishlist_tagData",
        "backspace": [],
        "maxTags": 16
    });

    $("#mdlWishlist_btnNewWish").on('click', function(e) {
        e.preventDefault();

        editWishID = 0;
        wishlist_showAdd();
    });

    $("#mdlWishlist_btnDeleteWish").on('click', function(e) {
        e.preventDefault();

        var rowIDs = $(".chkWish:checked").closest(".wishRow").map(function() {
            return $(this).attr("data-id");
        }).get();

        if(rowIDs.length > 0) {
            confirmDialog("Are you sure you wish to remove these " + rowIDs.length + " wishes?", "Remove Wishes", function(result) {
                if(result) {
                    wishlist_delete(rowIDs);
                }
            });
        } else bootbox.alert("Error: No wishes selected.");
    });

    $("#mdlWishlist").on('click', ".btnEditWish", function(e) {
        e.preventDefault();

        var wishID = $(this).closest(".wishRow").attr("data-id");

        if(wishID) {
            wishlist_showEdit(wishID);
        }
    }).on('click', ".btnDeleteWish", function(e) {
        e.preventDefault();

        var wishID = $(this).closest(".wishRow").attr("data-id");

        if(wishID) {
            confirmDialog("Are you sure you want to delete this wish?", "Delete Wish", function(result) {
                if(result) {
                    wishlist_delete(wishID);
                }
            });
        }
    });

    $("#mdlWishlist_btnAddTag").on('click', function(e) {
        e.preventDefault();

        var $tagField = $("#mdlWishlist_txtTags");

        $tagField.tagsManager('pushTag', $tagField.val());
        $tagField.val('');
    });

    $("#chkSelectWishes").on('click', function(e) {
        var $wishChecks = $(".chkWish");

        if($wishChecks.length > 0) {
            $wishChecks.prop("checked", $(this).is(":checked"));
        }
    });

    $("#mdlWishlist_btnCancelAddEdit").on('click', function(e) {
        e.preventDefault();

        confirmDialog("Are you sure you wish to cancel?", "Cancel Wish Add/Edit", function(result) {
             if(result) {
                 wishlist_showView();
             }
        });
    });

    $("#mdlWishlist_btnDoneAddEdit").on('click', function(e) {
        e.preventDefault();

        if(editWishID == 0) { //Add
            wishlist_add();
        } else { //Edit
            wishlist_edit();
        }
    });

    /********************************************
     *  General
     *******************************************/

    $("#btnShowReviews").on('click', function(e) {
        e.preventDefault();

        $(".tabReview").trigger('click');
    });

    $("#btnWishlist").on('click', function(e) {
        e.preventDefault();

        wishlist_showView();
        $("#mdlWishlist").modal('show');
    });

    /********************************************
     *  General - Avatar Upload / Modification
     *******************************************/

    var $avatarBox = $("#avatarBox");
    var $userAvatar = $("#userAvatar");

    $("#fileAvatarUpload").fileupload({
        "autoUpload": true,
        "url": '/api/v1/upload/avatar',
        "dropZone": $avatarBox,
        "dataType": 'json',
        "fileInput": $("#fileAvatarUpload"),
        "done": function (e, data) {
            if(data['result'].length > 0 && data['result'].charAt(0) != '{') {
                $("#userAvatar").attr("src", $.trim(data['result']) + "?r=" + Math.random());
            } else bootbox.alert("Failed to upload avatar. This is a bug.");
        },
        "progressall": function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $("#avUploadProgress").css(
                'width',
                progress + '%'
            ).attr("aria-valuenow", progress).find(".sr-only").text(progress + "% Complete");
        },
        "start": function(e) {
            $("#avUploadProgress").css(
                'width',
                '0%'
            ).attr("aria-valuenow", "0").find(".sr-only").text("0% Complete");

            $("#avatarProgress").show();
        },
        "stop": function(e) {
            $("#avatarProgress").hide();
        }
    });

    $avatarBox.hover(function(e) { //In
        $("#avatarHover").show();
    }, function(e) { //Out
        if(!$("#avatarMenu").is(":visible")) {
            $("#avatarHover").hide();
        }
    });

    $("#btnAvatarMenu").closest(".dropdown").on('hide.bs.dropdown', function () {
        if(!$avatarBox.is(":hover")) {
            $("#avatarHover").hide();
        }
    });

    $("#btnSetGravatar").on("click", function(e) {
        e.preventDefault();

        confirmDialog("Do you want to use Gravatar for your avatar? (We'll use your account's email address)", "Use Gravatar?", function(result) {
            if(result) {
                $API.useGravatar(function(data) {
                    if(data && _gravatarUrl) {
                        $userAvatar.attr("src", _gravatarUrl);
                    } else bootbox.alert("Failed to set Gravatar. This is a bug.");
                });
            }
        });
    });

    $("#btnAvatarThumb").on("click", function(e) {
        e.preventDefault();

        if($userAvatar.attr("src").indexOf("http://www.gravatar.com") == 0) {
            bootbox.alert("You must upload an avatar to set a thumbnail.<br/>This is not available with Gravatar.");
            return;
        }

        var $thumbModal = $("#mdlCropThumb");

        var sizedThumb = $apiLocation + "image/sizedavatarthumb";
        var avImg = $userAvatar.attr("src").replace("t_", "");

        $("#thumb_bigImg, #thumb_smallImg").attr("src", sizedThumb);

        $("#thumb_bigImg").one('load', function() {
            if(jcrop) {
                jcrop.destroy();
                jcrop = null;
            }

            jcrop = $.Jcrop('#thumb_bigImg', {
                "onChange": thumb_doPreview,
                "onSelect": thumb_doPreview,
                "bgOpacity": 0.5,
                "aspectRatio": 1,
                "keySupport": false
            });

            $("#selThumb_btnDone").off('click').on('click', function(e) {
                e.preventDefault();

                var cropSize = jcrop.tellSelect();
                var $cropModal = $("#mdlCropThumb");

                if(cropSize['w'] > 0 && cropSize['h'] > 0) {
                    cropSize['id'] = thumb_itemID;

                    $API.cropAvatarThumb(cropSize, function(data) {
                        if(data) {
                            $userAvatar.attr("src", $userAvatar.attr("src").split("?")[0] + "?r=" + Math.random());
                        }

                        $cropModal.modal("hide");
                    });
                } else {
                    $cropModal.modal("attention");
                    bootbox.alert("You must select part of the image first.");
                }
            });

            $thumbModal.modal("show");
        }).each(function() {
            if(this.complete) $(this).load();
        });
    });

    /********************************************
     *  Connections Tab
     *******************************************/

    $("#btnShowFollowing").on("click", function(e) {
        e.preventDefault();

        $(".tabConnections").trigger("click");
    });

    $("#btnShowFollowers").on("click", function(e) {
        e.preventDefault();

        $(".tabConnections").trigger("click");
    });

    $("#btnConnFollowing").on("click", function(e) {
        e.preventDefault();

        $(this).closest("ul").find("li").removeClass("active");
        $(this).addClass("active");
        loadFollowList();
    });

    $("#btnConnFollowers").on("click", function(e) {
        e.preventDefault();

        $(this).closest("ul").find("li").removeClass("active");
        $(this).addClass("active");
        loadFollowList(true);
    });

    /********************************************
     *  Transactions Tab
     *******************************************/

    $("#transactionTab_selTime").on("change", function() {
        loadTransactions();
    });

    $("#transactionTab_selView").on("change", function() {
        loadTransactions();
    });

    /********************************************
     *  Activity Feed Tab
     *******************************************/

    $("#feed_txtNote").on("keyup", function(e) {
        if(e.which == 13) { //Enter key
            confirmDialog("Are you sure you wish to post this note?", "Post Note?", function(result) {
                if(result) {
                    $API.addFeedNote($.trim($("#feed_txtNote").val()), function(data) {
                        if(data) {
                            $("#feed_txtNote").val("");
                            loadActivityFeed();
                        } else {
                            bootbox.alert("Failed to post note. This is a bug.");
                        }
                    });
                } else $("#feed_txtNote").focus();
            });
        }
    });
});