/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.26/esri/copyright.txt for details.
*/
import{_ as e}from"../chunks/tslib.es6.js";
import t from"../config.js";
import{id as r}from"../kernel.js";
import o from"../request.js";
import s from"../core/Error.js";
import{JSONSupportMixin as i}
from"../core/JSONSupport.js";
import a from"../core/Loadable.js";
import{removeMaybe as l,isSome as u}from"../core/maybe.js";
import{throwIfAborted as n,isAborted as p,createAbortError as d,throwIfAbortError as h}from"../core/promiseUtils.js";
import{property as y}from"../core/accessorSupport/decorators/property.js";
import{ensureType as c}from"../core/accessorSupport/ensureType.js";
import"../core/arrayUtils.js";
import{reader as m}from"../core/accessorSupport/decorators/reader.js";
import{subclass as v}from"../core/accessorSupport/decorators/subclass.js";
import f from"../geometry/Extent.js";
import{getLocale as S}from"../intl/locale.js";
import g from"./PortalQueryParams.js";
import P from"./PortalQueryResult.js";
import O from"./PortalUser.js";
import{supportsApiKey as G}from"../support/apiKeyUtils.js";
var U;
let B;
const D={
    PortalGroup:()=>import("./PortalGroup.js"),PortalItem:()=>import("./PortalItem.js"),PortalUser:()=>import("./PortalUser.js")
};

