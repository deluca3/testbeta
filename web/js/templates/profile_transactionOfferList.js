(function(){dust.register("transactionOfferList",body_0);function body_0(chk,ctx){return chk.section(ctx.get("items"),ctx.rebase(ctx.getPath(true,[])),{"block":body_1},null);}function body_1(chk,ctx){return chk.helper("eq",ctx,{"block":body_2},{"key":ctx.get("$len"),"value":1}).helper("gt",ctx,{"block":body_6},{"key":ctx.get("$len"),"value":1});}function body_2(chk,ctx){return chk.write("<div class=\"itemBox\" data-itemID=\"").reference(ctx.get("itemID"),ctx,"h").write("\" data-qty=\"").exists(ctx.get("quantity"),ctx,{"else":body_3,"block":body_4},null).write("\"><div class=\"itemImage fixedRatioContainer\"><div class=\"fixedRatioDummy\"></div><div class=\"fixedRatio\"><a href=\"/item/").reference(ctx.get("itemID"),ctx,"h").write("\"><img class=\"fullSize\" src=\"").reference(ctx.get("url"),ctx,"h").write("\"></a></div>").exists(ctx.get("quantity"),ctx,{"block":body_5},null).write("</div><div class=\"itemInfo\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.get("itemID"),ctx,"h").write("\">").reference(ctx.get("name"),ctx,"h").write("</a></div><div class=\"itemText\">").reference(ctx.get("description"),ctx,"h").write("</div></div></div>");}function body_3(chk,ctx){return chk.write("1");}function body_4(chk,ctx){return chk.reference(ctx.get("quantity"),ctx,"h");}function body_5(chk,ctx){return chk.write("<div class=\"qtyOverlay badge badge-primary\"><div>").reference(ctx.get("quantity"),ctx,"h").write("x</div></div>");}function body_6(chk,ctx){return chk.write("<div class=\"offerListItem row\" data-itemID=\"").reference(ctx.get("itemID"),ctx,"h").write("\" data-qty=\"").exists(ctx.get("quantity"),ctx,{"else":body_7,"block":body_8},null).write("\"><div class=\"col-xs-4 itemImage\"><a href=\"/item/").reference(ctx.get("itemID"),ctx,"h").write("\"><img class=\"img-responsive\" src=\"").reference(ctx.get("url"),ctx,"h").write("\" style=\"border-right: 1px solid #DDDDDD;\"></a></div><div class=\"col-xs-8\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.get("itemID"),ctx,"h").write("\">").reference(ctx.get("name"),ctx,"h").write("</a></div><div class=\"itemText\" style=\"margin-bottom: 10px;\">").reference(ctx.get("description"),ctx,"h").write("</div>").exists(ctx.get("quantity"),ctx,{"block":body_9},null).write("</div></div>");}function body_7(chk,ctx){return chk.write("1");}function body_8(chk,ctx){return chk.reference(ctx.get("quantity"),ctx,"h");}function body_9(chk,ctx){return chk.write("<span>Quantity: ").reference(ctx.get("quantity"),ctx,"h").write("</span>");}return body_0;})();