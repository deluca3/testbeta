var username = '';
var msgEditor = null;
var currentView = "in",
    lastView = "in";

var viewMsgUser = null,
    viewMsgSubject = null,
    viewMsgMessage = null,
    viewMsgID = null;

var messageTable = null,
    tableXHR = null;

var searchTimer = null,
    searchLastVal = "";

function renderTable() {
    if(messageTable) {
        messageTable.fnDestroy();
        messageTable = null;
    }

    if(msgEditor) {
        msgEditor.destroy();
        msgEditor = null;
    }

    $("#txtMessageSearch").val("");

    var templateData = {
        "sentView": (currentView == "sent"),
        "trashView": (currentView == "trash"),
        "tableView": true
    };

    dust.render("msgList", templateData, function(err, out) {
        $("#contentArea").empty().html(out);

        renderButtonsByView();

        initTable();
    });
}

function initTable() {
    var colDefs = [
        {
            "fnRender": function ( oObj ) {
                return '<input class="chkMessage tableCheckbox" type="checkbox" data-msgid="' + oObj.aData[0] + '">';
            },
            "bSortable": false,
            "aTargets": [ 0 ],
            "sWidth": "30px"
        },
        {
            "fnRender": function ( oObj ) {
                if(oObj.aData[2] == 0) {
                    return '<a href="#" style="font-weight: bold;" class="msgReadLink">' + oObj.aData[1] + '</a>';
                } else {
                    return '<a href="#" class="msgReadLink">' + oObj.aData[1] + '</a>';
                }
            },
            "aTargets": [1]
        },
        {
            "fnRender": function ( oObj ) {
                if(oObj.aData[2] == 0) {
                    return '<i class="icon-circle-blank"></i>';
                } else {
                    return '<i class="icon-ok-circle"></i>';
                }
            },
            "aTargets": [2],
            "sWidth": "35px",
            "sClass": "center"
        },
        {
            "fnRender": function ( oObj ) {
                return '<a href="/profile/' + oObj.aData[3] + '">' + oObj.aData[3] + '</a>';
            },
            "aTargets": [3]
        },
        {
            "fnRender": function ( oObj ) {
                return new Date(parseInt(oObj.aData[4]) * 1000).format('n/j/Y g:i A');
            },
            "aTargets": [4]
        }
    ];

    if(currentView == "sent" || currentView == "trash") {
        colDefs[2] = {
            "bVisible": false,
            "aTargets": [2]
        };

        if(currentView == "trash") {
            colDefs[3] = {
                "fnRender": function ( oObj ) {
                    if(oObj.aData[3] == username) {
                        return 'To: <a href="#" class="userLink" data-user="' + oObj.aData[5] + '">' + oObj.aData[5] + '</a>';
                    } else {
                        return 'From: <a href="#" class="userLink" data-user="' + oObj.aData[3] + '">' + oObj.aData[3] + '</a>';
                    }
                },
                "aTargets": [3]
            };
        }
    }

    messageTable = $('#tblMessages').dataTable({
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "/api/v1/messages/list",
        "asStripeClasses": [''],
        "aoColumnDefs": colDefs,
        "aaSorting": [[4,'desc']],
        "fnDrawCallback": function( oSettings ) {
            $(".chkMessage").on("click", function(e) {
                if($(".chkMessage:checked").length > 0) {
                    $("#btnMarkRead, #btnMarkUnread, #btnDelete, #btnRestore").prop("disabled", false);
                } else {
                    $("#btnMarkRead, #btnMarkUnread, #btnDelete, #btnRestore").prop("disabled", true);
                }
            });

            $("#chkSelectAll").on("click", function(e) {
                var $msgChecks = $(".chkMessage");

                if($msgChecks.length > 0) {
                    if($(this).is(":checked")) {
                        $msgChecks.prop("checked", true);
                        $("#btnMarkRead, #btnMarkUnread, #btnDelete, #btnRestore").prop("disabled", false);
                    } else {
                        $msgChecks.prop("checked", false);
                        $("#btnMarkRead, #btnMarkUnread, #btnDelete, #btnRestore").prop("disabled", true);
                    }
                }
            });

            $(".msgReadLink").on("click", function(e) {
                e.preventDefault();

                var msgID = $(this).closest("tr").find(".chkMessage:first").attr("data-msgid");

                if(msgID) {
                    if(messageTable) messageTable.fnProcessingIndicator();
                    renderMessage(msgID);
                }
            });

            $("#btnMarkRead, #btnMarkUnread, #btnDelete, #btnRestore").prop("disabled", true);
        },
        "fnServerData": function (sSource, aoData, fnCallback) {
            // Add view data
            aoData.push({"name": "view", "value": currentView});

            tableXHR = $.getJSON(sSource, aoData, function (json) {
                if(currentView == "trash") {
                    if(json['aaData'] && json['aaData'].length > 0) {
                        $("#btnEmptyTrash").prop("disabled", false);
                    } else {
                        $("#btnEmptyTrash").prop("disabled", true);
                    }
                }

                updateUnreadCount(json['iUnread']);

                fnCallback(json);
            });
        },
        "oLanguage": { //TODO: There are more of these.
            "sEmptyTable": "No messages to display.",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ messages",
            "sInfoEmpty": "No messages to display.",
            "sInfoFiltered": " - filtering from _MAX_ messages."
        }
    });
}

