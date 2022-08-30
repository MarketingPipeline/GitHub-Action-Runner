/* CREATED BY GITUHB.COM/MARKETINGPIPELINE.COM */ 
/* IF SHARING THIS EXAMPLE IN ANY TYPE OF PUBLICATION ETC.
ATTRIBUTION & CREDIT ARE MORE THAN APPRECIATED BUT NOT REQUIRED!
*/ 



var GitHubResponse =  document.getElementById("api-response")

  
var error_message_section = document.getElementById("error-message");

var github_username  = document.getElementById("github_username");
 
var repo_name = document.getElementById("repo_name");



var InputSection =  document.getElementById("input-section")
function getRequest(url){
  fetch(url)
    .then(response => response.json())
    .then(data => {
    console.log(data)
   if (data.message){
     if (data.message.includes("Not Found")){
     throw("GitHub Repo Could Not Be Found")
     }
       
   }  
   if (data.workflows.length == 0){
   
     throw(`No workflows found for ${repo_name.value} try another repo with workflows!`)
     
       
   }else{
      var ActionList = "<br> <b><i>Your Workflows</i></b> <br> <br> <blockquote>Note: for workflow to <b>run</b> it must have a workflow-dispatch type</blockquote> <br> "
      for (const item in data.workflows){
        console.log(data.workflows[item].name)
        console.log(data.workflows[item].id)   
        
        // Add avaiable workflows to list to show in HTML document
        ActionList+= `<b>Workflow Name</b>: ${data.workflows[item].name}<br>`
        ActionList+= `<b>Workflow ID</b>: ${data.workflows[item].id}<br> <br>`
        
        /* 
        Collect Data To Send Dispatch using id like example - 
https://api.github.com/repos/USERNAME/REPO_NAME/actions/workflows/WORKFLOW_ID/dispatches" */
      }
    // Data Was Successfully Fetched - add a button to allow user to trigger event 
    GitHubResponse.innerHTML += ActionList;
    
    
    InputSection.innerHTML =   `
    <form id="deploy_form" action="javascript:void(0);" method="get" class="form-example">
  
    <label for="name">Enter Personal Access Token</label>
  <input class="form-control" type="text" id="person_access_token" required="required" />
  
  <label for="name">Workflow ID to Run</label>
  <input class="form-control" type="text" id="workflow_id" />

  


<button class="btn" id='deploy_btn'> Deploy</button></form>
<small>  <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token">How To Create Personal Token</a></small><br>`;
    
    AddWorkflowRunner();
    
      error_message_section.innerHTML =""
   }
    })
    .catch(error => {
     // console.log(error)
    
    error_message_section.innerHTML = "Error: " + error
    })
}



function makeGitHubrequest(url) {
  return getRequest(`https://api.github.com/repos/${github_username.value}/${repo_name.value}/actions/workflows`)
}




//// USED TO TRIGGER WORK FLOW

// Onclick Example

function AddWorkflowRunner(){
  
let btn = document.getElementById("deploy_form");


  
  
btn.addEventListener("submit", (event) => {
(async () => {
 
  let personal_access_key = document.getElementById("person_access_token").value;

let workflow_id = document.getElementById("workflow_id").value;
  
  console.log(personal_access_key)
  // put your REPO for issues here
  const rawResponse = await fetch("https://api.github.com/repos/MarketingPip/Blog_Post_Gen/actions/workflows/29901346/dispatches", {
      // ref is your branch name for workflow
  body: JSON.stringify({"ref":"main"}),
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `token ${personal_access_key}`
  },
  method: "POST"
}).then(function(response) {
    console.log(response)
   if (response.status ==204){
  for (var pair of response.headers.entries()) {
   console.log(pair[0]+ ': '+ pair[1]);
}
     console.log("Workflow is running")
     error_message_section.innerHTML = `<span style='color:green;'>Success</span>: Workflow is running: ${response.status}`
   }; 
    if (response.status ==401){
     console.log("Workflow is running")
     error_message_section.innerHTML = `<span style='color:red;'>Error</span>: Invalid Personal Key`
   } else {
       if (!response.ok) {
        console.log("Error: HTTP status " + response.status);
         error_message_section.innerHTML = `<span style='color:red;'>Error</span>: Invalid Personal Key ${response.status}`
    }
   }  
  
    return response.json();
});
  
  /// TODO - RETURN WORKFLOW RESULTS!
  const content = await rawResponse.json();

  console.log(content);
})();
});
}
