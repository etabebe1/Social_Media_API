const Conversation = require("../model/conversationModel");

// user opening new conversation
const openConversation = async (req, res) => {
  const { receiverID, senderID } = req.body;
  const newConversation = new Conversation({
    members: [senderID, receiverID],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(404).json(error);
  }
};

// get conversation of user
const getConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const userConversation = await Conversation.find({
      members: { $in: [id] },
    });
    res.status(200).send(userConversation);
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = {
  openConversation,
  getConversation,
};
