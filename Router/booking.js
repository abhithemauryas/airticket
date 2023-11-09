const express = require("express");
const { bookingModel } = require("../Models/booking.model");
const bookingRouter = express.Router();
const { flightModel } = require("../Models/flight.model");
const { userModel } = require("../Models/user.model")
const { validator } = require("../Middlewares/loginvalidator");

bookingRouter.post("/api/booking", validator, async (req, res) => {
    try {
        let { arrival } = req.body;
        let userId = req.body.userId;
        let findFlight = await flightModel.find({ arrival });
        console.log(userId);
        if (findFlight) {
            console.log(findFlight);
            let flightid = findFlight[0]._id;
            console.log(flightid);
            flightid = flightid.toString()
            console.log("flightid", findFlight[0]._id);
            let bookedFlight =new bookingModel({ user: userId, flight: flightid });
            await bookedFlight.save();
            res.status(201).send({ "msg": "flight has been booked", bookedFlight })
        } else {
            res.status(409).send({ "msg": "flight is not available" })
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).send({ "msg": error })
    }
});
bookingRouter.get("/api/dashboard", async (req, res) => {
    try {
        let data = await bookingModel.find().populate("user").populate("flight")
        console.log(data);
        res.status(201).send(data)
    } catch (error) {
        console.log(error);
        res.send({"msg":error})
    }
})
module.exports = {
    bookingRouter
}
