// https://github.com/yaph/traste v0.3.0 Copyright 2021 undefined
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('@tonaljs/tonal')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', '@tonaljs/tonal'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.traste = {}, global.d3, global.Tonal));
}(this, (function (exports, d3Selection, tonal) { 'use strict';

    let chromatic_scale = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']; // 7 qualitative colors from https://colorbrewer2.org/#type=qualitative&scheme=Set3&n=7 for natural notes
    // flats/sharps are assigned the color in between with using https://gka.github.io/palettes/

    let note_colors = ['#8dd3c7', '#cae9be', '#ffffb3', '#bebada', '#e49ea5', '#fb8072', '#cc9ba2', '#80b1d3', '#fdb462', '#dbca65', '#b3de69', '#a5d89a'];
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
        for (let name of notes) {
          if (note == tonal.Note.enharmonic(name)) {
            return name;
          }
        }

        return;
      }

      return note;
    }
    /**
     * Return a list of colors, one for each note in the given notes list.
     *
     * @param {Object[]} notes - list of notes
     */

    function noteColors(notes) {
      let colors = [];

      for (let note of notes) {
        colors.push(note_colors[noteIndex(note)]);
      }

      return colors;
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

      const enharmonic = tonal.Note.enharmonic(name);

      if (chromatic_scale.includes(enharmonic)) {
        return chromatic_scale.indexOf(enharmonic);
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
      const circle = parent.append('svg:circle').attr('cx', cx).attr('cy', cy).attr('r', radius).style('fill', fill);
      if (stroke) circle.style('stroke', stroke);
      if (stroke_width) circle.style('stroke-width', stroke_width);
      if (title) circle.attr('title', title);
    }

    function drawFretboard(selector, instrument, notes) {
      const tuning = instrument.tuning;
      const string_gauges = instrument.string_gauges;
      const fret_count = instrument.fret_count;
      const svg = d3Selection.select(selector);
      svg.selectAll('*').remove();
      const bbox = svg.node().parentElement.getBoundingClientRect();
      let width = bbox.width * 0.95; // Readjust width so the fretboard works for different screen sizes and fret counts

      const min_fret_distance = 26;
      const max_fret_distance = 140;
      const min_width = min_fret_distance * (fret_count + 1);
      const max_width = max_fret_distance * (fret_count + 1);
      width = Math.min(max_width, Math.max(min_width, width)); // Calculate fret and string distances based on container width

      const fret_distance = width / (fret_count + 1);
      const string_distance = fret_distance * 0.65; // Calculate paddings and margins based on fret and string distances

      const string_padding = string_distance * 0.1;
      const fret_padding = fret_distance * 0.01;
      const margin_horizontal = fret_distance * 0.8;
      const margin_vertical = string_distance * 0.5;
      const height = string_distance * tuning.length + margin_vertical;
      const string_width = width - margin_horizontal * 1.2;
      const fret_height = string_distance * (tuning.length - 1);
      const fret_width = fret_distance * 0.06;
      const note_radius = fret_distance * 0.23;
      const note_stroke_width = note_radius * 0.1;
      const note_font_size = note_radius * 1.05;
      const fret_marker_radius = note_radius * 0.3; // Setup SVG

      svg.attr('width', width).attr('height', height);
      const transform = `translate(${margin_horizontal}, ${margin_vertical})`;
      const g_frets = svg.append('g').attr('class', 'frets').attr('transform', transform);
      const g_fret_markers = svg.append('g').attr('class', 'fret-markers').attr('transform', transform);
      const g_strings = svg.append('g').attr('class', 'strings').attr('transform', transform);
      const g_notes = svg.append('g').attr('class', 'notes').attr('transform', transform); // draw frets

      for (let i = 0; i <= fret_count; i++) {
        let offset = i * fret_distance; // make nut a little wider

        let stroke_width = fret_width;
        if (0 == i) stroke_width *= 1.5;
        g_frets.append('svg:line').attr('x1', offset).attr('y1', -string_padding / 2).attr('x2', offset).attr('y2', fret_height + string_padding).style('stroke', '#222222').style('stroke-width', stroke_width).append('title').text(i);
      } // draw fret markers


      for (let i of instrument.fret_markers) {
        if (i > fret_count) {
          break;
        }

        let cx = i * fret_distance - fret_distance / 2;
        let cy = height - margin_vertical - fret_marker_radius * 3;

        if (0 == i % 12) {
          const offset = fret_marker_radius * 1.3;
          drawCircle(g_fret_markers, cx + offset, cy, fret_marker_radius); // make sure the next circle is offset in the other direction

          cx -= offset;
        }

        drawCircle(g_fret_markers, cx, cy, fret_marker_radius);
      } // draw strings


      for (let i = 0; i < tuning.length; i++) {
        const root = tuning[i];
        const offset = i * string_distance;
        g_strings.append('svg:line').attr('x1', -fret_padding / 2).attr('y1', offset).attr('x2', string_width + fret_padding).attr('y2', offset).style('stroke', '#444444').style('stroke-width', string_gauges[i] * string_distance).append('title').text(root);
      } // draw notes


      for (let string_idx = 0; string_idx < tuning.length; string_idx++) {
        const root_idx = noteIndex(tuning[string_idx]);

        for (let fret_idx = 0; fret_idx <= fret_count; fret_idx++) {
          const note = noteAtPosition(root_idx, fret_idx, notes);
          if (!note) continue;
          const label = noteLabel(note); // Adjust font size based on label length to better fit sharps and flats.

          const reduce = 5 * (1 - 1 / label.length);
          const font_size = note_font_size - reduce;
          const cx = fret_idx * fret_distance - fret_distance * 0.5;
          const cy = string_idx * string_distance;
          drawCircle(g_notes, cx, cy, note_radius, '#ffffff', '#999999', note_stroke_width, note);
          g_notes.append('svg:text').attr('x', cx).attr('y', cy).attr('dy', '0.33em').attr('fill', '#000000').style('text-anchor', `middle`).style('font-size', `${font_size}px`).text(label);
        }
      }
    }

    // Define defaults for stringed instruments.
    let instruments = {
      guitar: {
        tuning: ['E', 'B', 'G', 'D', 'A', 'E'],
        string_gauges: [0.01, 0.013, 0.017, 0.026, 0.036, 0.046],
        fret_count: 15,
        fret_markers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]
      },
      ukulele: {
        tuning: ['A', 'E', 'C', 'G'],
        string_gauges: [0.024, 0.031, 0.037, 0.026],
        fret_count: 12,
        fret_markers: [5, 7, 10, 12, 15, 17, 19]
      }
    };

    exports.drawFretboard = drawFretboard;
    exports.instruments = instruments;
    exports.noteColors = noteColors;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