function renderCompose(to, subject, origMsg) {
    if(messageTable) {
        messageTable.fnDestroy();
        messageTable = null;
    }

    if(msgEditor) {
        msgEditor.destroy();
        msgEditor = null;
    }

    lastView = currentView;
    currentView = "compose";

    var templateData = {
        "composeView": true,
        "msg": {
            "to": to,
            "subject": subject,
            "message": origMsg
        }
    };

    dust.render("msgList", templateData, function(err, out) {
        $("#sidebar").find("li.active").removeClass("active");

        $("#contentArea").empty().html(out);

        msgEditor = $("#msgView_messageField").sceditor({
            "plugins": "bbcode",
            "toolbar": "bold,italic,underline|quote|bulletlist,orderedlist|email,link|emoticon",
            "style": "/css/jquery.sceditor.default.css",
            "emoticonsRoot": '/img/',
            "width": "98%",
            "height": 300,
            "minHeight": 300,
            "maxHeight": 500,
            "resizeWidth": false,
            "enablePasteFiltering": true
        }).sceditor('instance');

        renderButtonsByView();

        if(to) {
            if(subject) {
                msgEditor.focus();
            } else $("#msgView_subjectField").focus();
        } else $("#msgView_toField").focus();

        $("#btnMarkRead, #btnMarkUnread, #btnDelete").prop("disabled", true);

        $("#msgView_btnSend").on("click", function(e) {
            e.preventDefault();

            //TODO: Client side validation

            var msgData = {
                "to": $("#msgView_toField").val(),
                "subject": $("#msgView_subjectField").val(),
                "message": msgEditor.getWysiwygEditorValue()
            };

            //TODO: Transition properly to spinner / success then back to inbox/sent.

            $API.sendMessage(msgData, function(data) {
                renderView(lastView);
            });
        });

        $("#msgView_btnCancel").on("click", function(e) {
            e.preventDefault();

            renderView(lastView);
        });
    });
}

function renderMessage(msgID) {
    $API.getMessage(msgID, function(message) {
        if(messageTable) {
            messageTable.fnDestroy();
            messageTable = null;
        }

        if(msgEditor) {
            msgEditor.destroy();
            msgEditor = null;
        }

        lastView = currentView;
        currentView = "message";

        updateUnreadCount(message['unread']);

        $("#lblView").text(message['subject']);

        var templateData = {
            "messageView": true,
            "msg": {
                "subject": message['subject'],
                "message": message['msg'],
                "sentAt": new Date(parseInt(message['sentAt']) * 1000).format('n/j/Y g:i A')
            }
        };

        viewMsgSubject = message['subject'];
        viewMsgMessage = message['orig'];

        if(message['to']) {
            templateData['msg']['to'] = message['to'];
            viewMsgUser = message['to'];
        } else if(message['from']) {
            templateData['msg']['from'] = message['from'];
            viewMsgUser = message['from'];
        }

        dust.render("msgList", templateData, function(err, out) {
            $("#sidebar").find("li.active").removeClass("active");

            $("#contentArea").empty().html(out);

            renderButtonsByView();

            $("#btnMarkRead, #btnMarkUnread, #btnDelete").prop("disabled", true);
        });
    });
}

