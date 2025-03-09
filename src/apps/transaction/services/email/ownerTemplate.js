export const ownerEmailTemplate = (transaction) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">MarketSpase</span>
    </header>
    <main style="padding: 20px;">
      <h2>New MarketSpase Payment</h2>
      <p>A new Spase plan purchase was completed on MarketSpase</p>

      <h3>Plan Details</h3>

      <ul>
        <li><strong>Amount: </strong> ${transaction.amount}</ol>
        <li><strong>Status: </strong> ${transaction.status}</li>
        <li><strong>Message: </strong> ${transaction.message}</li>
      </ul>

      <br>
      <div style="text-align: center;">
        <a href="https://admin.marketspase.com/" style="padding: 10px 20px; background-color: #050111; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Go to Admin Platform</a>
      </div>
    </main>  
    <br>
    <br>
  </div>
`;