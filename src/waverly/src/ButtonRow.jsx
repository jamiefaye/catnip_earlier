import React from 'react';

import zoominbut from './img/glyphicons-237-zoom-in.png';
import zoomselbut from './img/glyphicons-zoom-sel.png';
import zoomoutbut from './img/glyphicons-238-zoom-out.png';
import rewbut from './img/glyphicons-172-fast-backward.png';
import plsybut from './img/glyphicons-174-play.png';
import plsyselbut from './img/glyphicons-221-play-button.png';
import undobut from './img/glyphicons-436-undo.png';
import redobut from './img/glyphicons-435-redo.png';
import selallbut from './img/glyphicons-729-resize-horizontal.png';
import cutbut from './img/glyphicons-599-scissors-alt.png';
import copybut from './img/glyphicons-512-copy.png';
import pastebut from './img/glyphicons-513-paste.png';

class ButtonRow extends React.Component{
  render() {
    return (
      <div>
        <button className="butn zoominbut" title="Zoom in"><img src={zoominbut} /></button>
        <button className="butn zoomselbut" title="Zoom to"><img src={zoomselbut} /> /></button>
        <button className="butn zoomoutbut" title="Zoom out"><img src={zoomoutbut} /></button>
        <button className="butn rewbut" title="Back to start"><img src={rewbut} /></button>
        <button className="butn plsybut" title="Play"><img width="16px" height="18px" className="playbutimg" src={plsybut} /></button>
        <button className="butn plsyselbut" title="Play selected"><img src={plsyselbut} /></button>
        <button className="butn undobut" title="Undo"><img src={undobut} /></button>
        <button className="butn redobut" title="Redo"><img src={redobut} /></button>
        <button className="butn selallbut" title="Select All"><img src={selallbut} /></button>
        <button className="butn delbut" title="Delete">DEL</button>
        <button className="butn cutbut" title="Cut to clipboard"><img src={cutbut} /></button>
        <button className="butn copybut" title="Copy to clipboard"><img src={cutbut} /></button>
        <button className="butn pastebut" title="Paste from clipboard"><img src={pastebut} /></button>
        <table><tbody><tr>
            /*  <td><div id="dropdn{{idsuffix}}" /></td> */
              <td><button className="butn trimbut">Trim</button></td>
              <td><button className="butn cropbut">Crop</button></td>
              <td><button className="butn normbut">Normalize</button></td>
              <td><button className="butn reversebut">Reverse</button></td>
              <td><button className="butn fadeinbut">Fade In</button></td>
              <td><button className="butn fadeoutbut">Fade Out</button></td>
            </tr>
          </tbody></table>
      </div>
    );
  }
}

export {ButtonRow};