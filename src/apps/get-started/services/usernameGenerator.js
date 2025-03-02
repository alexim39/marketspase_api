import { PartnersModel } from "../../../apps/partner/models/partner.model.js";


/** 
 * Generate a unique username for prospect when sign in up into the system
 * This username is used by prospectSignUpFormHandler
 */
export const generateUniqueUsername = async (name, surname) => {
    if (!name || !surname) {
      throw new Error("Name and surname are required to generate a username");
    }
  
    const baseUsername = (name.charAt(0) + surname).toLowerCase();
    let candidateUsername = baseUsername;
    let counter = 1;
  
    while (true) {
      const existingUser = await PartnersModel.findOne({ username: candidateUsername }).exec();
      if (!existingUser) return candidateUsername;
      candidateUsername = `${baseUsername}${counter++}`;
    }
  };
  