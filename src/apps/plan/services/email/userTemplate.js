export const userEmailTemplate = (userData) => { 
  
  const year = new Date().getFullYear();

  const formattedName = userData.name ? userData.name.split(' ') // Split the name into an array of words
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
  .join(' ') // Join the words back into a single string
: '';
  

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <header style="text-align: center; padding: 10px; background-color: #f4f4f4;">
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #050111;">MarketSpase</span>
    </header>

    <main style="padding: 20px;">

      <p>Hi ${formattedName},</p>

      <p>
        You Spase plan purchase is been completed successfully.
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
`}
