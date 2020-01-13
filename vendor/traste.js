// https://github.com/yaph/traste v0.1.1 Copyright 2020 Ramiro Gómez
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection'], factory) :
    (global = global || self, factory(global.traste = {}, global.d3));
}(this, (function (exports, d3Selection) { 'use strict';

    let chromatic_scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let enharmonic_notes = {
      'A': ['G##', 'Bbb'],
      'A#': ['Bb'],
      'Ab': ['G#'],
      'B': ['Cb', 'A##'],
      'B#': ['C'],
      'Bb': ['A#'],
      'C': ['B#', 'Dbb'],
      'C#': ['Db'],
      'D': ['C##', 'Ebb'],
      'D#': ['Eb'],
      'Db': ['C#'],
      'E': ['Fb', 'D##'],
      'E#': ['F'],
      'Eb': ['D#'],
      'F': ['E#', 'Gbb'],
      'F#': ['Gb'],
      'G': ['F##', 'Abb'],
      'G#': ['Ab'],
      'Gb': ['F#']
    };
    let note_colors = ["#fb8072", "#fccde5", "#fdb462", "#ffed6f", "#ffffb3", "#b3de69", "#ccebc5", "#80b1d3", "#bc80bd", "#8dd3c7", "#bebada", "#d9d9d9"];
    /**
     * Return note name for position relative to root note index in chromatic scale.
     *
     * If a list of notes is given, the determined note must be included.
     *
     * @param {number} root_index - root note index in chromatic scale
     * @param {number} position - the number of frets away from the open string.
     * @param {Object[]} [notes] - optional list of notes that must include the determined note.
     */

    function noteAtPosition(root_index, position, notes = []) {
      let note_index = (root_index + position) % chromatic_scale.length;
      let note = chromatic_scale[note_index];

      if (notes && !notes.includes(note)) {
        for (let enharmonic of enharmonic_notes[note]) {
          if (notes.includes(enharmonic)) {
            return enharmonic;
          }
        }

        return;
      }

      return note;
    }
    /**
     * Return a list of colors, one for each note in the given notes list.
     *
     * Different sets of colors are returned based on the number of notes.
     *
     * @param {Object[]} notes - list of notes
     */

    function noteColors(notes) {
      switch (notes.length) {
        case 3:
          // assume a triad
          return [note_colors[0], note_colors[4], note_colors[7]];

        case 4:
          // assume a seventh chord
          return [note_colors[0], note_colors[4], note_colors[7], note_colors[11]];

        case 5:
          // assume a ninth chord
          return [note_colors[0], note_colors[4], note_colors[7], note_colors[11], note_colors[2]];

        case 7:
          // assume a diatonic major scale
          return [note_colors[0], note_colors[2], note_colors[4], note_colors[5], note_colors[7], note_colors[9], note_colors[11]];

        default:
          return note_colors.slice(0, notes.length);
      }
    }
    /**
     * Return index position of note in chromatic scale.
     * If a flat note is passed, the position of the enharmonic sharp is returned.
     *
     * @param {string} name - name of the note
     * @returns {number} chromatic_scale array index
     */

    function noteIndex(name) {
      if (chromatic_scale.includes(name)) {
        return chromatic_scale.indexOf(name);
      }

      for (let enharmonic of enharmonic_notes[name]) {
        if (chromatic_scale.includes(enharmonic)) {
          return chromatic_scale.indexOf(enharmonic);
        }
      }
    }
    /**
     * Return note label for display.
     *
     * @param {string} name - name of the note
     * @returns {string} note label
     */

    function noteLabel(name) {
      return name.replace(/b/g, '♭').replace(/#/g, '♯');
    }

    function drawCircle(parent, cx, cy, radius, fill = '#cccccc', stroke = null, stroke_width = null, title = null) {
      let circle = parent.append('svg:circle').attr('cx', cx).attr('cy', cy).attr('r', radius).style('fill', fill);
      if (stroke) circle.style('stroke', stroke);
      if (stroke_width) circle.style('stroke-width', stroke_width);
      if (title) circle.attr('title', title);
    }

    function drawFretboard(selector, instrument, notes) {
      let tuning = instrument.tuning;
      let string_gauges = instrument.string_gauges;
      let fret_count = instrument.fret_count;
      let svg = d3Selection.select(selector);
      svg.selectAll('*').remove();
      let bbox = svg.node().parentElement.getBoundingClientRect();
      let width = bbox.width * 0.95; // Readjust width so the fretboard works for different screen sizes and fret counts

      let min_fret_distance = 40;
      let max_fret_distance = 140;
      let min_width = min_fret_distance * (fret_count + 1);
      let max_width = max_fret_distance * (fret_count + 1);
      width = Math.min(max_width, Math.max(min_width, width)); // Calculate fret and string distances based on container width

      let fret_distance = width / (fret_count + 1);
      let string_distance = fret_distance * 0.65; // Calculate paddings and margins based on fret and string distances

      let string_padding = string_distance * 0.1;
      let fret_padding = fret_distance * 0.01;
      let margin_horizontal = fret_distance * 0.8;
      let margin_vertical = string_distance * 0.5;
      let height = string_distance * tuning.length + margin_vertical;
      let string_width = width - margin_horizontal * 1.2;
      let fret_markers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
      let fret_height = string_distance * (tuning.length - 1);
      let fret_width = fret_distance * 0.06;
      let note_radius = fret_distance * 0.22;
      let note_stroke_width = note_radius * 0.2;
      let note_font_size = note_radius * 1.05;
      let fret_marker_radius = note_radius * 0.3; // Setup SVG

      svg.attr('width', width).attr('height', height);
      let transform = `translate(${margin_horizontal}, ${margin_vertical})`;
      let g_frets = svg.append('g').attr('class', 'frets').attr('transform', transform);
      let g_fret_markers = svg.append('g').attr('class', 'fret-markers').attr('transform', transform);
      let g_strings = svg.append('g').attr('class', 'strings').attr('transform', transform);
      let g_notes = svg.append('g').attr('class', 'notes').attr('transform', transform); // draw frets

      for (let i = 0; i <= fret_count; i++) {
        let offset = i * fret_distance; // make nut a little wider

        let stroke_width = fret_width;
        if (0 == i) stroke_width *= 1.5;
        g_frets.append('svg:line').attr('x1', offset).attr('y1', -string_padding / 2).attr('x2', offset).attr('y2', fret_height + string_padding).style('stroke', '#222222').style('stroke-width', stroke_width).append('title').text(i);
      } // draw fret markers


      for (let i of fret_markers) {
        if (i > fret_count) {
          break;
        }

        let cx = i * fret_distance - fret_distance / 2;
        let cy = height - margin_vertical - fret_marker_radius * 3;

        if (0 == i % 12) {
          let offset = fret_marker_radius * 1.3;
          drawCircle(g_fret_markers, cx + offset, cy, fret_marker_radius); // make sure the next circle is offset in the other direction

          cx -= offset;
        }

        drawCircle(g_fret_markers, cx, cy, fret_marker_radius);
      } // draw strings


      for (let i = 0; i < tuning.length; i++) {
        let root = tuning[i];
        let offset = i * string_distance;
        g_strings.append('svg:line').attr('x1', -fret_padding / 2).attr('y1', offset).attr('x2', string_width + fret_padding).attr('y2', offset).style('stroke', '#444444').style('stroke-width', string_gauges[i] * string_distance).append('title').text(root);
      } // draw notes


      for (let string_idx = 0; string_idx < tuning.length; string_idx++) {
        let root_idx = noteIndex(tuning[string_idx]);

        for (let fret_idx = 0; fret_idx <= fret_count; fret_idx++) {
          let note = noteAtPosition(root_idx, fret_idx, notes);
          if (!note) continue;
          let cx = fret_idx * fret_distance - fret_distance * 0.5;
          let cy = string_idx * string_distance;
          let x = cx - note_font_size * 0.34;
          let y = cy + note_font_size * 0.34; // shift to left more for sharps and flats

          if (note.length > 1) {
            x = cx - note_font_size * 0.5;
          }

          drawCircle(g_notes, cx, cy, note_radius, '#ffffff', '#aaaaaa', note_stroke_width, note);
          g_notes.append('svg:text').attr('x', x).attr('y', y).attr('fill', '#000000').style('font-size', `${note_font_size}px`).text(noteLabel(note));
        }
      }
    }

    // Define defaults for stringed instruments.
    let instruments = {
      guitar: {
        tuning: ['E', 'B', 'G', 'D', 'A', 'E'],
        string_gauges: [0.01, 0.013, 0.017, 0.026, 0.036, 0.046],
        fret_count: 15
      },
      ukulele: {
        tuning: ['A', 'E', 'C', 'G'],
        string_gauges: [0.024, 0.031, 0.037, 0.026],
        fret_count: 12
      }
    };

    exports.drawFretboard = drawFretboard;
    exports.instruments = instruments;
    exports.noteColors = noteColors;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
