const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

const getAllEvents = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");

  try {
    console.log("connected");
    const allEvents = await db.collection("events").find().toArray();
    res.status(200).json({ status: 200, data: allEvents });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, Message: "Nothing was found", Error: err });
  }

  client.close();
  console.log("disconenected!");
};

const getUserInformation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");
  const { userId } = req.params;

  try {
    const userFromDb = await db
      .collection("users")
      .find({ _id: userId })
      .toArray();

    res
      .status(200)
      .json({ status: 200, Messge: "User found!", data: userFromDb[0] });
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, Message: "No Information was found", Error: err });
  }
  client.close();
};

const getEventInformation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");
  const { eventId } = req.params;

  try {
    const eventFound = await db
      .collection("events")
      .find({ _id: eventId })
      .toArray();

    res
      .status(200)
      .json({ status: 200, message: "Event Found", data: eventFound[0] });
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, Message: "No Information was found", Error: err });
  }

  client.close();
};

const getEventInformationById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");
  const { _id } = req.params;

  try {
    const eventFound = await db
      .collection("events")
      .find({ _id: _id })
      .toArray();

    res
      .status(200)
      .json({ status: 200, message: "Event Found", data: eventFound[0] });
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, Message: "No Information was found", Error: err });
  }

  client.close();
};

const pushUserToDataBase = async (req, res) => {
  const { name, email } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");

  try {
    const emailInArray = await db
      .collection("users")
      .find({ email: email })
      .toArray();

    if (emailInArray === undefined || emailInArray.length < 1) {
      const newUser = { _id: uuidv4(), ...req.body };
      const postNewUser = await db.collection("users").insertOne(newUser);
      console.log(postNewUser);
      res
        .status(200)
        .json({ status: 200, Message: "New User Created!", data: newUser });
    } else if (emailInArray.length >= 1) {
      res.status(200).json({
        status: 200,
        Message: "User Already exists",
        data: emailInArray[0],
      });
    }
    console.log("emailInArray", emailInArray);
  } catch (err) {
    res.status(404).json({ Error: err, Message: "Error!" });
    console.log("I am the error");
  }

  client.close();
};

const joinEvent = async (req, res) => {
  const { name, email } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("workout4all");
  const { eventId, userId } = req.body;

  try {
    const alreadyJoined = await db
      .collection("events")
      .find({ _id: eventId, userIdsJoined: userId })
      .toArray();
    //not joined, will be added to db
    if (alreadyJoined.length <= 0) {
      //add user to event array
      const userJoined = await db
        .collection("events")
        .updateOne({ _id: eventId }, { $push: { userIdsJoined: userId } });
      //add event to user array
      const addEventToUserArray = await db
        .collection("users")
        .updateOne({ _id: userId }, { $push: { eventsJoined: eventId } });

      console.log("userJoined", userJoined);
      res.status(200).json({ status: 200, Message: `You Joined this event!` });
    }
    //already joined, will not be added to db
    else if (alreadyJoined.length >= 1) {
      res.status(400).json({
        status: 400,
        Message: "User Already Joined",
        userId: userId,
      });
    }

    console.log("alreadyJoined", alreadyJoined);
  } catch (err) {
    console.log(err);
  }

  client.close();
};

module.exports = {
  getAllEvents,
  pushUserToDataBase,
  getUserInformation,
  getEventInformation,
  getEventInformationById,
  joinEvent,
};
