import React from 'react';
import {ButtonRow} from './ButtonRow.jsx';
import {WaveGroup} from './WaveGroup.jsx';

class Waverly extends React.Component {
  constructor(props) {
	super(props);
  }

  render() {
	return  <div>
		<WaveGroup filename={this.props.file}/>
		<ButtonRow />
	 </div>;
  }
}

export {Waverly};