let j=U=class extends(i(a)){
    constructor(e){
        super(e),
        this._esriIdCredentialCreateHandle=null,
        this.access=null,this.allSSL=!1,
        this.authMode="auto",
        this.authorizedCrossOriginDomains=null,
        this.basemapGalleryGroupQuery=null,
        this.bingKey=null,this.canListApps=!1,
        this.canListData=!1,
        this.canListPreProvisionedItems=!1,
        this.canProvisionDirectPurchase=!1,
        this.canSearchPublic=!0,
        this.canShareBingPublic=!1,
        this.canSharePublic=!1,
        this.canSignInArcGIS=!1,
        this.canSignInIDP=!1,
        this.colorSetsGroupQuery=null,
        this.commentsEnabled=!1,
        this.created=null,
        this.culture=null,
        this.customBaseUrl=null,
        this.defaultBasemap=null,
        this.defaultDevBasemap=null,
        this.defaultExtent=null,
        this.defaultVectorBasemap=null,
        this.description=null,
        this.devBasemapGalleryGroupQuery=null,
        this.eueiEnabled=null,
        this.featuredGroups=null,
        this.featuredItemsGroupQuery=null,
        this.galleryTemplatesGroupQuery=null,
        this.livingAtlasGroupQuery=null,
        this.hasCategorySchema=!1,
        this.helperServices=null,
        this.homePageFeaturedContent=null,
        this.homePageFeaturedContentCount=null,
        this.httpPort=null,this.httpsPort=null,
        this.id=null,this.ipCntryCode=null,
        this.isPortal=!1,this.isReadOnly=!1,
        this.layerTemplatesGroupQuery=null,
        this.maxTokenExpirationMinutes=null,
        this.modified=null,this.name=null,
        this.portalHostname=null,
        this.portalMode=null,
        this.portalProperties=null,
        this.region=null,
        this.rotatorPanels=null,
        this.showHomePageDescription=!1,
        this.sourceJSON=null,this.supportsHostedServices=!1,
        this.symbolSetsGroupQuery=null,
        this.templatesGroupQuery=null,
        this.units=null,this.url=t.portalUrl,
        this.urlKey=null,
        this.user=null,
        this.useStandardizedQuery=!1,
        this.useVectorBasemaps=!1,
        this.vectorBasemapGalleryGroupQuery=null
    }
    normalizeCtorArgs(e){
        return"string"==typeof e?{url:e}
        :e
    }
    destroy(){
        this._esriIdCredentialCreateHandle=l(this._esriIdCredentialCreateHandle)
    }
    readAuthorizedCrossOriginDomains(e){
        if(e)for(const r of e)t.request.trustedServers.includes(r)||t.request.trustedServers.push(r);
        return e
    }
    readDefaultBasemap(e){
        return this._readBasemap(e)
    }
    readDefaultDevBasemap(e){
        return this._readBasemap(e)
    }
    readDefaultVectorBasemap(e){
        return this._readBasemap(e)
    }
    get extraQuery(){
        const e=!(this.user&&this.user.orgId)||this.canSearchPublic;
        return this.id&&!e?` AND orgid:${this.id}`:null
    }
    get isOrganization(){
        return!!this.access
    }
    get itemPageUrl(){
        return this.url?`${
            this.url
        }
        /home/item.html`:null
    }
    get restUrl(){
        let e=this.url;
        if(e){
            const t=e.indexOf("/sharing");
            e=t>0?e.substring(0,t):this.url.replace(/\/+$/,""),e+="/sharing/rest"
        }
        return e
    }
    get thumbnailUrl(){
        const e=this.restUrl,t=this.thumbnail;
        return e&&t?this._normalizeSSL(e+"/portals/self/resources/"+t):null
    }
    readUrlKey(e){
        return e?e.toLowerCase():e
    }
    readUser(e){
        let t=null;
        return e&&(t=O.fromJSON(e),t.portal=this),t
    }
    load(e){
        const t=import("../Basemap.js")
        .then((({ default:t })=>{ n(e),B=t }))
        .then((()=>this.sourceJSON?this.sourceJSON:this.fetchSelf(this.authMode,!1,e)))
        .then((e=>{
            if(r){
                const e=r;
                this.credential=e.findCredential(this.restUrl),
                this.credential||this.authMode!==U.AUTH_MODE_AUTO||
                    (this._esriIdCredentialCreateHandle=e.on("credential-create",
                        (()=>{e.findCredential(this.restUrl)&&this.signIn().catch((()=>{}))})))
            }
            this.sourceJSON=e,this.read(e)
        }));
        return this.addResolvingPromise(t),Promise.resolve(this)
    }
    async createElevationLayers(){
        await this.load();
        const e=this._getHelperService("defaultElevationLayers"),t=(await import("../layers/ElevationLayer.js")).default;
        return e?e.map((e=>new t({ id:e.id,url:e.url }))):[]
    }
    fetchBasemaps(e,r){
        const o=new g;
        return o.query=e||(t.apiKey&&G(this.url)?this.devBasemapGalleryGroupQuery:this.useVectorBasemaps?this.vectorBasemapGalleryGroupQuery:this.basemapGalleryGroupQuery),o.disableExtraQuery=!0,this.queryGroups(o,r).then((e=>{
            if(o.num=100,o.query='type:"Web Map" -type:"Web Application"',e.total){
                const t=e.results[0];
                return o.sortField=t.sortField||"name",o.sortOrder=t.sortOrder||"desc",t.queryItems(o,r)
            }
            return null
        }))
        .then((e=>{
            let t;
            return t=e&&e.total?e.results.filter((e=>"Web Map"===e.type)).map((e=>new B({
                portalItem:e
            }))):[],t
        }))
    }
    fetchCategorySchema(e){
        return this.hasCategorySchema?this.request(this.restUrl+"/portals/self/categorySchema",e).then((e=>e.categorySchema)):p(e)?Promise.reject(d()):Promise.resolve([])
    }
    fetchFeaturedGroups(e){
        const t=this.featuredGroups,r=new g;
        if(r.num=100,r.sortField="title",t&&t.length){
            const o=[];
            for(const e of t)o.push(`(title:"${        e.title    }    " AND owner:${    e.owner    }
            )`);
            return r.query=o.join(" OR "),this.queryGroups(r,e).then((e=>e.results))
        }
        return p(e)?Promise.reject(d()):Promise.resolve([])
    }
    fetchRegions(e){
        const t=this.user?.culture||this.culture||S();
        return this.request(this.restUrl+"/portals/regions",{
            ...e,query:{culture:t}
        })
    }
    fetchSettings(e){
        const t=this.user?.culture||this.culture||S();
        return this.request(this.restUrl+"/portals/self/settings",{
            ...e,query:{culture:t}
        })    
    }
    static getDefault(){
        return U._default&&!U._default.destroyed||(U._default=new U),U._default
    }
    queryGroups(e,t){
        return this.queryPortal("/community/groups",e,"PortalGroup",t)
    }
    queryItems(e,t){
        return this.queryPortal("/search",e,"PortalItem",t)
    }
    queryUsers(e,t){
        return e.sortField||(e.sortField="username"),this.queryPortal("/community/users",e,"PortalUser",t)
    }
    fetchSelf(e=this.authMode,t=!1,r){
        const o=this.restUrl+"/portals/self",s={
            authMode:e,query:{culture:S().toLowerCase() },...r        
        };
        return"auto"===s.authMode&&(s.authMode="no-prompt"),t&&(s.query.default=!0),this.request(o,s)
    }
    queryPortal(e,t,r,o){
        const s=c(g,t),i=t=>this.request(this.restUrl+e,{
            ...s.toRequestOptions(this),...o
        })
        .then((e=>{
            const r=s.clone();
            return r.start=e.nextStart,new P({
                nextQueryParams:r,queryParams:s,total:e.total,results:U._resultsToTypedArray(t,{
                portal:this
                },e,o)
            })
        }))
        .then((e=>Promise.all(e.results.map((t=>"function"==typeof t.when?t.when():e)))
        .then((()=>e),(t=>(h(t),e)))));
        return r&&D[r]?D[r]().then((({
            default:e
        })=>(n(o),i(e)))):i()
    }
    signIn(){
        if(this.authMode===U.AUTH_MODE_ANONYMOUS)
            return Promise.reject(new s("portal:invalid-auth-mode",`Current "authMode"' is "${this.authMode}"`));
        if("failed"===this.loadStatus)
            return Promise.reject(this.loadError);
        const e=e=>Promise.resolve()
            .then((()=>"not-loaded"===this.loadStatus?(e||(this.authMode="immediate"),this.load()
            .then((()=>null))):"loading"===this.loadStatus?this.load()
            .then((()=>this.credential?null:(this.credential=e,this.fetchSelf("immediate")))):this.user&&this.credential===e?null:(this.credential=e,this.fetchSelf("immediate"))))
            .then((e=>{
                e&&(this.sourceJSON=e,this.read(e))
            }));
        return r?r.getCredential(this.restUrl).then((t=>e(t))):e(this.credential)
    }
    normalizeUrl(e){
        const t=this.credential&&this.credential.token;
        return this._normalizeSSL(t?e+(e.includes("?")?"&":"?")+"token="+t:e)
    }
    requestToTypedArray(e,t,r){
        return this.request(e,t).then((e=>{
            const t=U._resultsToTypedArray(r,{        portal:this        }
            ,e);
            return Promise.all(t.map((t=>"function"==typeof t.when?t.when():e))).then((()=>t),(()=>t))
        }))
    }
    request(e,t={}){
        const r={f:"json",...t.query},
            {
                authMode:s=(this.authMode===U.AUTH_MODE_ANONYMOUS?"anonymous":"auto"),
                body:i=null,
                cacheBust:a=!1,
                method:l="auto",
                responseType:u="json",
                signal:n
            }=t,
            p={
                authMode:s,
                body:i,
                cacheBust:a,
                method:l,
                query:r,
                responseType:u,
                timeout:0,
                signal:n
            };
        return o(this._normalizeSSL(e),p).then((e=>e.data))
    }
    toJSON(){
        throw new s("internal:not-yet-implemented","Portal.toJSON is not yet implemented")
    }
    static fromJSON(e){
        if(!e)return null;
        if(e.declaredClass)throw new Error("JSON object is already hydrated");
        return new U({sourceJSON:e})
    }
    _getHelperService(e){
        const t=this.helperServices&&this.helperServices[e];
        if(!t)throw new s("portal:service-not-found",`The \`helperServices\` do not include an entry named "${e}"`);
        return t
    }
    _normalizeSSL(e){
        return e.replace(/^http:/i,"https:").replace(":7080",":7443")
    }
    _readBasemap(e){
        if(e){
            const t=B.fromJSON(e);
            return t.portalItem={portal:this},t
        }
        return null
    }
    static _resultsToTypedArray(e,t,r,o){
        let s=[];
        if(r){
            const i=u(o)?o.signal:null;
            s=r.listings||r.notifications||r.userInvitations||r.tags||r.items||r.groups||r.comments||r.provisions||r.results||r.relatedItems||r,(e||t)&&(s=s.map((r=>{
                const o=Object.assign(e?e.fromJSON(r):r,t);
                return"function"==typeof o.load&&o.load(i),o
            })))    
        }
        else s=[];
        return s
    }
};

