# Dollar Dynamics

Welcome to **Dollar Dynamics**, a currency exchange analysis dashboard developed during a 24-hour hackathon. This project pushed us to our limits, and as a team, we can guarantee that every member has given their best to make this app a success.

## Team Members:
- **Aditya Kulkarni**
- **Anand Bhongale**
- **Aarya Kevadia**

**PS:** Unfortunately, **Aastha Konde** and **Aditya Bhandari** couldn't participate due to certain reasons.

## Description:
Dollar Dynamics is a powerful web application developed in **NEXT.js** using **TypeScript**, ensuring type safety and reliability. Our focus was on creating a modular and scalable system:

- We used **Tailwind CSS** for making the app responsive across devices.
- We implemented components like **CurrencyDropdown** to promote modular development and allow easy integration of new currencies.
- Data ingestion into the database was achieved by directly importing CSV files into **MongoDB** collections. We cleaned the data to handle null or missing values, combined the provided datasets, and scraped 2023 and 2024 datasets from the web.
- **MongoDB Atlas** was used to ensure seamless and consistent data usage globally.
- Real-time exchange rates were fetched using the **CurrencyLayer API**, making it easy to calculate accurate currency basket values.

## How to Use the Application:

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/your-repo/DollarDynamics.git
    ```

2. Navigate to the project folder:
    ```bash
    cd MITWPU-Team1-DollarDynamics
    ```

3. Install the required dependencies:
    ```bash
    npm i next
    ```

4. Open **VS Code** or your preferred IDE, and launch a new terminal.

5. Run the application in development mode:
    ```bash
    npm run dev
    ```

6. Once the server starts, click on the link displayed in the terminal (e.g., http://localhost:3000) to open the **Dollar Dynamics** dashboard.

7. Navigate through the app using its user-friendly UI to explore real-time exchange rates, currency baskets, and much more.

---

Thank you for exploring Dollar Dynamics. We hope you find it as exciting to use as we did to build!

