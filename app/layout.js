export const metadata = {
  title: "Explore Movie",
  description: "Explore movie on each next tap"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
