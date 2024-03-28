import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { StringDict } from "@azure/msal-common";

class AuthService {
    // private static msalClient: PublicClientApplication;
    msalClient: PublicClientApplication
    constructor(config: Configuration) {
        this.msalClient = new PublicClientApplication(config);
    }

    public async initialize() {
        await this.msalClient.initialize()
        await this.msalClient.handleRedirectPromise()
    }

    public  getCurrentUser() {
        return this.msalClient && this.msalClient.getActiveAccount();
    }

    public  getCurrentUserName() {
        const user = this.getCurrentUser();

        if (!user) return "";

        return user.name || user.username;
    }

    public  getCurrentUserEmail() {
        const user = this.getCurrentUser();

        // ADAL behavior returned undefined if not logged in, keeping that.
        if (!user) return undefined;

        return user.username;
    }

    public  getCurrentUserIdPlusTenant() {
        const user = this.getCurrentUser();

        return user && `${user.username}_${user.tenantId}`;
    }

    public  async login(claims?: StringDict) {
        await this.msalClient.handleRedirectPromise();
        this.msalClient
            .loginRedirect({
                scopes: ["openid"],
                extraQueryParameters: claims
            })
            .catch((err) => {
                this.msalClient.logoutRedirect();
            });
    }

    public  logOutAndClearLocalStorage() {
        // Clear local storage on logout.
        sessionStorage.clear();
        localStorage.clear();
        this.logOut();
    }

    public  logOut(location?: string) {
        this.msalClient.logoutRedirect({
            postLogoutRedirectUri: location
        });
    }

    public  isLoggedIn() {
        return !!this.getCurrentUser();
    }

    public  getAccessToken() {
        if (!this.msalClient) {
            return Promise.resolve(null);
        }

        return this.msalClient
            .acquireTokenSilent({ scopes: [process.env.AZURE_AD_CLIENT_ID + "/.default"] })
            .then((response) => {
                if (response && response.accessToken) {
                    return response.accessToken;
                }
                return null;
            })
            .catch((err) => {
                console.error("Error getting access token: " + JSON.stringify(err));
            });
    }
}

const config = {
    auth: {
        clientId: process.env.AZURE_AD_CLIENT_ID as string,
        authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage"
    }
  }
  async function initializeAuthService() {
    const authService = new AuthService(config);
    await authService.initialize();
    return authService;
}

// 导出一个Promise，它将解析为AuthService的实例
export const authServicePromise = initializeAuthService();

