import { TokenCredential, GetTokenOptions, AccessToken } from '@azure/identity';
import { AuthenticationResult } from '@azure/msal-browser';
import AuthService from './AuthService';

export class MsalTokenCredential implements TokenCredential {
    public authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async getToken(_scopes: string | string[], _options?: GetTokenOptions): Promise<AccessToken | null> {
        var scopes = Array.isArray(_scopes) ? _scopes : _scopes.split(' ');

        var result: AuthenticationResult;
        try {
            result = await this.authService.acquireTokenForScope(scopes);
            return {
                token: result.accessToken,
                expiresOnTimestamp: result.expiresOn.getTime()
            };
        } catch (e) {
            console.error(e);
        }
        return null;
    }
}