class CommunicationHelper{
    constructor(){
        this.maxRetries = 5;
    }

    async fetch(url,method,body){
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if(!response.ok) return null;

            const jsonResponse = await response.json();
    
            return jsonResponse;
        } catch (error) {
            return null;
        }
    }

    async post(url,vars){
        for(let i=0;i<this.maxRetries;i++){
            const response = await this.fetch(url,"POST",JSON.stringify(vars));
            if(response) return response;
        }
    }

    async get(){
        for(let i=0;i<this.maxRetries;i++){
            const response = await this.fetch(url,"GET",JSON.stringify(vars));
            if(response) return response;
        }
    }

    async GetPage(page){
        try {
            const response = await fetch("pages/"+page+".html");

            if(!response.ok) return null;

            const textResponse = await response.text();
    
            return textResponse;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    hasParam(param){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.has(param)
    }

    GetParam(param){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param)
    }

    SetParam(param,value){
        const url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.pushState({ path: url.href }, '', url.href);
    }
}