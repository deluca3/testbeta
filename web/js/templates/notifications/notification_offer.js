(function(){dust.register("notif_offer",body_0);function body_0(chk,ctx){return chk.write("<b>").reference(ctx.get("fromUser"),ctx,"h").write("</b> made an offer on your <b>").reference(ctx.get("itemName"),ctx,"h").write("</b>");}return body_0;})();