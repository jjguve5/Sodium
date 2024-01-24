defineIfNotExists('TableDataHandler', class TableDataHandler {
    constructor(){
        this.tableElement = document.getElementById("editabletable");
        this.fields = [];
        this.rows = [];

        this.loadData();
    }

    async loadData(){
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/getTableData.php", {tableName:commHelper.GetParam('table')});
        this.fields = response.fields;
        this.rows = response.data;
        this.setData();
    }

    setData(query) {
        this.tableElement.innerHTML = "";
    
        // Create table header (th elements)
        const headerRow = document.createElement("tr");
        this.fields.forEach((field, index) => {
            const th = document.createElement("th");
            th.textContent = field.title;
            headerRow.appendChild(th);
        });
        const thDel = document.createElement("th");
        thDel.textContent = "DELETE";
        headerRow.appendChild(thDel);
        this.tableElement.appendChild(headerRow);
    
        // Create table rows and cells (tr and td elements)
        this.rows.forEach((row, rowI) => {
            if (query && !this.rowMatchesQuery(row, query)) {
                return;
            }

            const tr = document.createElement("tr");
    
            // Create cells for each field in the row
            this.fields.forEach((field, colI) => {
                const td = document.createElement("td");
                td.textContent = row[field.title];
                td.onclick = () => {
                    td.contentEditable = true;
                    td.focus();
                    td.onblur = () => {
                        td.contentEditable = false;
                        tableDataHandler.setColumnRowValue(field.title,row["id"],td.innerText);
                    }
                    td.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            td.blur();
                        }
                    });
                }
                tr.appendChild(td);
            });

            //create cell for row deletion
            const tdDel = document.createElement("td");
            const buttonDel = document.createElement('div');
            buttonDel.classList.add('item-button', `button-delete`);
            buttonDel.setAttribute('data-tooltip', `Delete Row`);
            buttonDel.onclick = ()=>{tableDataHandler.deleteRow(row["id"]);};
            
            const iconDel = document.createElement('i');
            iconDel.classList.add(`fa-solid`, `fa-trash`);
            
            buttonDel.appendChild(iconDel);
            tdDel.appendChild(buttonDel);
            
            tr.appendChild(tdDel);
    
            this.tableElement.appendChild(tr);
        });
    }

    // Function to check if a row matches the query
    rowMatchesQuery(row, query) {
        for (const field of this.fields) {
            const fieldValue = String(row[field.title]).toLowerCase();
            if (fieldValue.includes(query.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    async setColumnRowValue(column,row,value){
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/updateTableValue.php", {table:commHelper.GetParam('table'),column:column,row:row,value:value});
    }

    async deleteRow(rowId){
        const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/deleteRow.php", {table:commHelper.GetParam('table'),row:rowId});
        if (response.success) {
            // Remove the deleted row from local data
            this.rows = this.rows.filter(row => row.id !== rowId);
    
            // Update the UI with the updated data
            this.setData();
            console.log('Row deleted successfully!');
        } else {
            console.error('Failed to delete row. Error:', response.error);
        }
    }

    addRow(){
        //open empty modal
        modalHandler.openModal('add-row-modal')
        //document.getElementById('table-name-input').value = "";
    }

    // async forceCreateTable(){
    //     //TODO: safety checkings
    //     const tableName = document.getElementById('table-name-input').value;

    //     modalHandler.closeCurrentModal();
        
    //     const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/createTable.php", {tableName:tableName});
    //     if(!response.success){
    //         //TODO: ERROR PROMPT
    //     } else {
    //         this.tables.unshift(JSON.parse(response.table))
    //         this.setTables();
    //         //TODO: SUCCESS PROMPT
    //     }
    // }

    // viewTable(index){
    //     //view table data
    //     GoToPage('tableData');
    //     commHelper.SetParam('table',tableDataHandler.tables[index].title)
    // }

    // editTable(index){
    //     //edit table structure
    // }

    // deleteTable(index){
    //     modalHandler.openModal("delete-table-modal");
    //     document.getElementById('forcedelete-table-button').onclick = ()=>{tableDataHandler.forceDeleteTable(index)};
    // }

    // async forceDeleteTable(index){
    //     modalHandler.closeCurrentModal();
        
    //     const response = await commHelper.post(navHelper.GetUtilsUrl() + "backend/admin/tables/deleteTable.php", {tableName:tableDataHandler.tables[index].title});
    //     if(!response.success){
    //         //TODO: ERROR PROMPT
    //     } else {
    //         this.tables.splice(index,1);
    //         this.setTables();
    //         //TODO: SUCCESS PROMPT
    //     }
    // }
});

defineIfNotExists('tableDataHandler', new TableDataHandler());
tableDataHandler.setData();
