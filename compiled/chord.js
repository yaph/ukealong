'use strict';var chord=Tonal.Chord.chord(chord_name.split('-')[0]);if(chord.name){var colors=traste.noteColors(chord.notes);traste.drawFretboard('#fretboard',traste.instruments.ukulele,chord.notes);var h1=d3.select('h1');h1.text(chord_name.replace('-','/')+' chord: '+chord.notes.join(' - '));for(var idx in chord.notes){d3.selectAll('.notes circle[title="'+chord.notes[idx]+'"]').style('fill',colors[idx])}}else{document.getElementById('fretboard').parentElement.remove()}