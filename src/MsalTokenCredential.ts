import { TokenCredential, GetTokenOptions, AccessToken } from '@azure/identity';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';

export class MsalTokenCredential implements TokenCredential {
    public tokenClient: PublicClientApplication;

    constructor(msalObj: PublicClientApplication) {
        this.tokenClient = msalObj;
    }

    async getToken(_scopes: string | string[], _options?: GetTokenOptions): Promise<AccessToken | null> {
        var scopes = Array.isArray(_scopes) ? _scopes : _scopes.split(' ');

        // if so, get a token
        var result: AuthenticationResult;
        try {
            // from cache
            result = await this.tokenClient.acquireTokenSilent({
                // todo: get the correct account or error if > 1
                account: this.tokenClient.getAllAccounts()[0],
                scopes: scopes
            });
        } catch (e) {
            // todo: check exception error code for UI required
            console.error(e);
            result = await this.tokenClient.acquireTokenPopup({ scopes: scopes });
        }

        return {
            token: result.accessToken,
            expiresOnTimestamp: result.expiresOn.getTime()
        };
    }
}