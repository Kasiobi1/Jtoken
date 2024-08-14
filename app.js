require("dotenv").config()

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 8080


app.use(express.json())
app.use(express.static("public"))


    const posts = [
        {
            username: "zoro",
            rank : "first"
        },
        {
            username: "ussop",
            rank: "second"
        }
    ]

    function authenticateToken (req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]

        if(token == null) return res.sendStatus(401) // No token, access forbidden

        jwt.verify(token, process.env.ACESS_SECRET_TOKEN, (err, user) => { //verifying the token

            if(err) return res.sendStatus(403)  // Invalid token, expired vtoken access
        
            req.user = user;
            next() // Call next only after token is verified successfully
        })
    }

    app.get("/posts", authenticateToken, (req, res) => {
        res.json(posts.filter(post  => post.username === req.user.name))
    })


   




app.listen(port, console.log(`Listening at port: ${port}`))