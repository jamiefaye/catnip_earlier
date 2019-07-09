import React from 'react';
import {ButtonRow} from './ButtonRow.jsx';
import {WaveGroup} from './WaveGroup.jsx';
import {audioCtx} from './AudioCtx.js';
import UndoStack from './UndoStack.js';
import {base64ArrayBuffer, base64ToArrayBuffer} from './base64data.js';
import {audioBufferToWav} from './audioBufferToWav.js';
import {openFileBrowser} from '../../filedlg/FileBrowser.js';
import {NipFile} from '../../common/NipFile.jsx';

var localClipboard;

class Waverly extends NipFile {
  constructor(props) {
	super(props);
	this.handleCmd = this.handleCmd.bind(this);
	this.reportWave = this.reportWave.bind(this);
	this.undoStack = new UndoStack(6);
	this.content_type = "audio/wav";
  }

  render() {
	return  <div>
		<WaveGroup filename={this.props.file} reportWave = {this.reportWave} />
		<ButtonRow cmd={this.handleCmd} />
	 </div>;
  }

  reportWave(waveObj) {
	this.wave = waveObj;
  }


  handleCmd(cmd, e) {
	switch (cmd) {
	case 'undobut':
		this.doUndo(e);
		break;
	case'redobut':
		this.doRedo(e);
		break;
	case'cutbut':
		this.cutToClip(e);
		break;
	case'copybut':
		this.copyToClip(e);
		break;
	case 'pastebut':
		this.pasteFromClip(e);
		break;
	case 'delbut':
		this.deleteSelected(e);
		break;
	case 'selallbut':
		this.selAll(e);
		break;
	case 'zoomselbut':
		this.zoomsel(e);
		break;
	case 'plsybut':
		this.wave.surfer.playPause(e);
		break;
	case'plsyselbut':
		this.doPlaySel(e);
		break;
	case 'zoomoutbut':
		this.zoom(0.5);
		break;
	case 'zoominbut':
		this.zoom(2.0);
		break;
	case 'trimbut':
		this.trimtozero();
		break;
	case 'rewbut':
		this.wave.surfer.seekTo(0);
		break;
	case 'cropbut':
		this.cropToSel(e);
		break;
	case 'normbut':
		this.normalizer(e);
		break;
	case 'reversebut':
		this.reverser(e);
		break;
	case 'fadeinbut':
		this.fadeIn(e);
		break;
	case 'fadeoutbut':
		this.fadeOut(e);
		break;
	case 'openbut':
		this.openDlg(e);
		break;
	case 'savebut':
		let aBuf = this.wave.backend.buffer;
		let saveData = audioBufferToWav(aBuf);
		this.saveDlg(saveData);
		break;
	default:
		break;
	}
}


 doPlaySel(e)
{
	let {start, end} = this.wave.getSelection(true);
	this.wave.surfer.play(start, end);
}


  deleteSelected(e)
{
	let buffer = this.wave.backend.buffer;
	let {insertionPoint, length, first, last, region} = this.wave.getSelection(false);
	if (insertionPoint) return;

	let ds = last - first;
	let {numberOfChannels, sampleRate} = buffer;
	let bufLen = length - ds;
	if (bufLen === 0) bufLen = 1;
	let nextBuffer = audioCtx.createBuffer(numberOfChannels, bufLen, sampleRate);

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let sa = buffer.getChannelData(cx);
		let da = nextBuffer.getChannelData(cx);
		let dx = 0;
		for(let i = 0; i < first; ++i) {
			da[dx++] = sa[i];
		}
		for(let i = last; i < length; ++i) {
			da[dx++] = sa[i];
		}
	}
	if(region) region.remove();
	this.undoStack.push(buffer);
	this.wave.changeBuffer(nextBuffer);
}

   cropToSel (e) {
	let buffer = this.wave.backend.buffer;
	let {insertionPoint, first, last, region} = this.wave.getSelection(false);
	if (insertionPoint) return;

	let bufLen = last - first;
	let {numberOfChannels, sampleRate} = buffer;

	let nextBuffer = audioCtx.createBuffer(numberOfChannels, bufLen, sampleRate);

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let sa = buffer.getChannelData(cx);
		let da = nextBuffer.getChannelData(cx);
		let dx = 0;
		for(var i = first; i < last; ++i) {
			da[dx++] = sa[i];
		}
	}
	if(region) region.remove();
	this.wave.surfer.seekTo(0);
	this.undoStack.push(buffer);
	this.wave.changeBuffer(nextBuffer);
  }

// Adjust the selection so that it trims to zero crossings
 trimtozero() {
	let buffer = this.wave.backend.buffer;
	let {sampleRate} = buffer;
	let {insertionPoint, first, last} = this.wave.getSelection(false);
	if (insertionPoint) return;

	let sa = buffer.getChannelData(0);

	while (sa[first] === 0.0 && first < last) first++;
	last--;
	while (sa[last] === 0.0 && first < last) last--;
	let lsgn = Math.sign(sa[first]);
	if(last < first) return;
	let newL = first;
	for (let i = first + 1; i <= last; ++i) {
		if(Math.sign(sa[i]) !== lsgn) {
			newL = i;
			break;
		}
	}

	let newR = last;
	let rsgn = Math.sign(sa[newR]);
	for (let i = last - 1; i >= first; i--) {
		if(Math.sign(sa[i]) !== rsgn) {
			newR = i + 1;
			break;
		}
	}
	this.wave.setSelection(newL / sampleRate, newR / sampleRate);
}

