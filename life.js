// An implementation of Conway's Game of Life using HTML5's canvas and
// JavaScript.
//
// This software is provided under the MIT licence:
//
// Copyright (c) 2010 Rob Hague
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Start with a declaration of the global variables provided by the
// browser, to make JSLint happy.
/*global document, clearInterval, setInterval, console*/ 

var life = function() {
    // The function constructs the game board and controls inside an
    // element (ideally, a div) with the ID 'life', replacing any
    // existing contents of that element.
    var container = document.getElementById('life');
    container.innerHTML = '';

    // Buffers; two identical canvas elements are used to provide
    // double-buffering
    function makeBuffer() {
        var buffer = document.createElement('canvas');
        buffer.width = 320;
        buffer.height = 320;
        buffer.display = 'none';
        buffer.style.border = 'solid 2px #000';
        container.appendChild(buffer);
        return buffer;
    }
    var bufferIdx = 0;
    var buffers = [ makeBuffer(), makeBuffer() ];

    // Game state; basically, an Array of 0s (dead) and 1s
    // (alive). Anything outside the bounds defined by width and
    // height is assumed to be dead.
    var cellSize = 5;
    var width = buffers[0].width / cellSize;
    var height = buffers[0].height / cellSize;
    var state; // Initialised in the clear() function, defined later
    function getState(x,y) {
        return !(x < 0 || x >= width || y < 0 || y >= height ||
                !state[x+y*width]);
    }
    function setState(x,y,v) {
        state[Math.floor(x) + width*Math.floor(y)] = v;
    }

    // Rendering
    var editPoint;
    function render() {
        var currentBuffer = buffers[bufferIdx];
        var C = currentBuffer.getContext('2d');
        if (C) {
            // Draw
            C.clearRect(0, 0, currentBuffer.width, currentBuffer.height);

            C.strokeStyle = "#eeeeee";
            C.fillStyle = "#0000aa";
            for(var x = 0; x < width; x++) {
                for(var y = 0; y < height; y++) {
                    if (getState(x,y)) {
                        C.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
                    }
                    C.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize);
                }
            }

            if (editPoint) {
                C.strokeStyle = "#ff0000";
                C.strokeRect(editPoint.x*cellSize, editPoint.y*cellSize,
                             cellSize, cellSize);
            }

            // Swap and display
            bufferIdx = 1 - bufferIdx;
            currentBuffer.style.display='block';
            buffers[bufferIdx].style.display='none';
        }
    }

    // Animation and state management
    var interval;
    function stop() {
        clearInterval(interval);
    }
    function step() {
        var newState = new Array(state.length);
        var stable = 1;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {                
                var neighbours = 
                    getState(x-1,y-1) + getState(x,y-1) + getState(x+1,y-1) +
                    getState(x-1,y) + getState(x+1,y) +
                    getState(x-1,y+1) + getState(x,y+1) + getState(x+1,y+1);

                var oldVal = getState(x,y);
                var newVal =
                    ((neighbours === 3) || (oldVal && neighbours === 2))? 1 : 0;
                newState[x+y*width] = newVal;
                stable = stable && (oldVal === newVal);
            }
        }
        state = newState;
        if (stable) { stop(); }
        render();
    }
    function start() {
        clearInterval(interval); interval = setInterval(step, 100);
    }
    function start_quick() {
        clearInterval(interval); interval = setInterval(step, 0);
    }
    function clear() {
        stop();
        state = new Array(width * height);
        for(var i = 0; i < state.length; i++) { state[i] = 0; }
        render();
    }

    // Buttons; basic controls
    function addButton(label, fn) {
        var button = document.createElement('input');
        button.type = 'button';
        button.value = label;
        button.onclick = fn;
        container.appendChild(button);
    }
    addButton('Start', start);
    addButton('Quick', start_quick);
    addButton('Stop', stop);
    addButton('Step', step);
    addButton('Clear', clear);

    // Shapes; this provides a mechanism to add predefined shapes,
    // such as gliders
    function addShape(x, y, shape) {
        var xoffset = -(shape[0].length-1)/2, yoffset = -(shape.length-1)/2,
            row;
        for(var yy = 0; yy < shape.length; yy++) {
            row = shape[yy];
            for(var xx = 0; xx < row.length; xx++) {
                setState(x+xx+xoffset, y+yy+yoffset, row[xx] === '*'? 1 : 0);
            }
        }
    }
    var shapes = {
        'Point': ["*"],
        'Erase': [" "],
        'Block': ["**","**"],
        'Horizontal bar': ["***"],
        'Vertical bar': ["*","*","*"],
        'Glider NE': ["***", "  *", " * "],
        'Glider NW': ["***", "*  ", " * "],
        'Glider SE': [" * ", "  *", "***"],
        'Glider SW': [" * ", "*  ", "***"],
        'R-pentomino': [" **", "** ", " * "]
    };
    var selector = document.createElement('select');
    for(var name in shapes) {
        if (shapes.hasOwnProperty(name)) {
            var option = document.createElement('option');
            option.value= name;
            option.innerHTML = name;
            selector.appendChild(option);
        }
    }
    var currentShape = 'Point';
    selector.onchange = function() {
        currentShape = this.options[this.selectedIndex].value;
    };
    container.appendChild(selector);

    // Save & Restore

    // This uses a basic runlength encoding, serialised using
    // base64. If the runlength is less than 64, a single base64
    // character is used. Otherwise, the special character '=' is
    // used, followed by two base64 characters. The maximum run length
    // is 4095; longer runs are broken up with zero-length runs of the
    // alternate value.
    var base64chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function toBase64(value) { return base64chars.charAt(value); }
    function fromBase64(chr) {
        return (chr === 43)? 62 :
        (chr === 47)? 63 :
        (chr > 64 && chr < 91)? chr - 65 :
        (chr > 96 && chr < 123)? chr - 71 :
        (chr > 47 && chr < 58)? chr + 4 :
        0;
    }
    function encodeRunlength(rl) {
        if (rl < 64) {
            return toBase64(rl);
        } else {
            return '=' + toBase64(rl >> 6) + toBase64(rl & 63);
        }
    }

    var serialisedState = document.createElement('input');

    function save() {
        stop();
        var serial = '', current = 0, rl = 0;
        for(var i = 0; i < state.length; i++, rl++) {
            if (current !== state[i]) {
                serial = serial + encodeRunlength(rl);
                rl = 0;
                current = current? 0 : 1;
            } else if (rl === 4095) {
                serial = serial + encodeRunlength(rl) + encodeRunlength(0);
                rl = 0;
            }
        }
        serial = serial + encodeRunlength(rl);
        serialisedState.value = serial;
    }

    function restore() {
        stop();
        var serial = serialisedState.value, i = 0, current = 0,
        rl, target;
        for(var idx = 0; idx < serial.length; idx++) {
            var chr = serial.charCodeAt(idx);
            if (chr === 61) {
                rl = (fromBase64(serial.charCodeAt(idx+1)) << 6) +
                    fromBase64(serial.charCodeAt(idx+2));
                idx += 2;
            } else {
                rl = fromBase64(chr);
            }
            target = i + rl;
            while(i < target) { state[i++] = current; }
            current = current? 0 : 1;
        }
        render();
    }

    serialisedState.type = 'text';
    serialisedState.length = 20;
    container.appendChild(document.createElement('br'));
    addButton("Save", save);
    container.appendChild(serialisedState);
    addButton("Restore", restore);

    // Editing
    function setEvents(buffer) {
        buffer.onmouseup = function(evt) {
            stop();
            var bounds = buffers[1-bufferIdx].getBoundingClientRect();
            var x = (evt.clientX - bounds.left)/cellSize - 0.5;
            var y = (evt.clientY - bounds.top)/cellSize - 0.5;
            addShape(x, y, shapes[currentShape]);
            render();
        }

        buffer.onmousein = buffer.onmousemove = function(evt) {
            var bounds = buffers[1-bufferIdx].getBoundingClientRect();
            editPoint = {
                x: Math.floor((evt.clientX - bounds.left)/cellSize - 0.5),
                y: Math.floor((evt.clientY - bounds.top)/cellSize - 0.5)
            }
            render();
        }

        buffer.onmouseout = function(evt) {
            if (editPoint) {
                editPoint = undefined;
                render();
            }
        }
    }

    setEvents(buffers[0]);
    setEvents(buffers[1]);

    // Initialse the state, and add some interest
    clear();
    addShape(width/2, height/2, shapes['R-pentomino']);
    render();

    return container;
} ();