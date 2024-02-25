const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { getReceiverSocketId } = require("../socket/socket");
const { io } = require("../socket/socket");

exports.sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    // req.user_id form middleware
    const senderId = req.user.id;

    // console.log(message)
    // console.log(senderId)
    // console.log(receiverId)

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    //  const newMessage = {
    //       senderId: senderId,
    //       receiverId: receiverId,
    //       message: message,
    //     };
    // await Message.create(newMessage)

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    //socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket id).emit() used to send events to specific clients
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: error });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user.id;

    // console.log(senderId)
    // console.log(userToChatId)

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);
    const message = conversation.messages;
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: error });
  }
};

exports.removeMessage = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id)
    if (!req.user.id) {
      return res.status(400).json("no token");
    }
    const message = await Message.findByIdAndDelete(Id);
    res.status(200).json({ message: "remove successfully" , remove: message });
  } catch (error) {
    console.log("Error in removeMessage", error);
  }
};
