"use strict";var headline=d3.select("h1");var accidentals=d3.select("#accidentals");var root_notes=d3.select("#root-notes");var scale_info=d3.select("#scale-info");var scale_select=d3.select("#scale-select");var accidentals_mapping={"\u266D":"b","\u266F":"#"};var cls_active="is-info";var help_msg="* Click on a note name to set the root of the scale.\n* Click on an accidental to set or unset it.\n* Select a scale from the dropdown list.";var value_sep=", ";root_notes.selectAll("button").data(Tonal.Scale.get("c major").notes).enter().append("button").on("click",showScale).attr("id",function(d){return d}).attr("class","button is-medium").text(function(d){return d});accidentals.selectAll("button").data(Object.entries(accidentals_mapping)).enter().append("button").on("click",showScale).attr("id",function(d){return d[0]}).attr("class","button is-medium").text(function(d){return d[0]});scale_select.on("change",showScale);scale_select.selectAll("option").data(scales).enter().append("option").attr("id",function(d){return d.id}).text(function(d){return d.name});var selected_accidental=null;var selected_root="C";var selected_scale="ionian";var selected_scale_index=0;d3.select("#".concat(selected_scale)).attr("selected",true);showScale();function showInfoList(name,elements){var p=scale_info.append("p");p.append("strong").text("".concat(name,": "));p.append("span").text(elements.join(value_sep))}function showScale(){var event=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(event){switch(event.target.nodeName){case"SELECT":selected_scale_index=event.target.selectedIndex;selected_scale=event.target.selectedOptions.item(0).id;break;case"BUTTON":if("accidentals"==event.target.parentNode.id){selected_accidental=event.target.textContent;var was_active=event.target.classList.contains(cls_active);accidentals.selectAll("button").classed(cls_active,false);if(was_active){selected_accidental=null}else{d3.select("#".concat(selected_accidental)).node().classList.add(cls_active)}}else if("root-notes"==event.target.parentNode.id){selected_root=event.target.textContent}break;}}scale_info.html("");root_notes.selectAll("button").classed(cls_active,false);d3.select("#".concat(selected_root)).node().classList.add(cls_active);var root_id=selected_root;var root_name=selected_root;if(selected_accidental){root_id=selected_root+selected_accidental;root_name=selected_root+accidentals_mapping[selected_accidental]}headline.html("".concat(root_id," ").concat(scales[selected_scale_index].name));headline.append("span").attr("class","is-pulled-right is-rounded is-size-2 info").attr("title",help_msg).text("\u2139\uFE0F");var scale=Tonal.Scale.get("".concat(root_name," ").concat(selected_scale));var table=scale_info.append("table");if(7>=scale.notes.length){tr(table,"",scale.intervals.map(function(item){return Tonal.RomanNumeral.get(item.at(0)-1).name}),"th")}tr(table,"Notes",scale.notes);tr(table,"Intervals",scale.intervals);tr(table,"Semitones",scale.intervals.map(function(item){return Tonal.Interval.semitones(item)}));traste.drawFretboard("#fretboard",traste.instruments.ukulele,scale.notes,parseInt(table.style("width").replace("px","")));attribution("#fretboard")}