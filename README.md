# ScribbleGPT: Building a Basic Handwriting-Driven Chatbot
<a href="https://medium.com/@memsranga/scribblegpt-building-a-basic-handwriting-driven-chatbot-62fee9a3d906"><img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*LbBkyH5-R9BLVUaKZcUMOQ.jpeg" alt="ScribbleGPT: Building a Basic Handwriting-Driven Chatbot" 
style="" ></a>

## Read entire blog - https://medium.com/@memsranga/scribblegpt-building-a-basic-handwriting-driven-chatbot-62fee9a3d906

## ⚠️ Disclaimer

**Do Not Deploy Publicly**

This project **should not** be used in a production environment. The environment variables `NEXT_PUBLIC_AZURE_OPENAI_API_KEY` and `NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT` are exposed publicly in the client-side code. Exposing sensitive API keys can lead to unauthorized access, misuse, and potential security vulnerabilities.

## Introduction

Welcome to the **ScribbleGPT: Building a Basic Handwriting-Driven Chatbot**! This project is a React-based application built with Next.js that allows users to write on a HTML canvas. The application captures the drawn strokes, processes them using Google's Handwriting API, and interacts with an AI bot to generate and display responses based on the recognized text.

## Features

- **Interactive Signature Pad:** Draw and capture handwritten input using a responsive canvas using [Signature_Pad](https://github.com/szimek/signature_pad) library
- **Stroke Processing:** Convert drawn strokes into text using [Google Input Tools](https://www.google.com/inputtools/)
- **AI Integration:** Interact with an OpenAI to process and respond to the recognized text
- **Fade-Out Effect:** Smoothly fades out the displayed text after a set duration

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js (v14 or later):** [Download Node.js](https://nodejs.org/)
- **npm (v6 or later):** Comes bundled with Node.js

You can verify the installations by running:

```bash
node -v
npm -v
```

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/memsranga/scribble-gpt.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd scribble-gpt
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

   This command installs all the necessary packages listed in the `package.json` file.

## Configuration

The project requires specific environment variables to function correctly, especially for integrating with Azure's OpenAI services.

1. **Create a `.env.local` File:**

   In the root directory of the project, create a file named `.env.local`.

2. **Add the Following Environment Variables:**

   ```env
   NEXT_PUBLIC_AZURE_OPENAI_API_KEY=your-azure-openai-api-key
   NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
   ```

   - **`NEXT_PUBLIC_AZURE_OPENAI_API_KEY`:** Your Azure OpenAI API key. This key is used to authenticate requests to Azure's OpenAI services.
   - **`NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT`:** The endpoint URL for Azure's OpenAI services.

   **Note:** Replace `your-azure-openai-api-key` and `your-azure-openai-endpoint` with your actual credentials. **Do not** commit this file to version control to keep your credentials secure.

3. **Example `.env.local` File:**

   ```env
   NEXT_PUBLIC_AZURE_OPENAI_API_KEY=12345abcde67890fghij
   NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT=https://your-openai-endpoint.azure.com/
   ```

## Running the Project

After completing the installation and configuration steps, you can start the development server.

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

2. **Access the Application:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

   The page will automatically reload if you make edits to the source code.

## Project Structure

Here's a brief overview of the project's structure:

```
scribble-gpt/
├── app/
|   ├── layout.js
|   ├── page.js
|   ├── bot.js
└── ...other configuration files...
```

- **`bot.js`**: Contains LLM initialization and invocation using LangChain.
- **`page.js`**: Entire scribbling page.

## Troubleshooting

If you encounter issues while running the project, consider the following steps:

1. **Ensure Environment Variables Are Set Correctly:**

   Double-check the `.env.local` file to ensure that the `NEXT_PUBLIC_AZURE_OPENAI_API_KEY` and `NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT` are correctly set.

2. **Check Node.js and npm Versions:**

   Ensure that you're using compatible versions of Node.js and npm. Running outdated versions can lead to unexpected errors.

3. **Install Dependencies Again:**

   Sometimes, reinstalling dependencies can resolve issues.

   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Review Console Logs:**

   Inspect the terminal and browser console for error messages. They often provide insights into what's going wrong.

5. **Seek Help:**

   If you're unable to resolve an issue, consider opening an issue on the project's GitHub repository or seeking assistance from the community.

---

**Happy Coding!** If you have any questions or feedback, feel free to reach out.

<a href="https://www.buymeacoffee.com/memsranga" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/arial-orange.png" alt="Buy Me A Coffee" style="width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
