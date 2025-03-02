export const ownerEmailTemplate = (surveyData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #0e0d17;">MarketSpase</span>
    </header>
    <main style="padding: 20px;">
      <h2>New MarketSpase Sign Up</h2>
      <p>A new sign up with named <strong>${surveyData.name.toUpperCase()} ${surveyData.surname.toUpperCase()}</strong> with email <strong>${surveyData.email}</strong> just signed up in MarketSpase</p>
      <p>You may need to follow up with the user via WhatsApp or phone call.</p>

      <h3>Full Contact Details</h3>

      <ul>
        <li><strong>Name: </strong> ${surveyData.name.toUpperCase()}</ol>
        <li><strong>Surname: </strong> ${surveyData.surname.toUpperCase()}</li>
        <li><strong>Email address: </strong> ${surveyData.email}</li>
      </ul>

      <br>
      <div style="text-align: center;">
        <a href="https://admin.marketspase.com/" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Go to Admin Platform</a>
      </div>
    </main>   
  </div>
`;