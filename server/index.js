const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const { Server } = require("socket.io");
const { db } = require("./firebase.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let otp;
let phoneNumbers;
let emailAddress;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "api",
    pass: process.env.NODEMAILER_PASSWORD
  }
});
//Send OTP via email
async function sendMail(email, otp) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "verification@demomailtrap.com", // sender address
    to: email, // list of receivers
    subject: "Your OTP to login", // Subject line
    text: "Hello world?", // plain text body
    html: `<strong>${otp}</strong>` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

//Send login to new added employee via email
async function sendMailLogin(email) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "verification@demomailtrap.com", // sender address
    to: email, // list of receivers
    subject: "You have just been added to our system!", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>Our admin have just created your account, <a href="http://localhost:3000/employee/login">click here</a> to login</p>` // html body
  });
}

//Login api for admin
app.post("/api/login", async (req, res) => {
  const { phoneNumber } = req.body;
  phoneNumbers = phoneNumber;

  try {
    // Check if user exists in Firestore
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("phone_number", "==", phoneNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "User not found", phoneNumber: phoneNumber });
    }

    // Generate OTP
    otp = generateOTP();

    // Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+19205520486",
      to: phoneNumber
    });

    res.json({ message: "OTP sent successfully", otp: otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Verify OTP and complete login
app.post("/api/verify", async (req, res) => {
  const { otpReq } = req.body;

  try {
    // Check OTP
    if (otpReq !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Query Firestore for user data
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("phone_number", "==", phoneNumbers)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Generate JWT
    const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET_KEY);

    // Send user data and token
    res.json({
      token,
      user: {
        id: userDoc.id,
        userData: userData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all employee data
app.get("/api/users/getAll", authenticateToken, async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//Add new employee
app.post("/api/users/add", authenticateToken, async (req, res) => {
  try {
    const { phone_number, name, email } = req.body;

    // Check if user with this phone number already exists
    const userSnapshot = await db
      .collection("users")
      .where("phone_number", "==", phone_number)
      .get();

    if (!userSnapshot.empty) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Create new user document
    const newUser = {
      name,
      email: email || null,
      phone_number,
      role: "employee"
    };

    // Add the new user to Firestore
    const docRef = await db.collection("users").add(newUser);

    const usersSnapshot = await db.collection("users").get();
    // Send OTP via email
    await sendMailLogin(newUser.email).catch(console.error);
    const updatedUser = [];

    usersSnapshot.forEach((doc) => {
      updatedUser.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error adding new user:", error);
    res.status(500).json({ error: "Failed to add new user" });
  }
});

app.put("/api/users/edit/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove id fields that shouldn't be updated directly
    delete updateData.id;

    // Validate input (add more validation as needed)
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid update data provided" });
    }

    // Get a reference to the user document
    const userRef = db.collection("users").doc(userId);

    // Check if the user exists
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user document
    await userRef.update({
      ...updateData
    });

    const usersSnapshot = await db.collection("users").get();
    const updatedUser = [];

    usersSnapshot.forEach((doc) => {
      updatedUser.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/delete/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get a reference to the user document
    const userRef = db.collection("users").doc(userId);

    // Check if the user exists
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user document
    await userRef.delete();
    const usersSnapshot = await db.collection("users").get();
    const updatedUser = [];

    usersSnapshot.forEach((doc) => {
      updatedUser.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//Login api for employee
app.post("/api/employee/login", async (req, res) => {
  const { email } = req.body;
  emailAddress = email;

  try {
    // Check if user exists in Firestore
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found", email: email });
    }

    // Generate OTP
    otp = generateOTP();

    // Send OTP via email
    sendMail(email, otp).catch(console.error);

    res.json({ message: "OTP sent successfully", otp: otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/employee/verify", async (req, res) => {
  const { otpReq } = req.body;

  try {
    // Check OTP
    if (otpReq !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Query Firestore for user data
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", emailAddress).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Generate JWT
    const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET_KEY);

    // Send user data and token
    res.json({
      token,
      user: {
        id: userDoc.id,
        userData: userData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
