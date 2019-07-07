import React from 'react';

import FileSaver from 'file-saver';

import {determineRunContext} from './RunContext';
import {saveFileBrowser} from '../filedlg/FileBrowser.js';
import {getDropInFS, getFlashAirFS, switchFS} from '../FileStore';

 class NipFile extends React.Component {

  constructor(props) {
   super(props);
  }
   doLocalFileSave(saveData, saveName) {

	var blob = new Blob([saveData], {type: this.content_type});
	FileSaver.saveAs(blob, saveName);
  }

  saveDlg(data){
	let me = this;
	let runContext = determineRunContext();
	if (!runContext.flashAir) {
		return this.doLocalFileSave(data, this.props.fileItem.fname);
	} else {
		switchFS(getFlashAirFS());
		saveFileBrowser({
		  initialPath: this.props.fileItem.fname,
		  saver: function(name) {
			let fafs = getFlashAirFS();
			//   write(filepath, data, kind, done, progress)
			//alert("Saving to: " + name);
			fafs.write(name, data, me.props.content_type);
		  }
	 });
	}
  }

}

export {NipFile};