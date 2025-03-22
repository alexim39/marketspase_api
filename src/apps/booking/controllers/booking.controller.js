import { BookingModel } from "../models/booking.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userNotificationEmailTemplate } from "../services/email/userTemplate.js";

// User survey form
export const bookingForm = async (req, res) => {
  try {
    //console.log('sent==',req.body);

    const userBooking = await BookingModel.create({
      description: req.body.description,
      consultDate: req.body.consultDate,
      consultTime: req.body.consultTime,
      contactMethod: req.body.contactMethod,
      referral: req.body.referral,
      phone: req.body.phone,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      userDevice: req.body.userDevice,
      username: req.body.username,
    });

    // Send email to owner
    const ownerSubject = "MarketSpase Session Booking";
    const ownerMessage = ownerEmailTemplate(userBooking);
    const ownerEmails = ["ago.fnc@gmail.com"];
    for (const email of ownerEmails) {
      await sendEmail(email, ownerSubject, ownerMessage);
    }

    // Send email to the user
    const userSubject = "Your Session is Confirmed – Let’s Meet in the space!";
    const userMessage = userNotificationEmailTemplate(userBooking);
    await sendEmail(userBooking.email, userSubject, userMessage);

    res.status(200).json(userBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};
