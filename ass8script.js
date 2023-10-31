const task=document.getElementById("task");
const addtolist=document.getElementById("addtolist");
const imgfile=document.getElementById("imgfile");
addtolist.addEventListener("click",function(){
    const todo=task.value.trim();
    var file = imgfile.files[0];
    if(todo && file){
        var formData = new FormData();
        formData.append('task',todo);
        formData.append('file',file);
        fetch('/addtask', {
            method: 'POST',
            body: formData,
        }).then(function (response) {
            if (response.status !== 200) {
                throw new Error("something went wrong");
            }
            return response.json();
        }).then(function(data){
            savetasktodom(data.task,data.status,data.file);
        })
    }
    else
    {
        alert("please enter fill all field above");
    }
})
gettodos();
function gettodos(){
    fetch("/gettodos")
    .then(function(response){
        if(response.status!==200)
        {
            throw new Error("something went wrong");
        }
        return response.json();
    })
    .then(function(todos){
        todos.forEach(function(todo){
            savetasktodom(todo.task,todo.status,todo.file);
        });
    })
    .catch(function(err){
        alert(err);
    })
}
function savetasktodom(data,status,file)
{
    const todolist=document.getElementById("todolist");
    const todoitem=document.createElement("p");
    const checkbox=document.createElement("input");
    const cross=document.createElement("span");
    const img=document.createElement("img");
    img.src=file;
    img.height=20;
    img.width=20;
    checkbox.className="rightfloat";
    cross.className="rightfloat";
    img.className="rightfloat";
    const hr=document.createElement("hr");
    cross.innerText="✖";
    cross.style.cursor="pointer";
    checkbox.type="checkbox";
    todoitem.innerText=data;
    if(status==="completed")
    {
        checkbox.checked=true;
        todoitem.style.textDecoration="line-through";
    }
    todolist.appendChild(todoitem);
    todoitem.appendChild(cross);
    todoitem.appendChild(checkbox);
    todoitem.appendChild(img);
    todoitem.appendChild(hr);
    checkbox.addEventListener("change",function(){
        if(checkbox.checked){
         updatetoserver(data,function(err){
            if(err)
            {
                alert(err);
            }
            else
            {
                todoitem.style.textDecoration="line-through";
            }
         })
        }
        else
        {
            updatetoserver(data,function(err)
            {
                if(err)
                {
                    alert(err);
                }
                else{
                    todoitem.style.textDecoration="none";
                }
            })
        }
    })
    cross.addEventListener("click",function(){
        deletetodo(data,function(err){
            if(err){
                alert(err);
            }
            else
            {
                todolist.removeChild(todoitem);
            }
        });
    })
}
function deletetodo(todo,callback)
{
    fetch("/deletetodo",{
        method:"DELETE",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({text:todo})
     })
     .then(function(response){
        if(response.status===200){
            callback();
        }
        else
        {
            callback("something went wrong");
        }
     })
}
function updatetoserver(todo,callback){
    fetch("/updatetodo",{
        method:"PUT",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({text:todo})
    })
    .then(function(response){
        if(response.status!==200)
        {
            callback("something went wrong");
        }
        else
        {
            callback();
        }
    })
}
