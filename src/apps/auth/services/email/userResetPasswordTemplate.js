export const userPasswordResetLinkEmailTemplate = (partner) => {
  const year = new Date().getFullYear();
  const formattedName = partner.name ? partner.name.split(' ') // Split the name into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' ') // Join the words back into a single string
  : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
        <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
              <g>
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.1-.22 2.14-.61 3.09l1.46 1.46C19.62 14.88 20 13.48 20 12c0-4.42-3.58-8-8-8zm-6.35.35L4.22 5.78C3.38 7.12 3 8.52 3 10c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.1.22-2.14.61-3.09L5.65 4.35z"/>
                  <text x="30" y="20" font-family="sans-serif" font-size="16" fill="black">MarketSpase</text>
              </g>
          </svg>

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