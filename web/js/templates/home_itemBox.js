(function(){dust.register("itemBox",body_0);function body_0(chk,ctx){return chk.write("<ul class=\"itemList\">").section(ctx.get("items"),ctx,{"block":body_1},null).write("</ul>");}function body_1(chk,ctx){return chk.write("<li data-itemID=\"").reference(ctx.getPath(true,["id"]),ctx,"h").write("\" class=\"itemBox ").helper("if",ctx,{"block":body_2},{"cond":body_3}).write("\"><div class=\"itemImage\"><a href=\"/item/").reference(ctx.getPath(true,["id"]),ctx,"h").write("\"><img src=\"").exists(ctx.getPath(true,["thumbnail","url"]),ctx,{"else":body_4,"block":body_5},null).write("\" class=\"img-responsive\"></a>").exists(ctx.getPath(true,["offers"]),ctx,{"block":body_6},null).write("</div><div class=\"itemInfo\"><div class=\"itemData\" style=\"height:40px;\"><div><a class=\"itemText\" href=\"/item/").reference(ctx.getPath(true,["id"]),ctx,"h").write("\" style=\"color: #000;\">").reference(ctx.getPath(true,["name"]),ctx,"h").write("</a></div><div><a href=\"/profile/stephen\">Stephen DeLuca</a></div> </div></div></li>");}function body_2(chk,ctx){return chk.write("last");}function body_3(chk,ctx){return chk.write("(").reference(ctx.get("$idx"),ctx,"h").write(" - 1) % 4 == 2");}function body_4(chk,ctx){return chk.write("/img/noImage.jpg");}function body_5(chk,ctx){return chk.reference(ctx.getPath(true,["thumbnail","url"]),ctx,"h");}function body_6(chk,ctx){return chk.write("<a href=\"/trade/").reference(ctx.getPath(true,["id"]),ctx,"h").write("\"><div class=\"offerOverlay\">").reference(ctx.getPath(true,["offers"]),ctx,"h").write(" Offer").helper("gt",ctx,{"block":body_7},{"key":ctx.getPath(true,["offers"]),"value":1}).write("</div></a>");}function body_7(chk,ctx){return chk.write("s");}return body_0;})();