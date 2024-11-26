const {default : mongoose} = require("mongoose");
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const Student = require("./models/students");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
});

mongoose.connect(MONGO_URI).then(()=> (
    console.log("DB Connection Successful.!")
));

app.post("/login", async (req,res) => {
    const {email, password} = req.body;

    try {
        const student = await Student.findOne({email}) ;
        if(student){
            const matches = bcrypt.compareSync(password, student.password);
            if(matches){
                jwt.sign({studentId: student._id, name:student.name, email}, JWT_SECRET, {}, (err,token)=>{
                    if (err) {
                        console.error("JWT Signing Error:", err);
                        return res.status(500).json({ message: "Internal server error" });
                    }
                    res.cookie('token', token, {sameSite:'none', secure:true, httpOnly:true}).status(201).json({
                        id: student._id,
                        name:student.name,
                        email
                    });
                });
            }
        }else{
            res.send("Wrong Email or Password")
        }
    } catch (error) {
        console.log("Error in LOGIN: ", error);
    }
});

app.post("/register", async (req,res) => {
    const {name, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hashSync(password, salt);
        const exists = await Student.findOne({
            $or: [{name}, {email}]
        });

        if(!exists){
            const doc = await Student.create({name, email, password:hashedPassword});
            jwt.sign({studentId: doc._id, name, email}, JWT_SECRET, {}, (err,token)=>{
                if (err) {
                    console.error("JWT Signing Error:", err);
                    return res.status(500).json({ message: "Internal server error" });
                }
                res.cookie('token', token, {sameSite:'none', secure:true, httpOnly:true}).status(201).json({
                    id: doc._id,
                    name,
                    email
                });
            });
        }else{
            res.send("One of value already Exists.");
        }

    } catch (error) {
        console.log("Error in registering: ", error);
    }
});
