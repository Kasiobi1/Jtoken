require("dotenv").config()

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.POET || 8080


app.use(express.json())
app.use(express.static("public"))

let refreshTokens = []

function generateAcessToken(user) {
    return jwt.sign(user, process.env.ACESS_SECRET_TOKEN, {expiresIn: "20s"})
}

    app.post("/token", (req, res) => {
        const refreshToken = req.body.accessToken
        if(refreshToken == null) return res.sendStatus(401) 
        if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401)
        jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
                if(err) return res.sendStatus(403)
            const accessToken = generateAcessToken({name : user.name})
        res.json({accessToken : accessToken})
        })
    })


    app.post("/login", (req, res) => {
        //Authenticate
        const username = req.body.username

        console.log(req.body.username);
        const user = {name : username}

       const accessToken  = generateAcessToken(user)
       const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN)
       refreshToken.push(refreshTokens)
       res.json({ accessToken  : accessToken, refreshToken : refreshToken})

      // console.log("RefreshToken", refreshToken); // Debuuging to check if the refresh toke is working well
    })


  

app.listen(port, console.log(`Listening at port: ${port}`))

//console.log("RefreshToken", refreshToken);
