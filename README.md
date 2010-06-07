# CanvasLife

## Conway's Game of Life using <tt>&lt;canvas&gt;</tt> and JavaScript</h2>

CanvasLife is an implementation of <a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's
Game of Life</a> using the HTML5 canvas element and JavaScript. It
should work on any modern browser that supports canvas,
specifically recent versions of <a
href="http://www.mozilla.com/en-US/firefox">Firefox</a>, <a
href="http://www.apple.com/safari/">Safari</a>, <a
href="http://www.google.com/chrome">Chrome</a> or <a
href="http://www.opera.com/">Opera</a>.  <a
href="http://www.microsoft.com/windows/internet-explorer/">Internet
Explorer</a> is conspicuously absent from the list, as it doesn't
yet (to the best of my knowledge) support the canvas tag (there
are ways around this, but the original point of this project was
to experiment with canvas, not to spend ages looking at
cross-browser compatibility solutions).

The Start, Stop and Step buttons are used to control the
animation, and the Clear button clears the board. Click on the
board to mark cells as alive (blue). By default, only the cell
clicked is marked; the drop-down box provides more complex shapes,
as well as an eraser. The Save button serialised the state of the
game board, and places the resulting string in the text box next
to it. A previous state may be restored by pasting a generated
string into the text box and clicking the Restore button.

## Usage

The game is included in a web page by creating an block element (normally a <tt>&lt;div&gt;</tt>) with the ID 'life', and then invoking the script, like so:

    <div id="life">
      You need JavaScript (and a modern, canvas-supporting browser) to
      enjoy the Lifey goodness.
    </div>
    <script type="text/javascript" src="life.js"></script>

For a working example, see
<a href="http://robhague.github.com/CanvasLife/">here</a>.

## Licence

This software is provided under the MIT licence:

Copyright (c) 2010 Rob Hague

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
