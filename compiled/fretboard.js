"use strict";function attribution(container){var fretboard=d3.select(container);var height=fretboard.attr("height");var fontsize=Math.max(height/20,6);fretboard.append("a").attr("xlink:href","https://ukealong.com/").append("svg:text").attr("x",fontsize/2).attr("y",height-fontsize*1.05).attr("fill","#666").style("font-family","monospace").style("font-size","".concat(fontsize,"px")).text("ukealong.com")}