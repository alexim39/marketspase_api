import {CampaignModel} from '../models/campaign.js';
import {PartnersModel,} from '../../partner/models/partner.model.js';
import {TransactionModel} from '../../transaction/models/transaction.model.js';


// facebook campaign/ads
export const createFacebookAd = async (req, res) => {
  const MIN_CHARGE = 1000; // Define the Facebook minimum charge amount  

  try {
    const { body } = req;

    // Find the partner by ID  
    const partner = await PartnersModel.findById(body.createdBy);
    if (!partner) {
      return res.status(400).json({
        message: 'Partner not found',
        data: null,
      });
    }

    if (body.isCard) {

      // Record the transaction  
      const transaction = new TransactionModel({
        partnerId: partner._id,
        amount: body.budget.budgetAmount,  // Use the budget amount as the charge
        status: 'Completed',
        paymentMethod: 'Facebook Ads',
        transactionType: 'Debit',
        reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
      });

      await transaction.save();


      // Create a new Ad document using the data from the request body
      const newAd = new CampaignModel(body);

      // Save the Ad document to the database
      await newAd.save();

      res.status(201).json({
        message: 'Ad campaign created successfully!',
        data: newAd,
        transaction: transaction
      });

    } else {

      // Check if the partner entered sufficient amount  
      if (body.budget.budgetAmount < MIN_CHARGE) {
        return res.status(402).json({
          message: 'Insufficient amount for transaction',
          data: null,
        });
      }

      // Check if the partner has sufficient balance for the budget amount
      if (partner.balance >= body.budget.budgetAmount) {
        // Deduct the budget amount from the partner's balance  
        partner.balance -= body.budget.budgetAmount;

        // Save the updated partner balance  
        await partner.save();

        // Record the transaction  
        const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'Facebook Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });

        await transaction.save();


        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);

        // Save the Ad document to the database
        await newAd.save();

        res.status(201).json({
          message: 'Ad campaign created successfully!',
          data: newAd,
          transaction: transaction
        });

      } else {
        return res.status(401).json({
          message: 'Insufficient balance for transaction',
          data: null,
        });
      }

    }



  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message
    });
  }
}


// google campaign
export const createGoogleAd = async (req, res) => {
  const MIN_CHARGE = 2000; // Define the Youtube minimum charge amount  

    try {

      const { body } = req; 

      // Find the partner by ID  
      const partner = await PartnersModel.findById(body.createdBy);
      if (!partner) {
        return res.status(400).json({
          message: 'Partner not found',
          data: null,
        });
      }

      if (body.isCard) {

        // Record the transaction  
        const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'Google Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });

        await transaction.save();

        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);

        // Save the Ad document to the database
        await newAd.save();

        res.status(201).json({
            message: 'Ad campaign created successfully!',
            data: newAd, // Include the saved Ad data in the response
            transaction: transaction
        });

      } else {

        // Check if the partner entered sufficient amount  
        if (body.budget.budgetAmount < MIN_CHARGE) {
          return res.status(402).json({
            message: 'Insufficient amount for transaction',
            data: null,
          });
        }

        // Check if the partner has sufficient balance for the budget amount
        if (partner.balance >= body.budget.budgetAmount) {
          // Deduct the budget amount from the partner's balance  
          partner.balance -= body.budget.budgetAmount;

          // Save the updated partner balance  
          await partner.save();

          // Record the transaction  
          const transaction = new TransactionModel({
            partnerId: partner._id,
            amount: body.budget.budgetAmount,  // Use the budget amount as the charge
            status: 'Completed',
            paymentMethod: 'Google Ads',
            transactionType: 'Debit',
            reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
          });

          await transaction.save();

          // Create a new Ad document using the data from the request body
          const newAd = new CampaignModel(body);

          // Save the Ad document to the database
          await newAd.save();

          res.status(201).json({
              message: 'Ad campaign created successfully!',
              data: newAd, // Include the saved Ad data in the response
              transaction: transaction
          });

        } else {
          return res.status(401).json({
            message: 'Insufficient balance for transaction',
            data: null,
          });
        }
        
      }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}


// youtube campaign
export const createYoutubeAd = async (req, res) => {
  const MIN_CHARGE = 2000; // Define the Youtube minimum charge amount  

    try {

      const { body } = req; 

      // Find the partner by ID  
      const partner = await PartnersModel.findById(body.createdBy);
      if (!partner) {
        return res.status(400).json({
          message: 'Partner not found',
          data: null,
        });
      }

      if (body.isCard) {

         // Record the transaction  
         const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'Youtube Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });

        await transaction.save();

        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);

        // Save the Ad document to the database
        await newAd.save();

        res.status(201).json({
            message: 'Ad campaign created successfully!',
            data: newAd, // Include the saved Ad data in the response
            transaction: transaction
        });

      } else {

        // Check if the partner entered sufficient amount  
        if (body.budget.budgetAmount < MIN_CHARGE) {
          return res.status(402).json({
            message: 'Insufficient amount for transaction',
            data: null,
          });
        }

        // Check if the partner has sufficient balance for the budget amount
        if (partner.balance >= body.budget.budgetAmount) {
          // Deduct the budget amount from the partner's balance  
          partner.balance -= body.budget.budgetAmount;

          // Save the updated partner balance  
          await partner.save();

          // Record the transaction  
          const transaction = new TransactionModel({
            partnerId: partner._id,
            amount: body.budget.budgetAmount,  // Use the budget amount as the charge
            status: 'Completed',
            paymentMethod: 'Youtube Ads',
            transactionType: 'Debit',
            reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
          });

          await transaction.save();

          // Create a new Ad document using the data from the request body
          const newAd = new CampaignModel(body);

          // Save the Ad document to the database
          await newAd.save();

          res.status(201).json({
              message: 'Ad campaign created successfully!',
              data: newAd, // Include the saved Ad data in the response
              transaction: transaction
          });

        } else {
          return res.status(401).json({
            message: 'Insufficient balance for transaction',
            data: null,
          });
        }

      }


    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}


