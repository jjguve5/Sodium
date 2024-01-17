defineIfNotExists('PagesHandler', class PagesHandler {
    constructor(){
        this.pageOptions = ["blank", "template"];
        this.currentPageOption = 0;

        this.pagesDiv = document.getElementById("pages-list");
        this.pages = [];

        this.loadPages();
    }

    async loadPages(){
        const response = await commHelper.get(navHelper.GetUtilsUrl() + "backend/admin/pages/getPages.php", {});
        this.pages = response.pages;
        this.sortPages();
        this.setPages();
    }

    sortPages(){
        this.pages.sort((a, b) => {
            const dateA = new Date(a.createdOn);
            const dateB = new Date(b.createdOn);
            return dateB - dateA;
        });
    }

    setPages(){
        this.pagesDiv.innerHTML = "";
        this.pages.forEach((page, index) => {
            this.createPageItem(index, page.title);
        });
    }

    createPageItem(index, name){
        const pageItem = document.createElement('div');
        pageItem.classList.add('item');

        const itemTitle = document.createElement('div');
        itemTitle.classList.add('item-title');
        itemTitle.textContent = name;

        const itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        const buttons = ['view', 'edit', 'settings', 'delete'];
        const icons = ['eye', 'pencil', 'gear', 'trash'];
        const popOvers = ['View Page', 'Edit Page', 'Page Settings', 'DeletePage'];
        const onClick = [this.viewPage, this.editPage, this.settingsPage, this.deletePage];

        buttons.forEach((buttonType,i) => {
            const button = document.createElement('div');
            button.classList.add('item-button', `button-${buttonType}`);
            button.setAttribute('data-tooltip', `${popOvers[i]}`);

            button.onclick = ()=>{onClick[i](index)};
            
            const icon = document.createElement('i');
            icon.classList.add(`fa-solid`, `fa-${icons[i]}`);
            
            button.appendChild(icon);
            itemButtons.appendChild(button);
        });

        pageItem.appendChild(itemTitle);
        pageItem.appendChild(itemButtons);

        this.pagesDiv.appendChild(pageItem);
    }

    viewPage(index){
        console.log("View page for page "+index+" clicked!");
        //open in new tab 
        window.open(navHelper.GetRootUrl()+pagesHandler.pages[index].pageURL, "_blank");
    }

    editPage(index){
        console.log("Edit page for page "+index+" clicked!");
    }

    settingsPage(index){
        console.log("Settings page for page "+index+" clicked!");
    }

    deletePage(index){
        modalHandler.openModal("delete-page-modal");
        document.getElementById('forcedelete-page-button').onclick = ()=>{pagesHandler.forceDeletePage(index)};
    }

    async forceDeletePage(index){
        modalHandler.closeCurrentModal();
        
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/pages/deletePage.php", {pageKey:pagesHandler.pages[index].key});
        if(!response.success){
            //TODO: ERROR PROMPT
        } else {
            this.pages.splice(index,1);
            this.setPages();
            //TODO: SUCCESS PROMPT
        }
    }
});

defineIfNotExists('pagesHandler', new PagesHandler());
pagesHandler.setPages();
