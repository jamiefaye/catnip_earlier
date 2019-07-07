import $ from 'jquery';
import Uppie from '../common/uppie.js';
import {formatDT} from './formatDT.js';
import {getActiveFS} from '../FileStore.js';

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}


function makeDateTime(dt) {
	if (!dt) return "";
	let seconds = dt.getSeconds();
	let minutes = dt.getMinutes();
	let hours   = dt.getHours();
	let day   = dt.getDay();
	let month = dt.getMonth();
	let year  =  dt.getYear();
	if (year < 2000) return "";
	return "" + month + '/' + day + '&nbsp;' + zeroPad(hours,2) + ':' + zeroPad(minutes,2);
}


function isDirectoryEntry(name, xlsd)
{
	let itemName = name.split('/').pop();
	for (var i = 0; i < xlsd.length; ++i) {
		let entry = xlsd[i];
		if (entry.fname === itemName) {
			if (entry.attr & 0x10) {
				 return true;
			} else return false;
		}
	}
	return false;
}


var editWhiteList = ['xml', 'js', 'htm', 'html', 'css', 'lua', 'wav'];
var editWhiteListSet = new Set(editWhiteList);

class FileWidget {

	constructor(params) {
		this.currentPath = '/';
		this.last_dirpath = "/";
		this.polling_active = false;
		this.filelist = [];
		this.sortOrder = 1;
		this.fieldNum = 0;
		let that = this;
		this.sortFunction = function(a, b) {
			if (!a["fname"]) return 0;
			return a["fname"].localeCompare(b["fname"]) * that.sortOrder;
		};
		if (params) {
			this.params = params;
		} else {
			this.params = {};
		}
		this.fs = getActiveFS();
	}

  toggleChecks (e) {
	var mcv = $('#headcheck').is(':checked');
	let tlist = $('.aBox');
	$.each(tlist, function(x) {
		$(this).prop('checked', mcv);
	});

}

  setSortFunction(fieldNum) {
	if (fieldNum === this.fieldNum) {
		this.sortOrder = -this.sortOrder;
	}
	this.fieldNum = fieldNum;
	let that = this;
	switch (fieldNum) {
case 0: 
	this.sortFunction = function(a, b) {
			if (!a["fname"]) return 0;
			return a["fname"].localeCompare(b["fname"]) * that.sortOrder;
		};
		break;
case 1:
	this.sortFunction = function(a, b) {
		if( a["fdate"] === b["fdate"] ) {
			return Math.sign(a["ftime"] - b["ftime"]) * that.sortOrder;
	} 	else {
			return Math.sign(a["fdate"] - b["fdate"]) * that.sortOrder;
		}
	};
	break;
case 2:
default:
	this.sortFunction = function(a, b) {
		return Math.sign(a["fsize"] - b["fsize"]) * that.sortOrder;
	};
	break;
	}  // End of switch
	let recheckSet = new Set(this.getCheckedList());
	this.filelist.sort(this.sortFunction);
	this.showFileList(this.currentPath, recheckSet);
}

  showFileList(path, recheckSet) {
	this.showListNew(path, recheckSet);
  }


