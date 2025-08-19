export const metadata = {
  title: "DS-160 App",
  description: "Asistente simple para DS-160",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, Arial, sans-serif', margin: 0 }}>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <a href="/" style={{ textDecoration: 'none', fontWeight: 700 }}>DS-160 App</a>
        </header>
        {children}
        <footer style={{ padding: '2rem', borderTop: '1px solid #eee', marginTop: '4rem', textAlign: 'center' }}>
          <small>Demo educativa · No somos parte del Gobierno de EE.UU.</small>
        </footer>
      </body>
    </html>
  );
}

