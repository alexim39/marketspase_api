import mongoose from 'mongoose';


/* Schema booking*/
const userBookingSchema = mongoose.Schema(
    {
    
        description: {
            type: String,
            //required: [true, "Please enter answer 2"]
        },
        consultDate: {
            type: Date,
            required: [true, "Please enter response for consultation date"]
        },
        consultTime: {
            type: String,
            required: [true, "Please enter response for consultation time"]
        },
        contactMethod: {
            type: String,
            required: [true, "Please enter response for contact method"]
        },
        referral: {
            type: String,
            required: [true, "Please enter response for referral"]
        },
        phone: {
            type: String,
            //unique: true,
            required: [true, "Please enter phone number"]
        },
        email: {
            type: String,
            //unique: true,
            //required: [true, "Please enter email address"]
        },
        name: {
            type: String,
            //unique: true,
            required: [true, "Please enter name"]
        },
        surname: {
            type: String,
            //unique: true,
            required: [true, "Please enter surname"]
        },
        userDevice: {
            type: String,
            //unique: true,
            //required: [true, "Please enter surname"]
        },
        username: {
            type: String,
            default: 'system',
            //required: [true, "Please enter username"]
        },
        status: {
            type: String,
            default: 'Scheduled',
            //required: [true, "Please enter username"]
        },
    },
    {
        timestamps: true
    }
)

/* Model */
export const BookingModel = mongoose.model('Booking', userBookingSchema);