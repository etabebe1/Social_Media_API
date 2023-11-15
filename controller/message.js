const Message = require("../model/messageModel");

// send message controller
const sendMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(404).json(error);
  }
};

// get messages in the conversation
const getMessage = async (req, res) => {
  const { conversationID } = req.params;

  try {
    const messages = await Message.find({ conversationID: conversationID });
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