function renderButtonsByView() {
    switch(currentView) {
        case "message":
            $("#markMsgBtns, #trashBtns").hide();
            $("#searchDiv").hide();
            $("#replyMsgBtns, #msgBtns").css("display", "inline-block");
            break;

        case "compose":
            $("#searchDiv, #msgBtns, #trashBtns").hide();
            break;

        case "trash":
            $("#replyMsgBtns, #markMsgBtns").hide();
            $("#searchDiv").show();
            $("#trashBtns, #msgBtns").css("display", "inline-block");
            break;

        case "sent":
            $("#replyMsgBtns, #trashBtns, #markMsgBtns").hide();
            $("#searchDiv").show();
            $("#msgBtns").css("display", "inline-block");
            break;

        case "in":
            $("#replyMsgBtns, #trashBtns").hide();
            $("#searchDiv").show();
            $("#msgBtns, #markMsgBtns").css("display", "inline-block");
            break;
    }
}

function searchMessages(e) {
    var txtMsgSearch = $("#txtMessageSearch").val();

    if(!messageTable) return;

    if(txtMsgSearch.length == 0 && searchLastVal.length != 0) {
        searchLastVal = txtMsgSearch;
        messageTable.fnFilter("");
        return;
    }

    searchLastVal = txtMsgSearch;

    if(txtMsgSearch.length > 2) {
        if(searchTimer) clearTimeout(searchTimer);
        if(tableXHR) tableXHR.abort();

        searchTimer = setTimeout(function() {
            messageTable.fnFilter(txtMsgSearch);
        }, 150);
    }
}

function getCheckedMessages() {
    var $chkdMessages = $(".chkMessage:checked");

    if($chkdMessages.length > 0) {
        var idList = [];

        $chkdMessages.each(function(index, elem) {
            var msgID = $(elem).attr("data-msgid");

            if(msgID) {
                idList.push(msgID);
            }
        });

        return idList;
    }

    return null;
}

function cancelCompose(callback) {
    if(currentView == "compose" && msgEditor) {
        if($("#msgView_subjectField").val().length > 0 || msgEditor.getWysiwygEditorValue().length > 0) {
            confirmDialog("Are you sure you wish to abandon this message?", "Cancel Compose", function(result) {
                if(callback && typeof(callback) == "function") {
                    callback(result);
                } else if(result) renderView(lastView);
            });
        } else if(callback && typeof(callback) == "function") {
                callback(true);
        } else renderView(lastView);
    }
}

function renderView(view) {
    switch(view) {
        case 'in':
            lastView = currentView;
            currentView = "in";

            $("#sidebar").find("li.active").removeClass("active");
            $("#sidebar_btnInbox").closest("li").addClass("active");

            $("#lblView").text("Inbox");
            $("#txtMessageSearch").attr("placeholder", "Search Inbox").placeholder();

            renderTable();
            break;

        case 'sent':
            lastView = currentView;
            currentView = "sent";

            $("#sidebar").find("li.active").removeClass("active");
            $("#sidebar_btnSent").closest("li").addClass("active");

            $("#lblView").text("Sent");
            $("#txtMessageSearch").attr("placeholder", "Search Sent").placeholder();

            renderTable();
            break;

        case 'trash':
            lastView = currentView;
            currentView = "trash";

            $("#sidebar").find("li.active").removeClass("active");
            $("#sidebar_btnTrash").closest("li").addClass("active");

            $("#lblView").text("Trash");
            $("#txtMessageSearch").attr("placeholder", "Search Trash").placeholder();

            renderTable();
            break;

        default:
            renderView("in");
            break;
    }
}

function updateUnreadCount(count) {
    if(count && parseInt(count) > 0) {
        $("#sidebar_msgBadge, #nav_msgBadge").text(parseInt(count)).show();
    } else {
        $("#sidebar_msgBadge, #nav_msgBadge").text("").hide();
    }
}

/******************************************************************************
 * Document Ready
 ******************************************************************************/

