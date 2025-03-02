export const userWelcomeEmailTemplate = (surveyData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #0e0d17;">MarketSpase</span>
    </header>

    <main style="padding: 20px;">
      <h2>Welcome to MarketSpase - Your Online Business Partner</h2>

      <p>Hi <strong>${surveyData.name.toUpperCase()}</strong>,</p>

      <p>
        Thank you for signing up on our platform. We are excited to introduce you to a unique online business model for creating residual income.
      </p>

      <p>
        MarketSpase is a digital business platform that will enables you to start and grow your own online business by securing a space in the internet ecosystem.
      </p>

      <p>
        Here's what makes MarketSpase special:
      </p>

      <ul>
        <ol><strong>Low Startup Cost: </strong> It has an affordable entry point for all level of entrepreneurs.</ol>
        <ol><strong>Global Reach: </strong> You own a business that operate worldwide, all from the comfort of your home.</ol>
        <ol><strong>Flexibility: </strong> Work on your own terms, anytime and anywhere.</ol>
        <ol><strong>Passive Income Potential: </strong> Build residual income streams that work for you 24/7.</ol>
      </ul>

      <p>
        When you join us, you can buy a slice of internet space, which you can resell to earn a profit.
      </p>

      <p>
        If you have any questions, please visit our <a href="https://marketspase.com/faq" style="color:rgb(0, 29, 60);">FAQ page</a> for answers to some questions about our business or reach out to us at contacts@marketspase.com
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
        <a href="https://platform.marketspase.com" style="padding: 10px 20px; background-color: #28A745; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">Login Now</a>
      </div>

    </main>
  </div>
`;
