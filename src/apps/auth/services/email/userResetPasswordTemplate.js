export const userPasswordResetLinkEmailTemplate = (partner) => {
  const year = new Date().getFullYear();
  const formattedName = partner.name ? partner.name.charAt(0).toUpperCase() + partner.name.slice(1).toLowerCase()  : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
        <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">

          <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <g>
                <circle cx="30" cy="50" r="20" stroke="black" stroke-width="2" fill="none" />
                <path d="M 20 50 A 10 10 0 0 1 40 50" stroke="black" stroke-width="2" fill="none" />
                <path d="M 30 30 L 30 50 L 50 50" stroke="black" stroke-width="2" fill="none" />
                <text x="60" y="55" font-family="sans-serif" font-size="24" fill="black">MarketSpase</text>
            </g>
        </svg

        </span>
      </header>

      <main style="padding: 20px;">

        <p>Hi <strong>${formattedName}</strong>,</p>

        <p>
          Kindly, use below link to reset your password.
        </p>

        <br>
        <div style="text-align: center;">
          <a href="https://platform.marketspase.com/change-password?token=${partner.resetToken}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; text-align: center; margin: 1em 0;">
            Reset Password
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