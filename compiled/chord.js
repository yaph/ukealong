"use strict";function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i]}return arr2}function _iterableToArrayLimit(arr,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(arr)))return;var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i["return"]!=null)_i["return"]()}finally{if(_d)throw _e}}return _arr}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}var _chord_name$split=chord_name.split("-"),_chord_name$split2=_slicedToArray(_chord_name$split,2),main_name=_chord_name$split2[0],add_note=_chord_name$split2[1];var chord=Tonal.Chord.chord(main_name);if(chord.name){if(add_note&&!chord.notes.includes(add_note)){chord.notes.push(add_note)}var colors=traste.noteColors(chord.notes);traste.drawFretboard("#fretboard",traste.instruments.ukulele,chord.notes);var h1=d3.select("h1");var text=chord_name.replace("-","/")+" chord: "+chord.notes.join(" - ");h1.text(text.replace(/b/g,"\u266D").replace(/#/g,"\u266F"));var container=d3.select("#vis");container.append("p").html("<strong>Name:</strong> ".concat(chord.name));var intervals=chord.intervals.map(function(item){return"<span class=\"tag is-medium mr-3\">".concat(item,"</span>")});container.append("p").html("<strong>Intervals:</strong> ".concat(intervals.join("")));for(var idx in chord.notes){d3.selectAll(".notes circle[title=\"".concat(chord.notes[idx],"\"]")).style("fill",colors[idx])}}else{document.getElementById("fretboard").parentElement.remove()}