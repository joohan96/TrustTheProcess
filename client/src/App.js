import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import config from './config.json';
import axios from 'axios';
import PieChart from './components/piechart';


class App extends Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      user: null,
      token: '',
      selectedfile: null
    };
  }

  logout = () => {
    this.setState({ isAuthenticated: false, token: '', user: null, selectedFile: null })
  };
  onFailure = (error) => {
    alert(error);
  };

  parsePDF = event => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)

    axios.post('http://localhost:3001/api/v1/parsepdf', data)
      .then(res => {
        console.log('response: ', res)
      })
  }

  onUploadHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  facebookResponse = (response) => {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default'
    };
    fetch('http://localhost:3001/api/v1/auth/facebook', options).then(r => {
      const token = r.headers.get('x-auth-token');
      r.json().then(user => {
        if (token) {
          this.setState({ isAuthenticated: true, user, token })
        }
      });
    })
  };

  render() {
    let content = !!this.state.isAuthenticated ?
      (
        <div>
          <p>Welcome to TrustTheProcess, {this.state.user.fullName} </p>
          <PieChart onRef={ref => (this.PieChart = ref)} />
          <div>
            <button onClick={this.logout} className="button">
              Log out
              </button>

            <button onClick={this.parsePDF} className="button">
              Upload and Process PDF
              </button>

            <input type="file" name="file" onChange={this.onUploadHandler} />
          </div>
        </div>
      ) :
      (
        <div>
          <FacebookLogin
            appId={config.FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.facebookResponse} />
        </div>
      );

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;