$(document).ready(function() {
    //$('input:checkbox').prettyCheckable();

    username = $("#navUser").text(); //TODO: Gross.

    //URL view / compose

    if(_urlView && _urlView.length > 0) {
        switch(_urlView) {
            case "sent":
                renderView("sent");

                break;

            case "trash":
                renderView("trash");

                break;

            case "compose":
                $("#lblView").text("Compose");

                if(_urlTo && _urlTo.length > 0) {
                    renderCompose(_urlTo);
                } else renderCompose();

                break;

            default:
                renderTable();

                break;
        }
    } else renderTable();

    //Message toolbar events

    $("#btnCompose").on("click", function(e) {
        e.preventDefault();

        if(currentView != "compose") {
            if(messageTable) messageTable.fnProcessingIndicator();

            $("#lblView").text("Compose");

            renderCompose();
        }
    });

    $("#btnReply").on("click", function(e) {
        e.preventDefault();

        if(currentView == "message") {
            if(viewMsgUser && viewMsgSubject) {
                var msgQuote = null;

                if($.trim(viewMsgMessage).length > 0) {
                    msgQuote = "\n\n\n[quote]" + viewMsgMessage + "[/quote]";
                }

                renderCompose(viewMsgUser, "Re: " + viewMsgSubject, msgQuote);
            }
        }
    });

    $("#btnForward").on("click", function(e) {
        e.preventDefault();

        if(currentView == "message") {
            if(viewMsgSubject) {
                var msgQuote = null;

                if($.trim(viewMsgMessage).length > 0) {
                    msgQuote = "\n\n\n[quote]" + viewMsgMessage + "[/quote]";
                }

                renderCompose(null, "Fwd: " + viewMsgSubject, msgQuote);
            }
        }
    });

    $("#btnEmptyTrash").on("click", function(e) {
        e.preventDefault();

        if(currentView == "trash") {
            confirmDialog("Are you sure you wish to empty the trash?", "Confirm Empty Trash", function(result) {
                if(result) {
                    $API.emptyMessages(function(data) {
                        if(data && currentView == "trash") {
                            renderView(currentView);
                        }
                    });
                }
            });
        }
    });

    $("#btnRestore").on("click", function(e) {
        e.preventDefault();

        if(currentView == "trash") {
            var msgIDs = null;

            if(msgIDs = getCheckedMessages()) {
                if(messageTable) {
                    messageTable.fnProcessingIndicator();
                }

                $API.setMessageState(msgIDs, "restore", function(data) {
                    if(data) {
                        renderTable();
                    }
                });
            }
        }
    });

    $("#btnMarkRead").on("click", function(e) {
        e.preventDefault();

        var msgIDs = null;

        if(msgIDs = getCheckedMessages()) {
            if(messageTable) {
                messageTable.fnProcessingIndicator();
            }

            $API.setMessageState(msgIDs, "read", function(data) {
                if(data) {
                    renderTable();
                }
            });
        }
    });

    $("#btnMarkUnread").on("click", function(e) {
        e.preventDefault();

        var msgIDs = null;

        if(msgIDs = getCheckedMessages()) {
            if(messageTable) {
                messageTable.fnProcessingIndicator();
            }

            $API.setMessageState(msgIDs, "unread", function(data) {
                if(data) {
                    renderTable();
                }
            });
        }
    });

    $("#btnDelete").on("click", function(e) {
        e.preventDefault();

        var msgIDs = null;

        if(msgIDs = getCheckedMessages()) {
            if(messageTable) {
                messageTable.fnProcessingIndicator();
            }

            if(currentView == "trash") {
                confirmDialog("Are you sure you want to permanently delete these message(s)?", "Delete Message(s)", function(result) {
                    if(result) {
                        $API.setMessageState(msgIDs, "remove", function(data) {
                            if(data) {
                                renderTable();
                            }
                        });
                    }
                });
            } else {
                $API.setMessageState(msgIDs, "delete", function(data) {
                    if(data) {
                        if(currentView == "message") {
                            renderView(lastView);
                        } else renderTable();
                    }
                });
            }
        }
    });

    $("#txtMessageSearch").on("keyup", searchMessages);

    //Side bar button events

    $("#sidebar_btnInbox").on("click", function(e) {
        e.preventDefault();

        renderView("in");
    });

    $("#sidebar_btnSent").on("click", function(e) {
        e.preventDefault();

        renderView("sent");
    });

    $("#sidebar_btnTrash").on("click", function(e) {
        e.preventDefault();

        renderView("trash");
    });

});