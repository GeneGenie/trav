var ajaxes = [], res= []
x.forEach(function(id,i){
    ajaxes.push($.get("http://www.beta.gotravspeed.com/village3.php?id="+id))
})
$.when.apply($,ajaxes).then(function(data){
    for(var i = 0 ; i < arguments.length; i++){
        var body  = $(arguments[i][0]);
        res.push({id:x[i],title:body.find('h1').text()})
    }
})





/////////
var center = {x:"0",y:"36"}

x.forEach(function(obj,i){
    obj.distance = Math.sqrt(Math.pow(parseInt(center.x)-parseInt(obj.x),2)+ Math.pow(parseInt(center.y)-parseInt(obj.y),2))
})