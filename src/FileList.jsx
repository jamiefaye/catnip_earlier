import React from 'react';
//import ReactDOM from 'react-dom';


class FileListEntry  extends React.Component {
	constructor(props) {
		super(props);
		this.state = {selected: false};
	}
	render() {
		let item = this.props.entry;
		let name = item.fname;
		return <div>{name}</div>;
	}
}


// Props:
// filestore
// pathdir

class FileList extends React.Component {
  constructor(props) {
		super(props);
		this.state = {sortDir: 1, sortField: "name"};
	}

  render() {
	console.log("Render FileList");
	let lst = this.props.list;
		console.log("Groble");
		console.log(lst);
	return <table><tbody>
		{lst.map((val, inx)=>{
		console.log("kitten");
			return <tr><td><FileListEntry entry={val}/></td></tr>
		})}
		</tbody></table>;
	}
}

export {FileList};