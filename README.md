# WhatsApp Personal Trainer Bot

This project is a **Personal Trainer Bot** that works on WhatsApp, capable of creating personalized workout plans and answering questions about weight training. It was developed with a focus on providing an interactive and practical experience for users who want to train at home, in the gym, or outdoors.

## 📋 Features

- **Personalized Workouts:** Based on the user's responses, the bot generates a customized workout plan, considering the location where the user trains (home, gym, or outdoors).
- **Support and Tips:** The bot can answer questions about weight training, offering tips and exercise guidance.
- **Message Rate Limiting:** Implementation of rate limiting to prevent abuse, with temporary blocking of users who exceed message limits.
- **User Blacklist:** Users who repeatedly violate policies can be added to a blacklist, preventing further interactions.
- **Local Authentication:** The bot uses local authentication to manage WhatsApp sessions.

## 🛠️ Technologies Used

- **Node.js**
- **whatsapp-web.js:** Library for integrating with WhatsApp Web.
- **axios:** For making HTTP requests to the server's API.
- **dotenv:** Environment variable management.
- **qrcode-terminal:** QR Code generation in the terminal for WhatsApp authentication.

## 🚀 How to Run the Project

### Prerequisites

- Node.js installed on your machine.
- GitHub account and created repository.
- Access to WhatsApp Web.

### Setup Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME

2. **Install Dependencies:**
    ```bash
     npm install
3. **Configure the .env:**
   - Create a .env file in the root of the project and configure the necessary variables:
   ```bash
    MESSAGE_LIMIT=20
    TIME_WINDOW=60000  # 60 * 1000 ms
    BLOCK_TIME=600000  # 10 * 60 * 1000 ms
    MAX_MESSAGE_LENGTH=500
    MAX_VIOLATIONS=3
    MAX_UNSUPPORTED_VIOLATIONS=2
    COMMON_PASSWORD=common_password
    BASE_URL=http://localhost:port

4. **Start the Bot:**
   ```bash
    node index.js

5. ** Implementing an API for Seamless AI Interaction **
   ```bash
    To fully leverage the capabilities of the AI model that has been developed, it is essential to create an **API** that facilitates seamless interaction with the AI. This API will act as the interface between the AI and external systems or applications, enabling efficient communication and data exchange.
    
    By implementing this API, the AI can be easily integrated into various platforms, such as **web or mobile applications**, and can be accessed by different users or services. This will ensure that the AI's functionalities are accessible in a structured and standardized way, allowing for scalable and consistent deployment across multiple environments.
    
    Furthermore, the API will handle **requests**, process **inputs**, and return **responses** from the AI, ensuring that the interaction is both reliable and efficient. This will also provide a layer of abstraction, making it easier to manage and update the AI without disrupting the systems that rely on it.
    
    In summary, developing an API to interact with the AI is a crucial step in operationalizing the AI model, allowing it to be effectively utilized in real-world applications.
