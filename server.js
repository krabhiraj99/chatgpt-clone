 const PORT = 8000;
 const express = require('express');
 const app = express();
 const cors = require('cors');
 app.use(express.json());
 app.use(cors());
 const fetch = require("node-fetch");


    app.post("/",(req,res) => {
        console.log("In post");
        res.send("In home page")
    })

 app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role:'user', content: req.body.messages}],
            max_tokens: 100
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        }
    }
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    }catch(error){
        console.error(error);
    }
 })

 app.listen(PORT,() => console.log(`Your server is running on PORT ${PORT}`));