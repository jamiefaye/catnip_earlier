import React from 'react';
//import ReactDOM from 'react-dom';


class FileListEntry  extends React.Component {
  constructor(props) {
	super(props);
	this.state = {selected: false};
	this.handleClick = this.handleClick.bind(this);
  }
  render() {
	let item = this.props.entry;
	let name = item.fname;
	let me = this;
	return  <tr onClick={me.handleClick}><td>{name}</td></tr>;
  }
  handleClick(e) {
	console.log("clicked on " + this.props.entry.fname);
	this.props.clickOn(e, this.props.entry);
  }
}


// Props:
// filestore
// pathdir

class FileList extends React.Component {
  constructor(props) {
		super(props);
		this.state = {sortOrder: 1, sortField: "name", sortFunction:
		    function(a, b) {
			   if (!a["fname"]) return 0;
			   return a["fname"].localeCompare(b["fname"]);
		}};
		this.setSortFunction = this.setSortFunction.bind(this);
		this.clickOnFile = this.clickOnFile.bind(this);
	}

  setSortFunction(fieldName) {
  	this.setState((state, props)=>{
  	  let sortFun;
  	  let sortDir = state.sortField === fieldName ? -state.sortOrder : state.sortOrder;
  	  switch (fieldName) {
case 'name':
default:
	sortFun = function(a, b) {
			if (!a["fname"]) return 0;
			return a["fname"].localeCompare(b["fname"]) * sortDir;
		};
		break;
case 'date':
	sortFun = function(a, b) {
		if( a["fdate"] === b["fdate"] ) {
			return Math.sign(a["ftime"] - b["ftime"]) * sortDir;
	} 	else {
			return Math.sign(a["fdate"] - b["fdate"]) * sortDir;
		}
	};
	break;
case 'size':
	sortFun = function(a, b) {
		return Math.sign(a["fsize"] - b["fsize"]) * sortDir;
	};
	break;
	}  // End of switch

  	  return {
		sortOrder: sortDir,
		sortField: fieldName,
		sortFunction: sortFun
		}
	});
  }

  render() {
	let lst = [...this.props.list];
	lst.sort(this.state.sortFunction);
	let me = this;
	return <table><tbody>
		<tr onClick={e=>{me.setSortFunction('name')}}><th>Name</th></tr>
		<tr onClick={e=>{me.props.chDir('..')}}><td>..</td></tr>
		{lst.map((val, inx)=>{
			return<FileListEntry entry={val} key={val.fname} clickOn={me.clickOnFile}/>
		})}
		</tbody></table>;
	}
	
  clickOnFile(evt, item) {
	if (item.isDirectory) {
		this.props.chDir(item.fname);
	} else {
		this.props.launch(item);
	}
  }
}

export {FileList};