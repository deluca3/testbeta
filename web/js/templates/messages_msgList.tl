{?tableView}
    <table id="tblMessages" class="table table-hover">
        <thead>
            <tr>
                <th><input class="tableCheckbox" id="chkSelectAll" type="checkbox"></th>
                <th>Subject</th>
                <th>Read</th>
                <th>{?trashView}To / From{:else}{?sentView}To{:else}From{/sentView}{/trashView}</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
{/tableView}

{?composeView}
    <form style="margin-left: 15px;" class="form-horizontal label-justify-left" role="form" id="msgView_compose">
        <div class="form-group">
            <label class="col-xs-2 control-label" for="mdlItem_nameField">To:</label>
            <div class="col-xs-10">
                <input type="text" value="{msg.to}" class="form-control" id="msgView_toField" data-required="true" data-minlength="3" data-maxlength="24">
            </div>
        </div>

        <div class="form-group">
            <label class="col-xs-2 control-label" for="mdlItem_nameField">Subject:</label>
            <div class="col-xs-10">
                <input type="text" value="{msg.subject}" class="form-control" id="msgView_subjectField" data-maxlength="128">
            </div>
        </div>

        <div class="form-group">
            <div class="col-xs-12">
                <textarea class="form-control" style="resize: vertical;" id="msgView_messageField" data-required="true" data-rangelength="[1,65535]">{msg.message}</textarea>
                <div class="form-error-container"></div>
            </div>
        </div>

        <div class="pull-right">
            <button id="msgView_btnCancel" class="btn btn-default">Cancel</button>
            &nbsp;
            <button id="msgView_btnSend" class="btn btn-success"><i class="icon-share-sign">&nbsp;</i>Send</button>
        </div>
    </form>
{/composeView}

{?messageView}
    <div style="margin-left: 15px;">
        <table>
            {?msg.to}
                <tr>
                    <td><b>To:</b>&nbsp;</td>
                    <td><a href="#" class="userLink" data-user="{msg.to}">{msg.to}</a></td>
                </tr>
            {/msg.to}

            {?msg.from}
                <tr>
                    <td><b>From:</b>&nbsp;</td>
                    <td><a href="#" class="userLink" data-user="{msg.from}">{msg.from}</a></td>
                </tr>
            {/msg.from}

            <tr>
                <td><b>Date:</b>&nbsp;</td>
                <td>{msg.sentAt}</td>
            </tr>

            <tr>
                <td><b>Subject:</b>&nbsp;</td>
                <td>{msg.subject}</td>
            </tr>
        </table>

        <hr class="niceLine"/>

        <div id="msg_renderDiv">
            {msg.message|s}
        </div>
    </div>
{/messageView}