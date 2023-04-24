/*
All material copyright ESRI,
 All Rights Reserved,
 unless otherwise specified.
See https://js.arcgis.com/4.26/esri/copyright.txt for details.
*/
import"./core/has.js";
import{deepMerge as e}from"./core/object.js";
const s={analysisTheme:{accentColor:[255,
128,
0],
textColor:"white"},
apiKey:void 0,
applicationUrl:globalThis.location?.href,
assetsPath:"",
fontsUrl:"https://static.arcgis.com/fonts",
geometryServiceUrl:"https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
geoRSSServiceUrl:"https://utility.arcgis.com/sharing/rss",
kmlServiceUrl:"https://utility.arcgis.com/sharing/kml",
userPrivilegesApplied:!1,
portalUrl:"https://www.arcgis.com",
routeServiceUrl:"https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
workers:{loaderConfig:{has:{},
paths:{},
map:{},
packages:[]}},
request:{crossOriginNoCorsDomains:null,
httpsDomains:["arcgis.com",
"arcgisonline.com",
"esrikr.com",
"premiumservices.blackbridge.com",
"esripremium.accuweather.com",
"gbm.digitalglobe.com",
"firstlook.digitalglobe.com",
"msi.digitalglobe.com"],
interceptors:[],
maxUrlLength:2e3,
priority:"high",
proxyRules:[],
proxyUrl:null,
timeout:6e4,
trustedServers:[],
useIdentity:!0},
log:{interceptors:[],
level:null}};
if(globalThis.esriConfig&&(e(s,
globalThis.esriConfig,
!0),
delete s.has),
!s.assetsPath){{const e="4.26.5";
s.assetsPath=`https://js.arcgis.com/${e.slice(0,
-2)}/@arcgis/core/assets`}s.defaultAssetsPath=s.assetsPath}export{s as default};