j.AUTH_MODE_ANONYMOUS="anonymous",
j.AUTH_MODE_AUTO="auto",
j.AUTH_MODE_IMMEDIATE="immediate",
e([y()],j.prototype,"access",void 0),
e([y()],j.prototype,"allSSL",void 0),
e([y()],j.prototype,"authMode",void 0),
e([y()],j.prototype,"authorizedCrossOriginDomains",void 0),
e([m("authorizedCrossOriginDomains")],j.prototype,"readAuthorizedCrossOriginDomains",null),
e([y()],j.prototype,"basemapGalleryGroupQuery",void 0),
e([y()],j.prototype,"bingKey",void 0),
e([y()],j.prototype,"canListApps",void 0),
e([y()],j.prototype,"canListData",void 0),
e([y()],j.prototype,"canListPreProvisionedItems",void 0),
e([y()],j.prototype,"canProvisionDirectPurchase",void 0),
e([y()],j.prototype,"canSearchPublic",void 0),
e([y()],j.prototype,"canShareBingPublic",void 0),
e([y()],j.prototype,"canSharePublic",void 0),
e([y()],j.prototype,"canSignInArcGIS",void 0),
e([y()],j.prototype,"canSignInIDP",void 0),
e([y()],j.prototype,"colorSetsGroupQuery",void 0),
e([y()],j.prototype,"commentsEnabled",void 0),
e([y({type:Date})],j.prototype,"created",void 0),
e([y()],j.prototype,"credential",void 0),
e([y()],j.prototype,"culture",void 0),
e([y()],j.prototype,"currentVersion",void 0),
e([y()],j.prototype,"customBaseUrl",void 0),
e([y()],j.prototype,"defaultBasemap",void 0),
e([m("defaultBasemap")],j.prototype,"readDefaultBasemap",null),
e([y()],j.prototype,"defaultDevBasemap",void 0),
e([m("defaultDevBasemap")],j.prototype,"readDefaultDevBasemap",null),
e([y({type:f})],j.prototype,"defaultExtent",void 0),
e([y()],j.prototype,"defaultVectorBasemap",void 0),
e([m("defaultVectorBasemap")],j.prototype,"readDefaultVectorBasemap",null),
e([y()],j.prototype,"description",void 0),
e([y()],j.prototype,"devBasemapGalleryGroupQuery",void 0),
e([y()],j.prototype,"eueiEnabled",void 0),
e([y({readOnly:!0})],j.prototype,"extraQuery",null),
e([y()],j.prototype,"featuredGroups",void 0),
e([y()],j.prototype,"featuredItemsGroupQuery",void 0),
e([y()],j.prototype,"galleryTemplatesGroupQuery",void 0),
e([y()],j.prototype,"livingAtlasGroupQuery",void 0),
e([y()],j.prototype,"hasCategorySchema",void 0),
e([y()],j.prototype,"helpBase",void 0),
e([y()],j.prototype,"helperServices",void 0),
e([y()],j.prototype,"helpMap",void 0),
e([y()],j.prototype,"homePageFeaturedContent",void 0),
e([y()],j.prototype,"homePageFeaturedContentCount",void 0),
e([y()],j.prototype,"httpPort",void 0),
e([y()],j.prototype,"httpsPort",void 0),
e([y()],j.prototype,"id",void 0),
e([y()],j.prototype,"ipCntryCode",void 0),
e([y({readOnly:!0})],j.prototype,"isOrganization",null),
e([y()],j.prototype,"isPortal",void 0),
e([y()],j.prototype,"isReadOnly",void 0),
e([y({readOnly:!0})],j.prototype,"itemPageUrl",null),
e([y()],j.prototype,"layerTemplatesGroupQuery",void 0),
e([y()],j.prototype,"maxTokenExpirationMinutes",void 0),
e([y({type:Date})],j.prototype,"modified",void 0),
e([y()],j.prototype,"name",void 0),
e([y()],j.prototype,"portalHostname",void 0),
e([y()],j.prototype,"portalMode",void 0),
e([y()],j.prototype,"portalProperties",void 0),
e([y()],j.prototype,"region",void 0),
e([y({readOnly:!0})],j.prototype,"restUrl",null),
e([y()],j.prototype,"rotatorPanels",void 0),
e([y()],j.prototype,"showHomePageDescription",void 0),
e([y()],j.prototype,"sourceJSON",void 0),
e([y()],j.prototype,"staticImagesUrl",void 0),
e([y({json:{    name:"2DStylesGroupQuery"    }})],j.prototype,"stylesGroupQuery2d",void 0),
e([y({json:{    name:"stylesGroupQuery"    }})],j.prototype,"stylesGroupQuery3d",void 0),
e([y()],j.prototype,"supportsHostedServices",void 0),
e([y()],j.prototype,"symbolSetsGroupQuery",void 0),
e([y()],j.prototype,"templatesGroupQuery",void 0),
e([y()],j.prototype,"thumbnail",void 0),
e([y({readOnly:!0})],j.prototype,"thumbnailUrl",null),
e([y()],j.prototype,"units",void 0),
e([y()],j.prototype,"url",void 0),
e([y()],j.prototype,"urlKey",void 0),
e([m("urlKey")],j.prototype,"readUrlKey",null),
e([y()],j.prototype,"user",void 0),
e([m("user")],j.prototype,"readUser",null),
e([y()],j.prototype,"useStandardizedQuery",void 0),
e([y()],j.prototype,"useVectorBasemaps",void 0),
e([y()],j.prototype,"vectorBasemapGalleryGroupQuery",void 0),
j=U=e([v("esri.portal.Portal")],j);
const b=j;
export{b as default};