// linkedin campaign
export const createLinkedinAd = async (req, res) => {
  const MIN_CHARGE = 2000; // Define the LinkedIn minimum charge amount  

    try {

      const { body } = req; 

        // Find the partner by ID  
      const partner = await PartnersModel.findById(body.createdBy);
      if (!partner) {
        return res.status(400).json({
          message: 'Partner not found',
          data: null,
        });
      }

      if (body.isCard) {

         // Record the transaction  
         const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'LinkedIn Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });
  
        await transaction.save();
  
        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);
  
        // Save the Ad document to the database
        await newAd.save();
  
        res.status(201).json({
            message: 'Ad campaign created successfully!',
            data: newAd, // Include the saved Ad data in the response
            transaction: transaction
        });

      } else {

         // Check if the partner entered sufficient amount  
        if (body.budget.budgetAmount < MIN_CHARGE) {
          return res.status(402).json({
            message: 'Insufficient amount for transaction',
            data: null,
          });
        }

        // Check if the partner has sufficient balance for the budget amount
        if (partner.balance >= body.budget.budgetAmount) {
          // Deduct the budget amount from the partner's balance  
          partner.balance -= body.budget.budgetAmount;
    
          // Save the updated partner balance  
          await partner.save();
    
          // Record the transaction  
          const transaction = new TransactionModel({
            partnerId: partner._id,
            amount: body.budget.budgetAmount,  // Use the budget amount as the charge
            status: 'Completed',
            paymentMethod: 'LinkedIn Ads',
            transactionType: 'Debit',
            reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
          });
    
          await transaction.save();
    
          // Create a new Ad document using the data from the request body
          const newAd = new CampaignModel(body);
    
          // Save the Ad document to the database
          await newAd.save();
    
          res.status(201).json({
              message: 'Ad campaign created successfully!',
              data: newAd, // Include the saved Ad data in the response
              transaction: transaction
          });
    
          } else {
            return res.status(401).json({
              message: 'Insufficient balance for transaction',
              data: null,
            });
          }

      }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}


// Tiktok campaign
export const createTiktokAd = async (req, res) => {
  const MIN_CHARGE = 1000; // Define the LinkedIn minimum charge amount  

    try {

      const { body } = req; 

        // Find the partner by ID  
      const partner = await PartnersModel.findById(body.createdBy);
      if (!partner) {
        return res.status(400).json({
          message: 'Partner not found',
          data: null,
        });
      }

      if (body.isCard) {

         // Record the transaction  
         const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'Tiktok Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });

        await transaction.save();

        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);

        // Save the Ad document to the database
        await newAd.save();

        res.status(201).json({
            message: 'Ad campaign created successfully!',
            data: newAd, // Include the saved Ad data in the response
            transaction: transaction
        });

      } else {
        
         // Check if the partner entered sufficient amount  
      if (body.budget.budgetAmount < MIN_CHARGE) {
        return res.status(402).json({
          message: 'Insufficient amount for transaction',
          data: null,
        });
      }

        // Check if the partner has sufficient balance for the budget amount
        if (partner.balance >= body.budget.budgetAmount) {
        // Deduct the budget amount from the partner's balance  
        partner.balance -= body.budget.budgetAmount;

        // Save the updated partner balance  
        await partner.save();

        // Record the transaction  
        const transaction = new TransactionModel({
          partnerId: partner._id,
          amount: body.budget.budgetAmount,  // Use the budget amount as the charge
          status: 'Completed',
          paymentMethod: 'Tiktok Ads',
          transactionType: 'Debit',
          reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
        });

        await transaction.save();

        // Create a new Ad document using the data from the request body
        const newAd = new CampaignModel(body);

        // Save the Ad document to the database
        await newAd.save();

        res.status(201).json({
            message: 'Ad campaign created successfully!',
            data: newAd, // Include the saved Ad data in the response
            transaction: transaction
        });

        } else {
          return res.status(401).json({
            message: 'Insufficient balance for transaction',
            data: null,
          });
        }
      }

     

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}


// Route handler to fetch all Ads by createdBy
export const getAds = async (req, res) => {
  try {
      const id = req.query.id;

      // Find Ads where createdBy matches the provided ID
      const ads = await CampaignModel.find({createdBy: id}); // Use an object to filter by createdBy

      res.status(200).json({
          message: 'Ads retrieved successfully!',
          data: ads,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({
          message: 'Error retrieving Ads',
          error: error.message,
      });
  }
};



// Get a single campaign 
export const getAd = async (req, res) => {
  try {
      //const { id } = req.params; // Assuming id is passed as a route parameter
      const id = req.query.id;

      // Find the campaign where _id matches the provided ID
      const campaign = await CampaignModel.findById(id);

      if (!campaign) {
          return res.status(404).json({
              message: 'Campaign not found',
          });
      }

      res.status(200).json({
          message: 'Campaign retrieved successfully!',
          data: campaign,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({
          message: 'Error retrieving the campaign',
          error: error.message,
      });
  }
};



// Controller Function (deleteAd)
export const deleteAd = async (req, res) => {
  try {
    const id = req.query.id;

      const ad = await CampaignModel.findById(id);

      if (!ad) {
          return res.status(404).json({ message: 'Ad not found' });
      }

      // Option 1: Soft delete (recommended)
      //ad.isActive = false;
      //await ad.save();

      // Option 2: Hard delete (if you really want to remove the document)
      await CampaignModel.findByIdAndDelete(id);

      res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting ad', error: error.message });
  }
};