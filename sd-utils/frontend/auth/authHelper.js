class AuthHelper{
    constructor(){

    }

    async isAdminLoggedIn(){
        return await commHelper.post(navHelper.GetUtilsUrl()+"backend/auth/isLoggedInAdmin.php",{});
    }
}