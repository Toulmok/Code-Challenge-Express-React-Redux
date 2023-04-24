/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.26/esri/copyright.txt for details.
*/
import has from"./core/has.js";
import{getInterceptor as t,addQueryParameter as e}from"./core/urlUtils.js";
export{buildDate,commitHash as revision}from"./support/revision.js";
const a="4.26",
    s={
        async request(e,a){
            const{default:s}=
                await import("./request.js"),
                r=e.options,
                    n=r.responseType;
                r.signal=a?.signal,
                    r.responseType="native"===n||"native-request-init"===n?
                        "native-request-init":
                        n&&["blob","json","text"].includes(n)&&t(e.url)?.after?n:"array-buffer";
            const o=await s(e.url,r),
                i={data:o.data,httpStatus:o.httpStatus,ssl:o.ssl};
            switch(o.requestOptions?.responseType){
                case"native-request-init":
                    return delete i.data.signal,i;
                case"blob":i.data=await i.data.arrayBuffer();
                    break;
                case"json":i.data=(new TextEncoder).encode(JSON.stringify(i.data)).buffer;
                    break;
                case"text":i.data=(new TextEncoder).encode(i.data).buffer
            }
            return{
                result:i,transferList:[i.data]
            }
        }
    };
            
    let r;
    function n(t){r=t}
    function o(t){
        const a=r&&r.findCredential(t);
        return a&&a.token?e(t,"token",a.token):t
    }
    has("host-webworker");
export{o as addTokenParameter,r as id,n as setId,a as version,s as workerMessages};
