export const ownerEmailTemplate = (userData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #0e0d17;">MarketSpase</span>
    </header>
    <main style="padding: 20px;">
      <h1>MarketSpase Contact Request</h1>
      <p>A new user with named <strong>${userData.name.toUpperCase()} ${userData.surname.toUpperCase()}</strong> and email <strong>${userData.email}</strong> just sent a contact request in MarketSpase</p>
      <p>You will need to follow up with the user via email at once.</p>

      <h3>Message Details</h3>

      <ul>
        <li><strong>Subject: </strong> ${userData.subject}</ol>
        <li><strong>Messsage: </strong> ${userData.message}</li>
      </ul>

      <br>
      <div style="text-align: center;">
        <a href="https://admin.marketspase.com/" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Go to Admin Platform</a>
      </div>
    </main>  
    <br>
  </div>
`;