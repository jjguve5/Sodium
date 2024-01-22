const authHelper = new AuthHelper();
const navHelper = new NavigationHelper();
const commHelper = new CommunicationHelper();
const modalHandler = new ModalHandler();

window.addEventListener('load', async function() {
    if(!(await authHelper.isAdminLoggedIn())){
        navHelper.NavigateToAdminLogin();
        return;
    }

    let page = "home";
    if(commHelper.hasParam("page")){
        page = commHelper.GetParam("page");
    }

    await GoToPage(page);
});

async function GoToPage(page) {
    if (commHelper.hasParam("page") && commHelper.GetParam("page") == page && document.getElementById('main-page').innerHTML != "") return;

    document.getElementById('content').classList.add('hide');
    document.getElementById('loading').classList.remove('hide');

    const oldPageSidebar = document.getElementById('page-'+commHelper.GetParam("page"));
    const newPageSidebar = document.getElementById('page-'+page);

    if(oldPageSidebar){
        oldPageSidebar.classList.remove('link-active');
    }

    if(newPageSidebar){
        newPageSidebar.classList.add('link-active');
    }

    const pageContent = await commHelper.GetPage(page);
    
    
    // Remove scripts from the page content
    const parser = new DOMParser();
    const parsedContent = parser.parseFromString(pageContent, 'text/html');
    const scripts = parsedContent.querySelectorAll('script');
    const trackedScripts = [];
    scripts.forEach(script => {
        trackedScripts.push(script.src);
        script.remove();
    });

    // Set the modified content to the main-page element
    document.getElementById('main-page').innerHTML = parsedContent.body.innerHTML;

    // Add back the tracked scripts
    trackedScripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script;
        document.getElementById('main-page').appendChild(newScript);
    });

    //commHelper.ClearParams();
    commHelper.SetParam('page', page);

    document.getElementById('content').classList.remove('hide');
    document.getElementById('loading').classList.add('hide');
}

function defineIfNotExists(name, definition) {
    window[name] ??= definition;
}
