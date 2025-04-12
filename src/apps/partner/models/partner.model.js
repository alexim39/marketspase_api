import mongoose from 'mongoose';

/* Schema partners */
const partnersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter response for username'],
    },
    name: {
      type: String,
      required: [true, 'Please enter name'],
    },
    surname: {
      type: String,
      required: [true, 'Please enter surname'],
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please enter email address'],
    },
    phone: {
      type: String,
      //unique: true,
      //required: [true, "Please enter phone number"]
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
    },
    tnc: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
    },
    partnerOf: {
      type: String,
      required: [true, 'Please enter referer'],
    },
    dobDatePicker: {
      type: Date,
    },
    balance: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    educationBackground: {
      type: String,
    },
    hobby: {
      type: String,
    },
    skill: {
      type: String,
    },
    notification: {
      type: Boolean,
      default: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    incomeTarget: {
      targetAmount: {
        type: Number,
        default: 10000,
      },
      period: {
        type: String,
        default: 'monthly',
      },
    },
    resetToken: {
      // Add resetToken field
      type: String,
      default: undefined,
    },
    resetTokenExpiry: {
      // add resetTokenExpiry field
      type: Date,
      default: undefined,
    },
    socialMedia: {
      whatsappGroupLink: {
        type: String,
      },
      whatsappChatLink: {
        type: String,
      },
      facebookPage: {
        type: String,
      },
      linkedinPage: {
        type: String,
      },
      youtubePage: {
        type: String,
      },
      instagramPage: {
        type: String,
      },
      tiktokPage: {
        type: String,
      },
      twitterPage: {
        type: String,
      },
    },
    testimonial: {
      message: { 
        type: String, 
      },
      country: { 
        type: String,
        default: 'Nigeria'
     },
      state: { 
        type: String, 
      },
    },
    savedAccounts: [
      {
        bank: {
          type: String,
          required: true,
        },
        bankCode: {
          type: String,
          required: true,
        },
        accountNumber: {
          type: String,
          required: true,
        },
        accountName: {
          type: String,
          required: true,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

/* Model */
export const PartnersModel = mongoose.model('Partner', partnersSchema);