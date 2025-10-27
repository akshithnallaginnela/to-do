import './globals.css';

export const metadata = {
  title: 'DSA To-Do App',
  description: 'A 4-hour DSA study planner and task tracker',
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
