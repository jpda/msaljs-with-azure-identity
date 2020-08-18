import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BlobView } from './components/blobView';
import { GraphView } from './components/GraphView';
import { PublicClientApplication } from '@azure/msal-browser';

interface State {
  userLoggedIn: boolean;
}

class App extends Component<any, State> {
  msalObject: PublicClientApplication;

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
    this.msalObject = new PublicClientApplication(msalConfig.config);
  }

  async componentWillMount() {
    if (!this.msalObject.getAllAccounts() || this.msalObject.getAllAccounts().length <= 0) {
      console.log("about to loginPopup");
      await this.msalObject.loginPopup();
      this.setState({ userLoggedIn: true });
    } else {
      this.setState({ userLoggedIn: true });
    }
  }

  render() {
    if (this.state.userLoggedIn !== null && this.state.userLoggedIn) {
      return (
        <div className="App">
          <GraphView msalObj={this.msalObject} />
          <BlobView msalObj={this.msalObject} />
        </div>
      );
    }
  }
}
export default App;