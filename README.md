### Introduction

An API inteded to simulate DigitalOcean's Hacktoberfest Validation Check.

### Step to Use the API

- Make a POST Request to ```http://localhost:4000/hacktoberfest``` .
- Send your PAT(Personal Access Token) in Body.  Check this [link](https://github.com/settings/tokens) to get your PAT.
## Example 
### Request
![image](assets/Screenshot_20201116_154027.png)  

### Response
If completed,
`{ 
    success:true   
}`   
else `{ 
    success:false
}`   
