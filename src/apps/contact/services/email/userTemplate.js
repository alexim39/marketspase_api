export const userContactEmailTemplate = (userData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">MarketSpase</span>
    </header>

    <main style="padding: 20px;">
      <h2>MarketSpase Support Request - ${userData.requestID}</h2>

      <p>Hi <strong>${userData.name.toUpperCase()}</strong>,</p>

      <p>
        Thank you for reaching out to our support and an agent will respond to you shortly. Your request has been submitted with request number ${userData.requestID}
      </p>

    </main>
    <br>
    <br>
  </div>
`;
