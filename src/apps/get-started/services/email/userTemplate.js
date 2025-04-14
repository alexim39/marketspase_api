export const userWelcomeEmailTemplate = (partner) => {

  const year = new Date().getFullYear();
  const formattedName = partner.name ? partner.name.charAt(0).toUpperCase() + partner.name.slice(1).toLowerCase()  : '';

  return  `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
       <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">
          <img src="https://marketspase.com/img/logo.png" alt="MarketSpase Logo" style="height: 50px;" />
        </span>
    </header>

    <main style="padding: 20px;">
      <h2>Welcome to MarketSpase - Your online business space for passive income</h2>

      <p>Hi ${formattedName},</p>

      <p>
        Thank you for signing up on our platform! We're thrilled to introduce you to a unique online business model for creating residual income.
      </p>

      <p>
        MarketSpase is a cutting-edge online business platform that enables individuals to establish and grow their own business in the internet ecosystem.
      </p>

      <p>
        Here's what makes MarketSpase special:
      </p>

      <ul>
        <ol><strong>Low Startup Cost: </strong> It has an affordable entry point for all level of entrepreneurs.</ol>
        <ol><strong>Global Reach: </strong> You own a business that operate worldwide, all from the comfort of your home.</ol>
        <ol><strong>Flexibility: </strong> Run the business on your own terms, anytime and anywhere.</ol>
        <ol><strong>Passive Income Potential: </strong> Build passive income streams that work for you 24/7.</ol>
      </ul>

      <p>
        When you join us, you become part of a community of like-minded individuals who are passionate about digital entrepreneurship. We are here to support you every step of the way, providing you with the tools and resources you need to succeed.
      </p>

      <p>
        If you have any questions, please visit our <a href="https://marketspase.com/faq" style="color: #050111;">FAQ page</a> for answers to some questions about our business or reach out to us at contacts@marketspase.com
      </p>

       <p>
          Let's build now to earn passively tomorrow.
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
      <footer style="text-align: center; padding: 20px; background-color: #f4f4f4; ; margin-top: 20px;">

        <p>© ${year} MarketSpase. All rights reserved.</p>
        <div>
          Your online business space for passive income
        </div>

      </footer>
  </div>
`
};