  showListNew(path, recheckSet) {
	let place = this.params.place;
	let guiCallback = this.params.guiCallback;
	let dirCallback = this.params.dirCallback;
	if (!place) place = '.wrapper';
	$(place).empty();
	//$(place).append(html);
	//let obj = $(place)[0];
	let obj = [];
	let context = {
		place:		place,
		filelist:	this.filelist,
		path:		path,
		recheckSet: recheckSet,
		atRootLevel: path === '/',
	}

obj.push("<table class='filetab' id='filetable'><tbody>");
obj.push("<tr><th class='nameh table_bts'>Name</th><th class='sizeh table_bts'>Size</th><th class='dateh table_bts'>Date</th></tr>");

if(path!== '/') {obj.push(`
	<tr>
	<td class='table_name direntry' colspan='3'><span>..</span><a href="javascript:void(0)"/></td>
	</tr>`);
}
	for (let fx in this.filelist) {
		let f = this.filelist[fx];
		if (f.isDirectory) {
			obj.push("<tr><td class='table_name direntry'><b>" + f.fname + "</b><a href='javascript:void(0)'/></td><td colspan='2'></td></tr>");
		} else {
			obj.push("<tr><td class='table_name fileentry'>" + f.fname + "<a href='javascript:void(0)'/></td>");
			obj.push("<td class='table_dts'>" + f.fsize + "</td>");
			obj.push("<td class='table_dts'>" + formatDT(f) + "</td></tr>");
		}
	}
	obj.push("</tbody></table>");
	let html = obj.join('');
	$(place).append($($.parseHTML(html)));
	
	if (guiCallback) {
		guiCallback(this, context);
	} else {
		this.bindDefaultGUI();
	}
	if(dirCallback) {
		dirCallback(this, path, context);
	}
}
  bindDefaultGUI() {
	this.bindListSorting();
	this.bindDirMotion();
	this.bindFileSelection();	
  }

  bindListSorting() {
	let that = this;
	$('.nameh').click(e=>{that.setSortFunction(0)});
	$('.sizeh').click(e=>{that.setSortFunction(1)});
	$('.dateh').click(e=>{that.setSortFunction(2)});
  }

  bindDirMotion() {
	let that = this;
	$('.direntry').click(e=>{
		let fn = e.target.parentElement.outerText;
		that.dir(fn);
	});
  }

  bindFileSelection() {
	let that = this;
	let fileSelCB = this.params.fileSelected;

	$('.fileentry').click(e=>{
		let fn = e.target.parentElement.outerText;
		let fullPath = that.fullPathFor(fn);
		if (fileSelCB) {
			fileSelCB(that, fullPath, e, that.params);
		}
	});
  }

  fullPathFor(name) {
  	if (this.currentPath === '/') return '/' + name;
	return this.currentPath + '/' + name;
  }


// Be careful if you rearrange the order of items, as the following code assumes
// the checkbox to be immediately to the left of the file name item.
  getCheckedList(prepend)
{
	if(prepend === undefined) prepend = "";
	var boxList = $('.aBox:checked');
	var checkList = [];
	for (var i = 0; i < boxList.length; ++i) {
		let cb = boxList[i];
		let fnameElem =  cb.parentElement.nextSibling.firstChild;
		let ntfname = prepend + fnameElem.textContent;
		checkList.push(ntfname);
	}
	return checkList;
}

  getCheckedSet() {
	return new Set(this.getCheckedList());
}


  rename(file)
{
	var path = window.prompt(""+file+"\nMove (or rename) this file/directory to have the following full pathname:", file);
	let that = this;
	if(path)
	{
		path = path.replace(/ /g , "|" ) ;
		file = file.replace(/ /g , "|" ) ;
		this.fs.rename(path, file, function (status) {
			that.upload_after();
		});
	}
}

  renameFile() {
	let boxPath = this.currentPath;
	if (boxPath !== '/') boxPath += '/';
	var boxList = this.getCheckedList(boxPath);
	if (boxList.length === 0) {
		alert("Please select a file to rename or move using the checkbox");
		return;
	}
	if (boxList.length !== 1) {
		alert("More than one file is checked. We will only rename or move the first one");
	}
	this.rename(boxList[0]);
}

  opensp(file,conf)
{
	// Open editor based on file type:
	var ext = file.split('.').pop().toLowerCase();
	if (ext === 'xml') {
		window.open("/DR/xmlView/viewXML.htm?"+file);
	} else {
		window.open(file);	
	}
}

  openedit(file)
{
	// Open editor based on file type:
	var ext = file.split('.').pop().toLowerCase();
	if (ext === 'wav') {
		window.open("/DR/waverly/viewWAV.htm?"+file);
	} else if (editWhiteListSet.has(ext)) {
		window.open("/DR/edit.htm?"+file);
	}
}

