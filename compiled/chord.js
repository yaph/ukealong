"use strict";function _slicedToArray(r,e){return _arrayWithHoles(r)||_iterableToArrayLimit(r,e)||_unsupportedIterableToArray(r,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0}}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r}finally{try{if(!f&&null!=t["return"]&&(u=t["return"](),Object(u)!==u))return}finally{if(o)throw n}}return a}}function _arrayWithHoles(r){if(Array.isArray(r))return r}var _chord_name$split=chord_name.split("-"),_chord_name$split2=_slicedToArray(_chord_name$split,2),main_name=_chord_name$split2[0],add_note=_chord_name$split2[1];var chord=Tonal.Chord.get(main_name);if(chord.name){if(add_note&&!chord.notes.includes(add_note)){chord.notes.push(add_note)}traste.drawFretboard("#fretboard",traste.instruments.ukulele,chord.notes);attribution("#fretboard");var h1=d3.select("h1");var text=chord_name.replace("-","/")+" chord: "+chord.notes.join(" - ");h1.text(text.replace(/b/g,"\u266D").replace(/#/g,"\u266F"));var container=d3.select("#vis");container.append("p").html("<strong>Name:</strong> ".concat(chord.name));var intervals=chord.intervals.map(function(item){return"<span class=\"tag is-medium mr-3\">".concat(item,"</span>")});container.append("p").html("<strong>Intervals:</strong> ".concat(intervals.join("")))}else{document.getElementById("fretboard").parentElement.remove()}