export const ownerEmailTemplate = (surveyData) => {

  const year = new Date().getFullYear();
  const formattedName = surveyData.name ? surveyData.name.charAt(0).toUpperCase() + surveyData.name.slice(1).toLowerCase()  : '';

  return  `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
       <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">
          <img src="https://marketspase.com/img/logo.png" alt="MarketSpase Logo" style="height: 50px;" />
        </span>
    </header>

    <main style="padding: 20px;">
      <h2>New MarketSpase Sign Up</h2>
      <p>A new sign up with name ${formattedName} with email ${surveyData.email} just signed up on MarketSpase</p>
      <p>You may need to follow up with the user via WhatsApp or phone call.</p>

      <h3>Full Contact Details</h3>

      <ul>
        <li><strong>Name: </strong> ${surveyData.name.toUpperCase()}</ol>
        <li><strong>Surname: </strong> ${surveyData.surname.toUpperCase()}</li>
        <li><strong>Email address: </strong> ${surveyData.email}</li>
      </ul>

      <br>
      <div style="text-align: center;">
        <a href="https://admin.marketspase.com/" style="padding: 10px 20px; background-color: #050111; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Go to Admin Platform</a>
      </div>
    </main>  

    <br>
      <footer style="text-align: center; padding: 20px; background-color: #f4f4f4; ; margin-top: 20px;">

        <p>© ${year} MarketSpase. All rights reserved.</p>
        <div>
          Your online business space for passive income
        </div>

      </footer>
  </div>
`
};