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


class RowImgButton extends React.Component {

  render() {
	return <button className="butn" onClick={e=>this.props.cmd(this.props.action, e)} title={this.props.title}> <img src={this.props.src} alt={this.props.title}/></button>
  }
}

class RowButton extends React.Component {

  render() {
	return <button className="butn" onClick={e=>this.props.cmd(this.props.action, e)}>{this.props.text}</button>
  }
}

class ButtonRow extends React.Component{

  render() {
	let cmd = this.props.cmd;
    return (
      <div>
        <RowImgButton cmd={cmd} action='zoominbut' title="Zoom in" src={zoominbut} alt='zoom in'/>
        <RowImgButton cmd={cmd} action='zoomselbut' title="Zoom to"  src={zoomselbut} alt='zoom to'/>
        <RowImgButton cmd={cmd} action='zoomoutbut' title="Zoom out" src={zoomoutbut} alt='zoom out'/>
        <RowImgButton cmd={cmd} action='rewbut' title="Back to start" src={rewbut} alt='rewind'/>
        <RowImgButton cmd={cmd} action='plsybut' title="Play" width="16px" height="18px" className="playbutimg" src={plsybut} alt='play'/>
        <RowImgButton cmd={cmd} action='plsyselbut' title="Play selected" src={plsyselbut} alt='play sel'/>
        <RowImgButton cmd={cmd} action='undobut' title="Undo" src={undobut} alt='undo'/>
        <RowImgButton cmd={cmd} action='redobut' title="Redo" src={redobut} alt='redo'/>
        <RowImgButton cmd={cmd} action='selallbut' title="Select All" src={selallbut} alt='sel all'/>
        <RowButton cmd={cmd} action='delbut' title="Delete"/>
        <RowImgButton cmd={cmd} action='cutbut' title="Cut to clipboard" src={cutbut} alt='cut'/>
        <RowImgButton cmd={cmd} action='copybut' title="Copy to clipboard" src={copybut} alt='copy'/>
        <RowImgButton cmd={cmd} action='pastebut' title="Paste from clipboard" src={pastebut} alt='paste'/>
        <table><tbody><tr>
              <td><RowButton cmd={cmd} action='trimbut' text='Trim'/></td>
              <td><RowButton cmd={cmd} action='cropbut' text='Crop'/></td>
              <td><RowButton cmd={cmd} action='normbut' text='Normalize'/></td>
              <td><RowButton cmd={cmd} action='reversebut' text='Reverse'/></td>
              <td><RowButton cmd={cmd} action='fadeinbut' text='Fade In'/></td>
              <td><RowButton cmd={cmd} action='fadeoutbut' text='Fade Out'/></td>
            </tr>
          </tbody></table>
      </div>
    );
  }
}

export {ButtonRow};