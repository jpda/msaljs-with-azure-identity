import React from 'react';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';

interface Props {
    // send in the msal PublicClientApplication object
    msalObj: PublicClientApplication;
}
interface State {
    displayName: string;
}

export class GraphView extends React.Component<Props, State> {
    state: State;
    msalObj: PublicClientApplication;

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = { displayName: "" }
        this.msalObj = props.msalObj;
    }

    async componentDidMount() {
        // make a call to graph with a token
        // check if msalObj has an account
        // move login to a button and the main page
        // if (!this.msalObj.getAllAccounts() || this.msalObj.getAllAccounts().length <= 0) {
        //     console.log("about to loginPopup");
        //     await this.msalObj.loginPopup({ scopes: ["https://graph.microsoft.com/User.Read"] });
        // }
        // if not, login

        // if so, get a graph token
        var displayName = "loading...";
        var result: AuthenticationResult;

        try {
            result = await this.msalObj.acquireTokenSilent({
                account: this.msalObj.getAllAccounts()[0],
                scopes: ["https://graph.microsoft.com/User.Read"]
            });
        } catch (e) {
            // todo: check exception error code for UI required
            console.error(e);
            result = await this.msalObj.acquireTokenPopup({ scopes: ["https://graph.microsoft.com/User.Read"] });
        }

        // call the graph
        var graphResponse = await fetch("https://graph.microsoft.com/beta/me?$select=displayName",
            {
                headers: new Headers({
                    "Authorization": "Bearer " + result.accessToken
                })
            }
        );
        var responseAsJson = await graphResponse.json();
        displayName = responseAsJson.displayName;
        // displayName = graphResponse
        //     .then(x => x.json())
        //     .then(x => {
        //         displayName = x.displayName;
        //     });


        this.setState({ displayName: displayName });
    }

    render() {
        return (
            <div>
                <h1>welcome {this.state.displayName}</h1>
            </div>
        )
    }
}