import mongoose from 'mongoose';


/* Schema*/
const contactSchema = mongoose.Schema(
    {
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
        email: {
            type: String,
            //unique: true,
            required: [true, "Please enter email address"]
        },
        subject: {
            type: String,
            //unique: true,
            required: [true, "Please enter subject"]
        },
        message: {
            type: String,
            //unique: true,
            required: [true, "Please enter message"]
        },
        status: {
            type: String,
            default: 'Open',
            //required: [true, "Please enter username"]
        },
        requestID: {
            type: String,
            default: 'Open',
            //required: [true, "Please enter username"]
        },
        
       
    },
    {
        timestamps: true
    }
)

/* Model */
export const ContactModel = mongoose.model('Contact', contactSchema);



/* guide download */
/* Schema*/
const guideDownloadSchema = mongoose.Schema(
    {
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
        email: {
            type: String,
            required: [true, "Please enter email address"]
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
        
       
    },
    {
        timestamps: true
    }
)

/* Model */
export const GuideDownloadModel = mongoose.model('Guide-download', guideDownloadSchema);