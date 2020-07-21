import Head from 'next/head'

export default function Layout() {
    return (
      <Head>
        <title>Trillion Tree Campaign</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
       
       <link crossOrigin="" rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" />

     {/* Make sure you put this AFTER Leaflet's CSS  */}
 <script crossOrigin="" src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   ></script>




  <script src="https://unpkg.com/esri-leaflet@2.4.1/dist/esri-leaflet.js"
  integrity="sha512-xY2smLIHKirD03vHKDJ2u4pqeHA7OQZZ27EjtqmuhDguxiUvdsOuXMwkg16PQrm9cgTmXtoxA6kwr8KBy3cdcw=="
  crossOrigin=""></script>
  
  <link rel="stylesheet" type="text/css"
    href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
    integrity="sha512-BBToHPBStgMiw0lD4AtkRIZmdndhB6aQbXpX7omcrXeG2PauGBl2lzq2xUZTxaLxYz5IDHlmneCZ1IJ+P3kYtQ=="
    crossOrigin="" />
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
    integrity="sha512-RLEjtaFGdC4iQMJDbMzim/dOvAu+8Qp9sw7QE4wIMYcg2goVoivzwgSZq9CsIxp4xKAZPKh5J2f2lOko2Ze6FQ=="
    crossOrigin="" />
  <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"
    integrity="sha512-MQlyPV+ol2lp4KodaU/Xmrn+txc1TP15pOBF/2Sfre7MRsA/pB4Vy58bEqe9u7a7DczMLtU5wT8n7OblJepKbg=="
    crossOrigin=""></script>
  <script src="https://unpkg.com/esri-leaflet-cluster@2.1.0/dist/esri-leaflet-cluster.js"
    integrity="sha512-fEdNFHisleVtEYdLhW4Z2RsR7TN6hLutE/+O4D+skfTNY2rlHm8HOZARPWkdrFFy/+i2KjFxcZAKTUWaVfbV0g=="
    crossOrigin=""></script>
      </Head>
    )
}
