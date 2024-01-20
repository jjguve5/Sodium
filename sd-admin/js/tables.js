defineIfNotExists('TablesHandler', class TablesHandler {
    constructor(){
        this.tablesDiv = document.getElementById("tables-list");
        this.tables = [];

        this.loadTables();
    }

    async loadTables(){
        const response = await commHelper.get(navHelper.GetUtilsUrl() + "backend/admin/tables/getTables.php", {});
        this.tables = response.tables;
        this.setTables();
    }

    setTables(){
        this.tablesDiv.innerHTML = "";
        this.tables.forEach((table, index) => {
            this.createTableItem(index, table.title);
        });
    }

    createTableItem(index, name){
        const tableItem = document.createElement('div');
        tableItem.classList.add('item');

        const itemTitle = document.createElement('div');
        itemTitle.classList.add('item-title');
        itemTitle.textContent = name;

        const itemButtons = document.createElement('div');
        itemButtons.classList.add('item-buttons');

        const buttons = ['view', 'edit', 'delete'];
        const icons = ['eye', 'pencil', 'trash'];
        const popOvers = ['View Data', 'Edit Structure', 'Delete Table'];
        const onClick = [this.viewTable, this.editTable, this.deleteTable];

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

        tableItem.appendChild(itemTitle);
        tableItem.appendChild(itemButtons);

        this.tablesDiv.appendChild(tableItem);
    }

    createTable(){
        //open empty modal
        modalHandler.openModal('add-table-modal')
        document.getElementById('table-name-input').value = "";
    }

    async forceCreateTable(){
        //TODO: safety checkings
        const tableName = document.getElementById('table-name-input').value;

        modalHandler.closeCurrentModal();
        
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/createTable.php", {tableName:tableName});
        if(!response.success){
            //TODO: ERROR PROMPT
        } else {
            this.tables.unshift(JSON.parse(response.table))
            this.setTables();
            //TODO: SUCCESS PROMPT
        }
    }

    viewTable(index){
        //view table data
    }

    editTable(index){
        //edit table structure
    }

    deleteTable(index){
        modalHandler.openModal("delete-table-modal");
        document.getElementById('forcedelete-table-button').onclick = ()=>{tablesHandler.forceDeleteTable(index)};
    }

    async forceDeleteTable(index){
        modalHandler.closeCurrentModal();
        
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/deleteTable.php", {tableName:tablesHandler.tables[index].title});
        if(!response.success){
            //TODO: ERROR PROMPT
        } else {
            this.tables.splice(index,1);
            this.setTables();
            //TODO: SUCCESS PROMPT
        }
    }
});

defineIfNotExists('tablesHandler', new TablesHandler());
tablesHandler.setTables();
