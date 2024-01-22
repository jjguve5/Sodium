// document.getElementById('editabletable').addEventListener('dblclick', function(e) {
//     var target = e.target;
    
//     // Ensure the double-clicked element is a 'td'
//     if (target.tagName === 'TD') {
//         // Save current text
//         var originalText = target.textContent;

//         // Create an input element
//         var input = document.createElement('input');
//         input.type = 'text';
//         input.value = originalText;
//         target.innerHTML = '';
//         input.classList.add("modal-input")
//         target.appendChild(input);

//         // Focus on the new input element
//         input.focus();

//         // Event to handle when user stops editing
//         input.addEventListener('blur', function() {
//             target.textContent = input.value;
//         });

//         // Optional: Save on Enter key
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 input.blur(); // This will trigger the 'blur' event
//             }
//         });
//     }
// });

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

    setData() {
        this.tableElement.innerHTML = "";
    
        // Create table header (th elements)
        const headerRow = document.createElement("tr");
        this.fields.forEach((field, index) => {
            const th = document.createElement("th");
            th.textContent = field.title;
            headerRow.appendChild(th);
        });
        this.tableElement.appendChild(headerRow);
    
        // Create table rows and cells (tr and td elements)
        this.rows.forEach((row, index) => {
            const tr = document.createElement("tr");
    
            // Create cells for each field in the row
            this.fields.forEach((field, index) => {
                const td = document.createElement("td");
                if(row[field.title].length>10){
                    td.textContent = row[field.title].substring(0, 10) + '...';
                } else {
                    td.textContent = row[field.title];
                }
                tr.appendChild(td);
            });
    
            this.tableElement.appendChild(tr);
        });
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
