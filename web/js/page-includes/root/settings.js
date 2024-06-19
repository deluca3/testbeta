
/******************************************************************************
 * Document Ready
 ******************************************************************************/

function paypalWndClose(ppEmail) {
    if(ppEmail) {
        $("#ppEmail").text(ppEmail);
        $("#ppInfo").show();
    }
}

$(document).ready(function() {
    //TODO
});