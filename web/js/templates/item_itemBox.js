(function(){dust.register("itemBox",body_0);function body_0(chk,ctx){return chk.exists(ctx.get("C1"),ctx,{"block":body_1},null).exists(ctx.get("C2"),ctx,{"block":body_4},null).exists(ctx.get("C3"),ctx,{"block":body_7},null).exists(ctx.get("C4"),ctx,{"block":body_10},null);}function body_1(chk,ctx){return chk.write("<div class=\"col-xs-3\"><div class=\"itemBox\" data-itemID=\"").reference(ctx.getPath(false,["C1","itemID"]),ctx,"h").write("\" data-qty=\"").exists(ctx.getPath(false,["C1","itemQty"]),ctx,{"else":body_2,"block":body_3},null).write("\"><div class=\"itemImage fixedRatioContainer\"><div class=\"fixedRatioDummy\"></div><div class=\"fixedRatio\"><a href=\"/item/").reference(ctx.getPath(false,["C1","itemID"]),ctx,"h").write("\"><img class=\"fullSize\" src=\"").reference(ctx.getPath(false,["C1","itemThumb"]),ctx,"h").write("\"></a></div></div><div class=\"itemInfo\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.getPath(false,["C1","itemID"]),ctx,"h").write("\">").reference(ctx.getPath(false,["C1","itemName"]),ctx,"h").write("</a></div><div class=\"itemText\">").reference(ctx.getPath(false,["C1","itemDescription"]),ctx,"h").write("</div></div></div></div>");}function body_2(chk,ctx){return chk.write("1");}function body_3(chk,ctx){return chk.reference(ctx.getPath(false,["C1","itemQty"]),ctx,"h");}function body_4(chk,ctx){return chk.write("<div class=\"col-xs-3\"><div class=\"itemBox\" data-itemID=\"").reference(ctx.getPath(false,["C2","itemID"]),ctx,"h").write("\" data-qty=\"").exists(ctx.getPath(false,["C2","itemQty"]),ctx,{"else":body_5,"block":body_6},null).write("\"><div class=\"itemImage fixedRatioContainer\"><div class=\"fixedRatioDummy\"></div><div class=\"fixedRatio\"><a href=\"/item/").reference(ctx.getPath(false,["C2","itemID"]),ctx,"h").write("\"><img class=\"fullSize\" src=\"").reference(ctx.getPath(false,["C2","itemThumb"]),ctx,"h").write("\"></a></div></div><div class=\"itemInfo\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.getPath(false,["C2","itemID"]),ctx,"h").write("\">").reference(ctx.getPath(false,["C2","itemName"]),ctx,"h").write("</a></div><div class=\"itemText\">").reference(ctx.getPath(false,["C2","itemDescription"]),ctx,"h").write("</div></div></div></div>");}function body_5(chk,ctx){return chk.write("1");}function body_6(chk,ctx){return chk.reference(ctx.getPath(false,["C2","itemQty"]),ctx,"h");}function body_7(chk,ctx){return chk.write("<div class=\"col-xs-3\"><div class=\"itemBox\" data-itemID=\"").reference(ctx.getPath(false,["C3","itemID"]),ctx,"h").write("\" data-qty=\"").exists(ctx.getPath(false,["C3","itemQty"]),ctx,{"else":body_8,"block":body_9},null).write("\"><div class=\"itemImage fixedRatioContainer\"><div class=\"fixedRatioDummy\"></div><div class=\"fixedRatio\"><a href=\"/item/").reference(ctx.getPath(false,["C3","itemID"]),ctx,"h").write("\"><img class=\"fullSize\" src=\"").reference(ctx.getPath(false,["C3","itemThumb"]),ctx,"h").write("\"></a></div></div><div class=\"itemInfo\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.getPath(false,["C3","itemID"]),ctx,"h").write("\">").reference(ctx.getPath(false,["C3","itemName"]),ctx,"h").write("</a></div><div class=\"itemText\">").reference(ctx.getPath(false,["C3","itemDescription"]),ctx,"h").write("</div></div></div></div>");}function body_8(chk,ctx){return chk.write("1");}function body_9(chk,ctx){return chk.reference(ctx.getPath(false,["C3","itemQty"]),ctx,"h");}function body_10(chk,ctx){return chk.write("<div class=\"col-xs-3\"><div class=\"itemBox\" data-itemID=\"").reference(ctx.getPath(false,["C4","itemID"]),ctx,"h").write("\" data-qty=\"").exists(ctx.getPath(false,["C4","itemQty"]),ctx,{"else":body_11,"block":body_12},null).write("\"><div class=\"itemImage fixedRatioContainer\"><div class=\"fixedRatioDummy\"></div><div class=\"fixedRatio\"><a href=\"/item/").reference(ctx.getPath(false,["C4","itemID"]),ctx,"h").write("\"><img class=\"fullSize\" src=\"").reference(ctx.getPath(false,["C4","itemThumb"]),ctx,"h").write("\"></a></div></div><div class=\"itemInfo\"><div class=\"itemText itemLink\" style=\"font-weight: bold;\"><a href=\"/item/").reference(ctx.getPath(false,["C4","itemID"]),ctx,"h").write("\">").reference(ctx.getPath(false,["C4","itemName"]),ctx,"h").write("</a></div><div class=\"itemText\">").reference(ctx.getPath(false,["C4","itemDescription"]),ctx,"h").write("</div></div></div></div>");}function body_11(chk,ctx){return chk.write("1");}function body_12(chk,ctx){return chk.reference(ctx.getPath(false,["C4","itemQty"]),ctx,"h");}return body_0;})();