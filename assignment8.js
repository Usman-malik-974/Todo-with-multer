const express=require('express');
const app=express();
const fs=require('fs');
const multer=require("multer");
const upload=multer({dest:"uploads/"});
app.use(function(req,res,next)
{
    console.log(req.method,req.url);
    next();
});
app.use(express.static("uploads"));
app.use(upload.single("file"));
app.use(express.json());
app.get("/",function(request,response){
    response.sendFile(__dirname+"/htmlcss/ass8.html");
});
app.get("/ass8.css",function(request,response){
    response.sendFile(__dirname+"/htmlcss/ass8.css");
});
app.get("/ass8script.js",function(request,response){
    response.sendFile(__dirname+"/ass8script.js");
});
app.get("/gettodos",function(request,response){
    const todo=request.body;
    gettodos(function(err,todos){
        if(err)
        {
            response.status(500);
            response.json({err:err});
        }
        else
        {
            response.status(200);
            response.json(todos);
        }
    });
});
app.post("/addtask",function(request,response){
     console.log(request.body);
     const data={
        task:request.body.task,
        status:"incomplete",
        file:request.file.filename,
     }
     savetodo(data,function(err){
        if(err)
        {
            response.status(500);
            response.json({err:err});
        }
        else
        {
            response.status(200);
            response.json(data);
        }
     })
});
app.put("/updatetodo",function(request,response){
    const todo=request.body;
    gettodos(function(err,todos){
        if(err)
        {
            response.status(500);
            response.json({err:err});
        }
        else
        {
            const updatedtodo=todos.filter(function(todoitem){
                {
                    if(todoitem.task===todo.text && todoitem.status==="incomplete"){
                        todoitem.status="completed";
                    }
                    else if(todoitem.task===todo.text && todoitem.status==="completed")
                    {
                        todoitem.status="incomplete";
                    }
                    return todoitem;
                }
            });
            fs.writeFile(__dirname+"/ass8data.txt",JSON.stringify(updatedtodo),function(err){
                if(err)
                {
                     response.status(500);
                     response.json({err:err});
                }
                else
                {
                    response.status(200);
                    response.send();
                }
            })
        }
    })
})
app.delete("/deletetodo",function(request,response){
    const todo=request.body;
    gettodos(function(err,todos){
        if(err)
        {
            response.status(500);
            response.json({err:err});
        }
        else
        {
            const filteredtodos=todos.filter(function(todoitem){
                return todo.text!==todoitem.task;
            })
            fs.writeFile(__dirname+"/ass8data.txt",JSON.stringify(filteredtodos),function(err)
            {
                if(err)
                {
                    response.status(500);
                    response.json({err:err});
                }
                else
                {
                    response.status(200);
                    response.send();
                }
            })
        }
    })
});

app.get("*",function(request,response){
    response.sendFile(__dirname+"/htmlcss/404.html");
})

app.listen(3000,function(){
    console.log("server running on port 3000");
});
function gettodos(callback){
    fs.readFile(__dirname+"/ass8data.txt","utf8",function(err,data){
        if(err)
        {
            callback(err);
        }
        else
        {
            if(data.length===0)
            {
                data="[]";
            }
            try{
                callback(null,JSON.parse(data));
            }
            catch{
                callback(null,[]);
            }
        }
    })
}
function savetodo(todo,callback)
{
    gettodos(function(err,todos){
        if(err)
        {
            callback(err);
        }
        else
        {
            todos.push(todo);
            fs.writeFile(__dirname+"/ass8data.txt",JSON.stringify(todos),function(err)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback();
                }
            })
        }
    })
}