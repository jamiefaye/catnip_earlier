import React from 'react';
//import ReactDOM from 'react-dom';

import { DragDrop } from '@uppy/react';
import { Uppy } from '@uppy/core';
import {getDropInFS, getFlashAirFS} from '../FileStore';
import {FileList} from './FileList.jsx';
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import './DirPage.css';
import {openWAV} from '../waverly/src/viewWAV.js';
import {myLayout} from '../index.js';


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
	return <DragDrop uppy={this.uppy}/>
  }
}

class DirPage extends React.Component {
  constructor (props) {
	super(props);
	this.loadItems = this.loadItems.bind(this);
	this.chDir = this.chDir.bind(this);
	this.launch = this.launch.bind(this);
	this.dropFS = getDropInFS();
	this.state = {pathDir: "/", list: []};
  }

  render () {
  	let me = this;
	return <div><div className='dropzone'><DropZone loadFunc={this.loadItems}/>
	</div>
	<FileList list ={this.state.list} chDir={me.chDir} launch={me.launch} />
	</div>
  }

  chDir(toDir) {
	let me = this;
	this.setState((state)=>{
		console.log("To Dir: " + toDir);
		let newPath;
		if (toDir === '..') {
			let splut = state.pathDir.split('/');
			splut.pop();
			newPath = splut.join('/');
		} else {
			newPath = state.pathDir !== '/' ? state.pathDir + "/" + toDir : "/" + toDir;
		}
		let fs = me.dropFS;
			fs.dir(newPath, function (list, stat) {
				me.setState({list: list});
			});
			return {pathDir: newPath}
	});
  }


  launch(item) {
	let launchPath = item.r_uri + '/' + item.fname;
	console.log("launch " + launchPath);
	console.log(item);
	
	
//Add another component to the layout
	myLayout.root.getItemsById('addDocPlace')[ 0 ].addChild({
		type:'react-component',
		component: 'Waverly',
		props: { file: launchPath }
	});
  }

  loadItems(itemList) {
	console.log(itemList);
	this.dropFS.addFiles(itemList);
	
	let fs = this.dropFS;
	let me = this;
	fs.dir(this.state.pathDir, function (list, stat) {
		me.setState({list: list});
	});
  }

};

export {DirPage};