import { PublicClientApplication, AccountInfo, AuthenticationResult } from "@azure/msal-browser";

interface AuthServiceConfiguration {
    config: {
        auth: {
            clientId: string,
            authority: string,
            redirectUri: string
        },
        cache: {
            cacheLocation: any
        }
    }
}

export default class AuthService {
    authConfig: AuthServiceConfiguration;
    msalObj: PublicClientApplication;
    user: AccountInfo | null;

    private authInProgress: boolean;

    constructor(config: AuthServiceConfiguration) {
        this.authConfig = config;
        this.user = null;
        this.msalObj = new PublicClientApplication(this.authConfig.config);
        this.authInProgress = false;
    }

    public requiresInteraction(errorCode: string): boolean {
        console.error(errorCode);
        if (!errorCode || !errorCode.length) {
            return false;
        }
        //todo: check that these are still the correct ones
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
    }

    public async login(): Promise<AccountInfo | null> {
        this.authInProgress = true;

        try {
            await this.msalObj.loginPopup();
            var user = this.msalObj.getAllAccounts()[0];
            this.authInProgress = false;
            if (user) {
                this.user = user;
                return user;
            } else {
                return null;
            }
        } catch (error) {
            this.authInProgress = false;
            console.log(error);
            return null;
        }
    }

    public UserIsAuthenticated() : boolean {
        return !this.msalObj.getAllAccounts() || this.msalObj.getAllAccounts().length <= 0;
    }

    public async acquireTokenForScope(_scopes: string | string[]): Promise<AuthenticationResult> {
        var scopes = Array.isArray(_scopes) ? _scopes : _scopes.split(' ');

        while (this.authInProgress) {
            await this.sleep(1000);
        }
        // at this point, authInProgress === false
        if (this.authInProgress) {
            throw "while finished, but authInProgress is still true";
        }

        this.authInProgress = true;
        var result: AuthenticationResult;
        try {
            // from cache
            result = await this.msalObj.acquireTokenSilent({
                // todo: get the correct account or error if > 1
                account: this.msalObj.getAllAccounts()[0],
                scopes: scopes
            });
        } catch (e) {
            // todo: check exception error code for UI required
            console.error(e);
            result = await this.msalObj.acquireTokenPopup({ scopes: scopes });
        }
        this.authInProgress = false;
        return result;
    }

    public logout() {
        this.msalObj.logout();
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms || 500));
    }
}