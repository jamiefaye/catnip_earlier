import React from 'react';
//import ReactDOM from 'react-dom';

import { DragDrop } from '@uppy/react';
import { Uppy } from '@uppy/core';
import {getDropInFS, getFlashAirFS} from './FileStore';
import {FileList} from './FileList.jsx';
import './DirPage.css';

class DropZone extends React.Component {
  constructor (props) {
	super(props)
	this.uppy = new Uppy({  autoProceed: true});
	this.uppy.on('complete', (result) => {
		this.props.loadFunc(result.successful);
	})
  }

  componentWillUnmount () {
	this.uppy.close()
  }

  render () {
	return <DragDrop uppy={this.uppy} />
  }
}

class DirPage extends React.Component {
  constructor (props) {
	super(props);
	this.loadItems = this.loadItems.bind(this);
	this.dropFS = getDropInFS();
	this.state = {pathDir: "/", list: []};
  }

  render () {
  console.log("Rendering DirPage");
	return <div><div className='dropzone'><DropZone loadFunc={this.loadItems}/>
	</div>
	<FileList list ={this.state.list} />
	</div>
  }

  loadItems(itemList) {
	console.log(itemList);
	this.dropFS.addFiles(itemList);
	
	let fs = this.dropFS;
	let me = this;
	fs.dir(this.state.pathDir, function (list, stat) {
		console.log("Mountee");
		console.log(list);
		me.setState({list: list});
	});
  }

};

export {DirPage};