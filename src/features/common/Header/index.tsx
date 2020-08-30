import Head from 'next/head';

export default function Layout() {
  return (
    <Head>
      <title>Plant-for-the-Planet</title>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <link
        crossOrigin=""
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      />

      {/* Make sure you put this AFTER Leaflet's CSS  */}
      <script
        crossOrigin=""
        src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
      ></script>
    </Head>
  );
}
