var map = L.map('map').setView([22, -27], 2.5);

  L.esri.basemapLayer('Gray').addTo(map);

// Layer Forest Density
  L.esri.tiledMapLayer({
    url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer',
//    maxZoom: 7,
    minZoom: 1
  }).addTo(map);
 

  // Layer Restoration Potential
    L.esri.tiledMapLayer({
    url: 'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/WWF_Restoration_V2/MapServer',
 //   maxZoom: 23,
    minZoom: 1
  }).addTo(map);
  
  
// Layer Planted Trees
  
  // create a new cluster layer (new syntax at 2.0.0)
  var trees = L.esri.Cluster.featureLayer({
    url: 'https://services7.arcgis.com/lKUTwQ0dhJzktt4g/arcgis/rest/services/PublicTreeInventoryView/FeatureServer/0',
// This is important as we do not need to show donated trees on global map
    precision: 5,
    where:("type='planting'"),
  // It is possible to filter the fields we want serverside. I was not able to do it. Feel Free to try and get only values we need.
  // fields:["'OBJECTID','type','tree_count','latlang'"],
    //["OBJECTID","type","tree_count","latlang"] ,
    preferCanvas: true,
    spiderfyOnMaxZoom: false,
    removeOutsideVisibleBounds: true,
   disableClusteringAtZoom: 9,
    // this function defines how the icons
    // representing clusters are created
    iconCreateFunction: function (cluster) {
      // get the number of items in the cluster
      var count = cluster.getChildCount();

      // figure out how many digits long the number is
      var digits = (count + '').length;

      // Return a new L.DivIcon with our classes so we can
      // style them with CSS. Take a look at the CSS in
      // the <head> to see these styles. You have to set
      // iconSize to null if you want to use CSS to set the
      // width and height.
      return L.divIcon({
        html: count,
        className: 'cluster digits-' + digits,
        iconSize: null
      });
    },
    // This function defines how individual markers
    // are created. You can see we are using the
    // value of the "magnitude" field to set the symbol
    pointToLayer: function (geojson, latlng) {
      var treeCount = (geojson.properties.tree_count);
      var treeType = (geojson.properties.type);
      var treeSymbol = '';

      if (!treeCount) {
//        treeSymbol = 'https://cdn-app.plant-for-the-planet.org/media/maps/con.svg';
      } else if (treeCount <= 1) {
        treeSymbol = 'https://cdn-app.plant-for-the-planet.org/media/maps/reg.svg';
      } else if (treeCount >= 1) {
        treeSymbol = 'https://cdn-app.plant-for-the-planet.org/media/maps/dnt.svg';
      }

      var mapIcon = L.icon({
        iconUrl: treeSymbol,
        iconSize: [50, 50]
      });

      return L.marker(latlng, {
        icon: mapIcon
      });
    }
  }).addTo(map);

trees.bindPopup(function (layer) {
    return L.Util.template('{tree_count} tree {type} <span><a href="https://www.trilliontreecampaign.org/t/{treecounter_id}">{user_name}</a></span>', layer.feature.properties);
  });