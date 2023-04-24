/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.26/esri/copyright.txt for details.
*/
import e from"../../request.js";
import t from"../../core/Error.js";
import{get as r,isSome as a,isNone as o}from"../../core/maybe.js";
import{join as s,getPathExtension as n}from"../../core/urlUtils.js";

async function c(e,t={},a){
    await e.load(a);
    const o=s(e.itemUrl,"resources"),{
        start:n=1,
        num:c=10,
        sortOrder:u="asc",
        sortField:i="created"
    }=t,
    l={query:{start:n,num:c,sortOrder:u,sortField:i,token:e.apiKey},signal:r(a,"signal")},
    p=await e.portal.request(o,l);
    return{
        total:p.total,nextStart:p.nextStart,resources:p.resources.map((({created:t,size:r,resource:a})=>({created:new Date(t),size:r,resource:e.resourceFromPath(a)})))
    }
}
async function u(e,o,n,c){
    if(!e.hasPath())
        throw new t(`portal-item-resource-${o}:invalid-path`,"Resource does not have a valid path");
    const u=e.portalItem;
    await u.load(c);
    const i=
        s(u.userItemUrl,"add"===o?"addResources":"updateResources"),
        [l,d]=p(e.path),
        m=await h(n),
        f=new FormData;
    return l&&"."!==l&&f.append("resourcesPrefix",l),
        a(c)&&c.compress&&f.append("compress","true"),
        f.append("fileName",d),
        f.append("file",m,d),
        f.append("f","json"),
        a(c)&&c.access&&f.append("access",c.access),
        await u.portal.request(i,{method:"post",body:f,signal:r(c,"signal")}),
        e
}
async function i(e,a,o){
    if(!a.hasPath())throw new t("portal-item-resources-remove:invalid-path","Resource does not have a valid path");
    await e.load(o);
    const n=s(e.userItemUrl,"removeResources");
    await e.portal.request(n,{method:"post",query:{resource:a.path},signal:r(o,"signal")}),a.portalItem=null
}
async function l(e,t){
    await e.load(t);
    const a=s(e.userItemUrl,"removeResources");
    return e.portal.request(a,{method:"post",query:{deleteAll:!0},signal:r(t,"signal")})
}
function p(e){
    const t=e.lastIndexOf("/");
return-1===t?[".",e]:[e.slice(0,t),e.slice(t+1)]
}
function d(e){
    const[t,r]=m(e),[a,o]=p(t);return[a,o,r]
}
function m(e){
    const t=n(e);return o(t)?[e,""]:[e.slice(0,e.length-t.length-1),`.${t}`]
}
async function h(t){
    if(t instanceof Blob)return t;
    return(await e(t.url,{responseType:"blob"})).data
}
function f(e,t){
    if(!e.hasPath())return null;const[r,,a]=d(e.path);
    return e.portalItem.resourceFromPath(s(r,t+a))
}
function w(e,t){
    if(!e.hasPath())return null;const[r,,a]=d(e.path);
    return e.portalItem.resourceFromPath(s(r,t+a))
}

export{u as addOrUpdateResource,h as contentToBlob,c as fetchResources,f as getSiblingOfSameType,w as getSiblingOfSameTypeI,l as removeAllResources,i as removeResource,d as splitPrefixFileNameAndExtension};