import React from 'react';
import { AuthenticationResult } from '@azure/msal-browser';
import AuthService from '../AuthService';

interface Props {
    authService: AuthService;
}
interface State {
    displayName: string;
}

export class GraphView extends React.Component<Props, State> {
    state: State;
    authService: AuthService;

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = { displayName: "" }
        this.authService = props.authService;
    }

    async componentDidMount() {
        var displayName = "loading...";
        var result: AuthenticationResult;

        try {
            result = await this.authService.acquireTokenForScope(["https://graph.microsoft.com/User.Read"]);
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
        } catch (e) {
            // todo: check exception error code for UI required
            console.error(e);
            displayName = e;
        }
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