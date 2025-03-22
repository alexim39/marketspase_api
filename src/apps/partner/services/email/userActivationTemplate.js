export const userAccountActivationEmailTemplate = (partner) => {
  const year = new Date().getFullYear();
  const formattedName = partner.name ? partner.name.charAt(0).toUpperCase() + partner.name.slice(1).toLowerCase()  : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
        <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">
          MarketSpase
        </span>
      </header>

      <main style="padding: 20px;">
        <h6>Account Activation Request</h6>

        <p>Hi <strong>${formattedName}</strong>,</p>

        <p>
          Kindly, use below link to activate your account.
        </p>

        <br>
        <div style="text-align: center;">
          <a href="https://platform.marketspase.com/partners/activation/${partner._id}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">
            Activate Account
          </a>
        </div>

        <p>
          Let's build now to earn passively forever.
        </p>

        <p>
          Best regards,
          <br>
          Alex Imenwo
          <br>
          <strong>MarketSpase Team</strong>
        </p>
      </main>

      <br>
      <footer style="text-align: center; padding: 20px; background-color: #f4f4f4; ; margin-top: 20px;">

        <p>© ${year} MarketSpase. All rights reserved.</p>
        <div>
          Your online business for passive income
        </div>

      </footer>

    </div>
  `;
};