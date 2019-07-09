import $ from 'jquery';
import React from 'react';
import {Wave} from './Wave.js';
import {getRootFS} from '../../FileStore.js';


var idCtr = 0;

let waveGrp =`<div id='wavegroup{{idsuffix}}'>
<div id='jtab{{idsuffix}}'> </div>
<div id="waveform{{idsuffix}}"></div>
<div id="waveform{{idsuffix}}-timeline"></div>
<div id="waveform{{idsuffix}}-minimap"></div>
<div class='butnrow' id='butnrow{{idsuffix}}'>
</div>
<div id='procmods{{idsuffix}}'>
</div>`;


class WaveGroup extends React.Component {
  constructor(props) {
	super(props);
	this.id = "" + idCtr++;
	this.wavegname = '#waveform' + this.id;
	this.filename = "";
	this.state = {};
  }

  componentDidMount() {
	let waveG = waveGrp.split("{{idsuffix}}").join(this.id);
	$(this.el).append(waveG);
	this.wave = new Wave(this.wavegname, this.props.waveprops);
	this.props.reportWave(this.wave);
	if (this.props.filename !== undefined) {
		this.loadFile(this.props.filename); 
		// this.loadFile("/" + this.props.filename); 
	}

  }


  componentDidUpdate() {
	console.log("componentDidUpdate");
	let nameChanged = this.props.filename !== this.filename;

	if (nameChanged) {
		// console.log("starting load of " + this.props.filename);
		this.loadFile('/' + this.props.filename); 
	} else if (this.state.data && (this.hasNewData || !this.wave)) {
		this.openWaveSurfer(this.state.data);
	}
	// console.log("componentDidUpdate end");
  }

  setEditData(data) {
	this.hasNewData = true;
	this.setState({data: data});
	this.loadInProgress = false;
  }

  loadFile(filename, done)
{
	this.loadInProgress = true;
	this.filename = this.props.filename;
	let fs = getRootFS();
	let me = this;

	fs.read(filename, 'blob', function (data, status) {
		me.setEditData(data);
		if(done) done(data);
	});
  }

   openWaveSurfer(data) {
	this.wave.openOnBuffer(data);
  }

  render() {
	return <div ref={el => this.el = el}> </div>;
  }
}

export {WaveGroup};
