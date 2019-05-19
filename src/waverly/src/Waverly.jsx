import React from 'react';
import {ButtonRow} from './ButtonRow.jsx';
import {WaveGroup} from './WaveGroup.jsx';

class Waverly extends React.Component {
  constructor(props) {
	super(props);
	this.cmd = this.cmd.bind(this);
  }

  render() {
	return  <div>
		<WaveGroup filename={this.props.file}/>
		<ButtonRow cmd={this.cmd} />
	 </div>;
  }
  
  cmd(what,who) {
	console.log("cmd: " + what);
  }
}

export {Waverly};
