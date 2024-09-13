import "./globals.css";


export const metadata = {
  title: "ScribbleGPT",
  description: "GPT inspired Tom Marvolo Riddle's diary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
