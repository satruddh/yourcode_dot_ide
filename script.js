let editor;
let languages = document.querySelector("#languages")
let fntSize = document.querySelector("#fnt-size")
let runBtn = document.querySelector(".btn")
let output = document.querySelector(".output")

const PYTHON = "0"
const JS = 4
const C = 7
const CPP = 77
const JAVA = 8
let langID;
let codeID;
let interval;

const defaultCCode="#include<stdio.h>\nint main(){\n\t\n\treturn 0;\n}"
const defaultCppCode="#include<bits/stdc++.h>\nint main(){\n\t\n\treturn 0;\n}"
const defaultJavaCode="import java.util.*;\n//Other imports go here..\n//Do not change the class name\nclass Main{\n\tpublic static void main(String args[]){\n\t//Your code goes here...\n\t\n\t}\n}"

fntSize.addEventListener('change',changeFont)
languages.addEventListener('change',changeLanguage)
runBtn.addEventListener('click',executeCode)

window.addEventListener('load',function ()
{
    editor=ace.edit("editor")
    editor.session.setMode("ace/mode/c_cpp")
    langID=C;
    languages.value="c"
    editor.session.setUseWrapMode(true);
    editor.setValue(defaultCCode,1)
})
function changeLanguage()
{
    let lang = languages.value
    if(lang == 'c'){
        editor.session.setMode('ace/mode/c_cpp')
        editor.setValue(defaultCCode,1)
        langID=C 
    }
    else if (lang =='cpp'){
        editor.session.setMode('ace/mode/c_cpp')
        editor.setValue(defaultCppCode,1)
        langID=CPP
    }
    else if(lang=='java'){
        editor.session.setMode('ace/mode/java')
        editor.setValue(defaultJavaCode,1)
        langID=JAVA
    }
    else if(lang=='python'){
        editor.session.setMode('ace/mode/python')
        editor.setValue("#Your Code goes here...\n",1)
        langID=PYTHON
    }
    else{
        editor.session.setMode('ace/mode/javascript')
        editor.setValue("//Your Code goes here...\n",1)
        langID=JS
    }
    //console.log(langID)
}
function changeFont()
{
    let val = fntSize.value;
    document.getElementById('editor').style.fontSize = val;
}

function executeCode()
{
    let code = editor.getSession().getValue();
    output.innerHTML=""
    let lang = languages.value;
    let xhr = new XMLHttpRequest()
    xhr.open('POST','https://codequotient.com/api/executeCode',true)
    let obj= new Object()
    obj.code = code
    obj.langId=langID
    //console.log(obj);
    xhr.setRequestHeader('content-type','application/json')
    xhr.onprogress = function(){
        console.log("Sending...")
    }
    let response;
    xhr.addEventListener('load',function(){
        if(this.status === 200)
        {
            //console.log("Response Text ",this.responseText)
            response=JSON.parse(this.responseText)
            //console.log(response)
            if(response.hasOwnProperty('error'))
            {
                output.innerHTML = response.error
            }
            else{
                codeID=response.codeId
                console.log(codeID)
                interval = setTimeout(fetchOutput.bind(this),10000)
            }
        }
        else
            console.log("Some error occurred")
    })

    params = JSON.stringify(obj)
    console.log(params)
    xhr.send(params)
}

function fetchOutput()
{
    const xhr = new XMLHttpRequest()
    xhr.open('GET',`https://codequotient.com/api/codeResult/${codeID}`,true)
    xhr.onprogress = function(){
        console.log("Fetching...")
        output.innerHTML = "Compiling....."
    }
    xhr.send()
    xhr.addEventListener('load',function(){
        //output.innerHTML = this.responseText;
        let response = JSON.parse(this.responseText)
        response.data=JSON.parse(response.data)
        console.log(response)
        console.log(response.data.output)
        output.innerText = response.data.errors ? response.data.errors : response.data.output
    })
}
