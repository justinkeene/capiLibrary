/**
 * Performs an api request to Canvas
 * 
 * @param {Object} obj an HTMLFetch parameters object including token, domain, method, url, and payload
 * @param {string} pagination stating if the request should seek more than one page of responses. Leave blank or False if you don't want pagination.
 * @return {Object} the data returned from the api request.
 */
function cApi(obj, pagination) {
    var domain;

    var token = obj.token

    //evalaute if a domain includes https://
    if(obj.domain.includes('https://') === true){
        domain = obj.domain
    }else{
        domain = 'https://' + obj.domain
    }
  
    var url = domain + obj.url;
    // console.log(url);

    var header = {"Authorization":"Bearer " + token};
    var options = {"headers": header};
    obj.headers=header;
    // obj.muteHttpExceptions=true;

    var response = [], fetch;
    if(obj.method.toLowerCase() === "get"){
        var payload = url;

        if(pagination){
            var page;

            do{
                var fetch = UrlFetchApp.fetch(payload, options);
                var headers = fetch.getAllHeaders();
                var hLink = headers.Link;

                JSON.parse(fetch).forEach(function(f){
                response.push(f);
                })
                // console.log(response.length);
                if(hLink && hLink.includes("next")){
                    hLink.replace(/</g,'').replace(/>/g,'').split(",").forEach(function(l){
                        if(l.includes("next")){
                        payload = l.split("; ")[0];
                        page = 'next';
                        }
                    });
                }else{
                    page = 'last'
                
                }
                
            }while(page === 'next');

        
        }else{ //no pagination
            fetch = UrlFetchApp.fetch(payload, options);
            fetch = JSON.parse(fetch);
            if(Array.isArray(fetch)){
                fetch.forEach(function(f){
                response.push(f);
                });
            }else{
                response=fetch;
            }
        }
    
    }else{ //not a GET request
        delete obj.url;
        if(url.search('sis_imports')===-1){
            obj.payload=JSON.stringify(obj.payload);
            obj.contentType = 'application/json';
        }
        
        fetch = UrlFetchApp.fetch(url,obj);
        try{
            response = JSON.parse(fetch);
        }catch(e){
            response = {status:'success!'}
        }
    }
    
    return response;
}
 
 


function testGet(){
    var obj = {
        token: '',
        method: "GET",
        domain: "pansophic.instructure.com",
        url: "/api/v1/accounts/1/users"
    }

    var apiCall = cApi(obj);
    console.log(apiCall);
    console.log(apiCall.length);

}