var http = require("http");
var fs = require("fs");

var html;

var ProductData=[
{
	"ProductName":"Oreo",
	"Price":"20",
	"Quantity":"100"
},
{
	"ProductName":"Ice cream",
	"Price":"40",
	"Quantity":"30"
},
{
	"ProductName":"Pen",
	"Price":30,
	"Quantity":100
},
{
	"ProductName":"Pencil",
	"Price":5,
	"Quantity":200
},
{
	"ProductName":"box",
	"Price":80,
	"Quantity":90
},
{
	"ProductName":"Bottle",
	"Price":"100",
	"Quantity":"20"
},
{
	"ProductName":"Brush",
	"Price":"100",
	"Quantity":"100"
}
]
var server = http.createServer((req,res)=>{
    if(req.method == "GET" && req.url=="/"){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write(html);
        res.end();
    }

    if(req.method == "GET" && req.url == "/getProdDetails"){
        res.writeHead(200,{"Content-Type":"applicaton/json"});
        fs.readFile("./data.json","utf-8",function(err,data){
            ProductData = JSON.parse(data);
            res.end(JSON.stringify(ProductData));
        });
        
    }

    if(req.method == "POST" && req.url == "/addProdDetails"){
        res.writeHead(200,{"Content-Type":"applicaton/json"});
        req.on("data",(chunk)=>{
            var obj = JSON.parse(chunk.toString());
            console.log(obj.ProductName);
            for(var i=0;i<ProductData.length;i++){
                console.log(ProductData[i].ProductName +" "+ obj.ProductName);
                if(ProductData[i].ProductName == obj.ProductName){
                    console.log("returned")
                    res.end(JSON.stringify({"error":"Duplicate Name Detected Kindly Update Existing Record"}))
                    return;
                }
            }
            ProductData.push(JSON.parse(chunk.toString()));
            fs.writeFile("./data.json",JSON.stringify(ProductData),function(err){
                if(err){
                    console.log(err);
                }
            })
            res.end(JSON.stringify(ProductData));
        })
        
    }

    if(req.method == "DELETE" && req.url.match("/deleteID/([a-z]+|[A-Z]+)")){
        res.writeHead(200,{"Content-Type":"applicaton/json"});
        var itemname = req.url.split("/")[2];
        var i;
        console.log(itemname);
        for(i=0;i<ProductData.length;i++){
            if(ProductData[i].ProductName ==itemname){
                break;
            }
        }
        
        if(i == ProductData.length){
            res.end(JSON.stringify({"error":"Item Not Found"}));
            return;
        }else{
            var item =  ProductData.splice(i,1);
            // res.write(JSON.stringify(item)+ " Deleted Successfully");
        }

        fs.writeFile("./data.json",JSON.stringify(ProductData),function(err){
            if(err){
                console.log(err);
            }
        })
        res.end(JSON.stringify(ProductData));
    }

    if(req.method == "PATCH" && req.url == "/update"){
        var updateData;
        req.on("data",(chunk)=>{
            updateData = JSON.parse(chunk);
            
            var searchText = updateData.ProductName;
            console.log(searchText);
            var i;
            for(i=0;i<ProductData.length;i++){
                if(ProductData[i].ProductName == searchText){
                    console.log("updating");
                    ProductData[i].Price = updateData.Price;
                    ProductData[i].Quantity = updateData.Quantity;
                    break;
                }
            }
            console.log(i +" "+ ProductData.length);
            if(i == ProductData.length){
                console.log("ENtered")
                res.end(JSON.stringify({"error":"Record Not Found"}))
                return;
            }
            fs.writeFile("./data.json",JSON.stringify(ProductData),function(err){
                if(err){
                    console.log(err);
                }
            })
            res.end(JSON.stringify(ProductData));
        })
       
        
    }

    if(req.method== "POST" && req.url =="/search"){
        var arr =[];
        
        req.on("data",(chunk)=>{
            searchData = JSON.parse(chunk.toString());
            searchData = searchData.ProductName;
            console.log(searchData)
            for(var i=0;i<ProductData.length;i++){
                if(ProductData[i].ProductName.startsWith(searchData)){
                    arr.push(ProductData[i].ProductName);
                }
            }
            res.end(JSON.stringify(arr));
        })
        
    }
})

server.listen(8087,()=>{
    console.log("Server Started");
    fs.readFile("./data.json","utf-8",function(err,data){
        ProductData = JSON.parse(data);
    });
    fs.readFile("./index.html",function(err,data){
        html = data;
    });
})