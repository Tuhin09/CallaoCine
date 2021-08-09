const Ticket = require("../models/Ticket.model");

const ticketGet = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate({
      path: "auditorium",
      populate: { path: "movie" },
    });
    if (tickets.length > 0) {
      return res.status(200).json(tickets);
    } else {
      const error = new Error("La collection tickets está vacía");
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const ticketPost = async (req, res, next) => {
  try {
    const { hasPaid, num, timeLeft, day, auditorium,seat } = req.body;

    const newTicket = new Ticket({
      hasPaid: hasPaid === "false" ? false : true,
      num,
      timeLeft,
      day: new Date(day),
      auditorium,
      seat //TODO:update reserved
    });

    console.log(newTicket);

    const createdTicket = await newTicket.save();
    return res.status(200).json(createdTicket);
  } catch (error) {
    next(error);
  }
};

const ticketPut = async (req, res, next) => {
  try {
    const { id, hasPaid, num, timeLeft, day, auditorium } = req.body;

    const update = {};

    //recuerda mandar un string en hasPaid
    if (hasPaid) update.hasPaid = hasPaid;
    if (num) update.num = num;
    if (timeLeft) update.timeLeft = Number(timeLeft);
    if (day) update.day = new Date(day);
    if (auditorium) update.auditorium = auditorium;

    const updateTicket = await Ticket.findByIdAndUpdate(
      id,
      update,
      { new: true } // Usando esta opción, conseguiremos el documento actualizado cuando se complete el update
    );
    return res.status(200).json(updateTicket);
  } catch (error) {
    const myError = new Error(
      "[Error] no se ha podido modificar los datos de ticket"
    );
    return next(myError);
  }
};

const ticketDelete = async (req, res, next) => {
  try {
    const { id } = req.body;
    const ticketDeleted = await Ticket.findByIdAndDelete(id); //TODO update seat

    if (!ticketDeleted) {
      return res.status(404).json("El elemento no existe");
    } else {
      return res.status(200).json(ticketDeleted);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ticketGet,
  ticketPost,
  ticketPut,
  ticketDelete,
};