  openspx(file) {
	window.open("/DR/xmlView/viewXML.htm?"+file);
// 	window.open("/DR/xmlEd/editXML.htm?"+file);
}


//Making Path
  makePath(dir) {
	var arrPath = this.currentPath.split('/');
	if (this.currentPath === "/" ) {
		arrPath.pop();
	}
	if ( dir === ".." ) {
		// Go to parent directory. Remove last fragment.
		arrPath.pop();
	} else if ( dir !== "" && dir !== "." ) {
		// Go to child directory. Append dir to the current path.
		arrPath.push(dir);
	}
	if ( arrPath.length === 1 ) {
		arrPath.push("");
	}
	return arrPath.join("/");
  }

  doesFileExist(path, callback) {
  	this.fs.exists(path, callback);
  }


// Get file list
  getFileList(nextPath) { //dir

	let recheckSet = new Set();
	if (nextPath === this.currentPath) {
		recheckSet = new Set(this.getCheckedList());
	}
	let that = this;
	that.fs.dir(nextPath, function (dirList, status) {
		that.currentPath = nextPath;
		that.filelist = dirList;
		that.filelist.sort(that.sortFunction);
		that.showFileList(that.currentPath, recheckSet);
	});
}

//Document Ready
  start(where) {
	// Iniialize global variables.
	this.currentPath = where;
	this.last_dirpath = this.currentPath
	$("#header").html("<a href='"+ this.currentPath+"'>"+ this.currentPath+"</a>");
	
	this.filelist = new Array();
	// Show the root directory.
	this.getFileList(this.makePath(''));
	let that = this;

	$('#newdirbut').click(e=>{that.NewDirectory()});
	$('#deletebut').click(e=>{that.deleteFiles()});
	$('#renamebut').click(e=>{that.renameFile()});
	$('#reloadbut').click(e=>{that.reload_list()});
}

  dir(fname)
{
	var dirpath = this.makePath(fname);
	$("#header").html("<a href='"+dirpath+"'>"+dirpath+"</a>");

	var row = $("<tr></tr>");
	$("#filetable tr").remove();
	row.append(
		$("<td></td>").append($("<span>Loading...</span>")).addClass("table_name")
	);
	$("#filetable").append(row);

	this.getFileList(dirpath);
	this.last_dirpath = dirpath;
}

//Callback Function for Polling

// During long uploads, polling requests were stacking up behind the upload
// We add an active flag. The flag prevents new requests from going
// out while one is active.
  polling() {
	if(this.polling_active) {
		return;
	}
	this.polling_active = true;
	let that = this;
	var url="/command.cgi?op=102";
	$.get(url).done(function(data, textStatus, jqXHR){
		that.polling_active = false;
		let hasUpd = Number(data);
		if(hasUpd) {
			that.getFileList(that.last_dirpath);
			$("#reloadtime").html = ("<font color=red>"+(new Date()).toLocaleString())+"</font>";
		}else{
			$("#reloadtime").html = ((new Date()).toLocaleString());
		}
	}).fail(function(jqXHR, textStatus, errorThrown){
		that.polling_active = false;
		$("#reloadtime").html("<font color=red>Error:"+textStatus+"</font>");
	});
}

  reload_list()
{
	this.getFileList(this.last_dirpath);
	$("#reloadtime").html = ("<font color=blue>"+(new Date()).toLocaleString())+"</font>";
}

  upload(t)
{
	let that = this;
	setTimeout(()=>{that.upload_after()}, t ? t : 3000);
	return true;
}

  upload_after()
{
	this.getFileList(this.last_dirpath);
	$("#reloadtime").html = ("<font color=blue>"+(new Date()).toLocaleString())+"</font>";
}


  NewDirectory() {
	var path = window.prompt("Directory name?\n"+ this.last_dirpath, "NewDirectory01");
	if(path)
	{
		var url = "";
		if(this.last_dirpath != "/")
		{
			url = this.last_dirpath+"/"+path;
		}else{
			url = "/"+path;
		}
		let that = this;
		this.fs.mkdir(url, function(status) {
			alert("NewDirectory: "+path);
			that.upload_after();
		});
	}
  }

}; // End of class

export {FileWidget, makeDateTime};
