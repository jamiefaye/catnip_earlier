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
  constructor(props) {
	super(props);
	this.cmd = this.cmd.bind(this);
 }

  render() {
	let cmd = this.cmd;
    return (
      <div>
        <button className="butn zoominbut" onClick={e=>cmd('zoominbut')} title="Zoom in"> <img src={zoominbut} alt='zoom in'/></button>
        <button className="butn zoomselbut" onClick={e=>cmd('zoomselbut')} title="Zoom to" > <img src={zoomselbut} alt='zoom to'/></button>
        <button className="butn zoomoutbut"  onClick={e=>cmd('zoomoutbut')} title="Zoom out"> <img src={zoomoutbut} alt='zoom out'/></button>
        <button className="butn rewbut"  onClick={e=>cmd('rewbut')} title="Back to start"><img src={rewbut} alt='rewind'/></button>
        <button className="butn plsybut"  onClick={e=>cmd('plsybut')} title="Play"><img width="16px" height="18px" className="playbutimg" src={plsybut} alt='play'/></button>
        <button className="butn plsyselbut" onClick={e=>cmd('plsyselbut')} title="Play selected"><img src={plsyselbut} alt='play sel'/></button>
        <button className="butn undobut" onClick={e=>cmd('undobut')} title="Undo"><img src={undobut} alt='undo'/></button>
        <button className="butn redobut" onClick={e=>cmd('redobut')} title="Redo"><img src={redobut} alt='redo'/></button>
        <button className="butn selallbut" onClick={e=>cmd('selallbut')} title="Select All"><img src={selallbut} alt='sel all'/></button>
        <button className="butn delbut" onClick={e=>cmd('delbut')} title="Delete">DEL</button>
        <button className="butn cutbut" onClick={e=>cmd('cutbut')} title="Cut to clipboard"><img src={cutbut} alt='cut'/></button>
        <button className="butn copybut" onClick={e=>cmd('copybut')} title="Copy to clipboard"><img src={copybut} alt='copy'/></button>
        <button className="butn pastebut" onClick={e=>cmd('pastebut')} title="Paste from clipboard"><img src={pastebut} alt='paste'/></button>
        <table><tbody><tr>
              <td><button className="butn trimbut" onClick={e=>cmd('trimbut')} >Trim</button></td>
              <td><button className="butn cropbut" onClick={e=>cmd('cropbut')} >Crop</button></td>
              <td><button className="butn normbut" onClick={e=>cmd('normbut')} >Normalize</button></td>
              <td><button className="butn reversebut" onClick={e=>cmd('reversebut')} >Reverse</button></td>
              <td><button className="butn fadeinbut" onClick={e=>cmd('fadeinbut')} >Fade In</button></td>
              <td><button className="butn fadeoutbut" onClick={e=>cmd('fadeoutbut')} >Fade Out</button></td>
            </tr>
          </tbody></table>
      </div>
    );
  }

  cmd(what) {
  	if (this.props.cmd) {
		this.props.cmd(what, this);
	}
  }
}

export {ButtonRow};