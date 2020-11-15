const axios=require("axios");

module.exports=async (userToken)=>{
    const headersConfig= { headers: { Authorization: `Bearer ${userToken}` } }
    const {
        data: { node_id }
      } = await axios.get("https://api.github.com/user",headersConfig);

    return node_id;
}