// Apply a transform function to the selected area and replace the selected area
// with the result. The transform function can be either 'in place' or can return a
// result buffer of any size.
 applyTransform(f, f2)
{
	let working = this.wave.copySelected();
	let result = f(working, f2);

	this.undoStack.push(this.wave.pasteSelected(result));
}

  reverser(e) {
	this.applyTransform(reverse);
}

  normalizer(e) {
	
	this.applyTransform(normalize);
}

  fadeIn(e) {
	
	let f = function (s, i, len) {
		return s * (i / len);
	}
	this.applyTransform(applyFunction, f);
}

  fadeOut(e) {
	
	let f = function (s, i, len) {
		return s * (1.0 - i / len);
	}
	this.applyTransform(applyFunction, f);
}

  selAll(e) {
	let {insertionPoint, start, end, duration} = this.wave.getSelection(false);
	this.wave.surfer.regions.clear();
	this.wave.surfer.seekTo(0);
	// If wa are alread a full selection, quit right after we cleared.
	if (!insertionPoint && start === 0 && end === duration) return;

	let pos = {
		start:	0,
		end:	this.wave.surfer.getDuration(),
		drag:	false,
		resize: false,
	};
	this.wave.surfer.regions.add(pos);
}

  doUndo(e) {
	console.log("Undo");

	if (this.undoStack.atTop()) {
		let buffer = this.wave.backend.buffer;
		this.undoStack.push(buffer);
	}
	let unbuf = this.undoStack.undo();
	this.wave.changeBuffer(unbuf);
}

  doRedo(e) {
	console.log("Redo");
	let redo = this.undoStack.redo();
	this.wave.changeBuffer(redo);
}

   copyToClip(e) 
{
	let clip = e.clipboardData;

	let clipBuff = this.wave.copySelected();
	let wavData = audioBufferToWav(clipBuff);
	let asText = base64ArrayBuffer(wavData);
	localClipboard = clipBuff;
	if (clip) clip.setData('text/plain', asText);
	e.preventDefault();
}

   cutToClip(e) {
	this.copyToClip(e);
	this.deleteSelected(e);
}

  pasteFromClip(e)
 {
 	let me = this;
	let clipBd = e.clipboardData;
	if (clipBd) {
		let clip = clipBd.getData('text/plain');
		if (clip.startsWith('Ukl')) {
			let asbin = base64ToArrayBuffer(clip);
			me.wave.backend.decodeArrayBuffer(asbin, function (data) {
			if (data) me.undoStack.push(me.wave.pasteSelected(data, true));
	 	  }, function (err) {
			alert('paste decode error');
		  });
		  return;
		}
	}
	if (localClipboard) {
		this.undoStack.push(this.wave.pasteSelected(localClipboard, true));
	}
 }

  zoom(amt) {
	
	let minPxWas = this.wave.surfer.params.minPxPerSec;
	let newPx = minPxWas * amt;
	let zoomLimit = 192000;
	if (newPx > zoomLimit) newPx = zoomLimit;
// console.log('zoom rate: ' + newPx);
	this.wave.surfer.zoom(newPx);
}

  zoomsel() {
	let {start, end, duration} = this.wave.getSelection(false);
	let vw =  this.wave.surfer.drawer.getWidth();
	let dTs = end - start;
	let newPx;
	if (dTs > 0) {
		newPx = vw / dTs;
	} else {
		newPx = vw / duration * 0.9;
	}
//	this.wave.surfer.zoom(newPx);
//	this.wave.seekTo( (start - (dTs / 2)) / duration);
	
	this.wave.reframe(newPx, (start + end) / 2 / duration);
  }

  openDlg(e) {

	let initial='/';
	openFileBrowser({
		initialPath:  initial,
		opener: function(name) {
			//openFile(name);
			window.alert(name);
		}
	});

  }


} // End of class.


// Simplified to just multiply by 1/max(abs(buffer))
// (which preserves any existing DC offset).
function normalize(buffer)
{
	let {numberOfChannels} = buffer;
	for (var cx = 0; cx < numberOfChannels; ++cx) {
		var maxv = -1000000;
		let d = buffer.getChannelData(cx);
		for (let i = 0; i < d.length; ++i) {
			let s = d[i];
			if (s < 0) s = -s;
			if (s > maxv) maxv = s;
		}
		if (maxv === 0) return;
		let scaler = 1.0 / maxv;
		for (let i = 0; i < d.length; ++i) {
			d[i] = d[i]* scaler;
		}
	}

	return buffer;
}

function reverse (buffer)
{
	let {numberOfChannels} = buffer;
	let bufLen = buffer.getChannelData(0).length;
	let halfbuf = bufLen / 2;

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let d = buffer.getChannelData(cx);
		let td = bufLen - 1;
		for (var i = 0; i < halfbuf; ++i) {
			let s = d[i];
			d[i] = d[td];
			d[td--] = s;
		}
	}

	return buffer;
}

function applyFunction (buffer, f)
{
	let {numberOfChannels} = buffer;
	let bufLen = buffer.getChannelData(0).length;

	for (var cx = 0; cx < numberOfChannels; ++cx) {
		let d = buffer.getChannelData(cx);
		for (var i = 0; i < d.length; ++i) {
			d[i] = f(d[i], i, bufLen);
		}
	}

	return buffer;
}



export {Waverly};
