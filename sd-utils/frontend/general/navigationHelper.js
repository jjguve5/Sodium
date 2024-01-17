class NavigationHelper {
    constructor(){
        this.rootURL = this.GetClearURL();
    }

    GetClearURL(){
        return document.currentScript.src.split("sd-admin/")[0].replace(window.origin,"");
    }

    GetRootUrl(){
        return this.rootURL;
    }

    GetUtilsUrl(){
        return this.rootURL + "sd-utils/"
    }

    GetAdminLoginURL(){
        return this.rootURL + "sd-admin/login.html"
    }

    NavigateToAdminLogin(){
        window.location.href = this.GetAdminLoginURL();
    }
}