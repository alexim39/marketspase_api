import mongoose from 'mongoose';


/* Schema survey*/
const userSurveySchema = mongoose.Schema(
    {
    
        ageRange: {
            type: String,
            required: [true, "Please choose age range"]
        },
        socialMedia: { 
            type: [String], 
            required: [true, "Please choose social media channel"]

        },
        onlinePurchaseSchedule: {
            type: String,
            required: [true, "Please choose online purchase response"]
        },
        onlineBusinessTimeDedication: {
            type: String,
            required: [true, "Please choose hours of dedication"]
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "Please enter email address"]
        },
        name: {
            type: String,
            required: [true, "Please enter name"]
        },
        surname: {
            type: String,
            required: [true, "Please enter surname"]
        },
        userDevice: {
            type: String,
            //unique: true,
            //required: [true, "Please enter surname"]
        },
        referer: {
            type: String,
            default: 'system',
            //unique: true,
            required: [true, "Please enter username"]
        },
       
    },
    {
        timestamps: true
    }
)

/* Model */
export const ProspectSurveyModel = mongoose.model('Survey', userSurveySchema);