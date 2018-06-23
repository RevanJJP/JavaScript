import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var url="http://localhost:8080"

class App extends Component {
  state = {files1:[], files2:[]}
  new_name ='';
  componentDidMount() {
    fetch('/files/dir1')
      .then(resp => resp.json())
      .then(files1 => this.setState({files1}));
    fetch('/files/dir2')
      .then(resp => resp.json())
      .then(files2 => this.setState({files2}));
  }
  
  copy(file) {
    fetch('/copy', {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: file
      })
    })
    window.location.reload();
  }
  delete(file) {
    fetch('/delete', {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: file
      })
    })
    window.location.reload();
  }
  rename(file) {
      fetch('/rename', {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: file,
        name: this.new_name
      })
    })
    window.location.reload();
  }

  handleChange(event) {
    this.new_name={title: event.target.value};
  }

  render() {
    console.log(this.state.files);
    //fetch('/rename');
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React File Manager</h1>
        </header>
        <h6>
          Folder 1:
          <ul>
            {this.state.files1.map(file => 
              <li> 
                {file.file} 
                <button onClick={(e) => this.copy(file.path)}> Kopiuj </button>
                <button onClick={(e) => this.delete(file.path)}> Usuń </button>
                <input type="text" id="new_name" placeholder="Nowa nazwa" value={this.state.title} onChange={this.handleChange.bind(this)}></input>
                <button onClick={(e) => this.rename(file.path)}> Zmień nazwę </button>
              </li>
              
            )}
          </ul>
          Folder 2:
          <ul>
          {this.state.files2.map(file => 
            <li> 
                {file.file} 
                <button onClick={(e) => this.copy(file.path)}> Kopiuj </button>
                <button onClick={(e) => this.delete(file.path)}> Usuń </button>
                <input type="text" id="new_name" placeholder="Nowa nazwa" value={this.state.title} onChange={this.handleChange.bind(this)}></input>
                <button onClick={(e) => this.rename(file.path)}> Zmień nazwę </button>
              </li>
           )}
          </ul>
        </h6>
      </div>
    );
  }
}

export default App;
