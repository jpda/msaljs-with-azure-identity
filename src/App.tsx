import React, { Component } from 'react';
import './App.css';
import { BlobView } from './components/blobView';
import { GraphView } from './components/GraphView';
import AuthService from './AuthService';

interface State { }

class App extends Component<any, State> {
  authService: AuthService;

  constructor(p: any, s: State) {
    super(p, s);
    this.setState({ userLoggedIn: false });

    var msalConfig = {
      config: {
        auth: {
          clientId: "01dd2ae0-4a39-43a6-b3e4-742d2bd41822",
          authority: "https://login.microsoftonline.com/98a34a88-7940-40e8-af71-913452037f31",
          redirectUri: "http://localhost:3000/"
        },
        cache: {
          // session storage is more secure, but prevents single-sign-on from working. other option is 'localStorage'
          cacheLocation: "sessionStorage"
        }
      }
    }
    this.authService = new AuthService(msalConfig);
  }

  async componentWillMount() {
    if (!this.authService.UserIsAuthenticated()) {
      await this.authService.login();
    }
  }

  render() {
    return (
      <div className="App">
        <GraphView authService={this.authService} />
        <BlobView authService={this.authService} />
      </div>
    );
  }
}
export default App;