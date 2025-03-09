export const userEmailTemplate = (userData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">MarketSpase</span>
    </header>

    <main style="padding: 20px;">
      <h2>MarketSpase Spase Plan Confirmationr</h2>

      <p>Hi <strong>${userData.name.toUpperCase()}</strong>,</p>

      <p>
        You Spase plan purchase is been completed successfully.
      </p>


      <p>
        Let's create your digital space together!
      </p>

      <p>
      Best regards,
      <br>
      Alex Imenwo
      <br>
      <strong>MarketSpase Team</strong>
      </p>

      <div style="text-align: center;">
        <a href="https://platform.marketspase.com" style="padding: 10px 20px; background-color: #050111; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Login Now</a>
      </div>

    </main>
    <br>
    <br>
  </div>
`;
