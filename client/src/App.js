import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {


  constructor(props) {
      super(props);
      this.state = {
      };
  }
  

  login() {
    // HTTPS might get blocked by CORS
     return fetch('http://127.0.0.1:3001/auth/facebook')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      // user profile from mongodb
    })
    .catch((error) => {
      console.error(error);
    });
  }
  

  render() {
    return (
      <div className="inner-container">
        <div className="header">
          Template
        </div>
        <div className="box">

          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="text"
              name="email"
              className="login-input"
              placeholder="Email"/>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"/>
          </div>

          <button
            type="button" onClick={  this.login }>Log In With Facebook
            </button>
        </div>
      </div>
    );
}

}

export default App;
