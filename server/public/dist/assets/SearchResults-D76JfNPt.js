import{d as m,r as u,n as b,c as t,a as e,t as d,p as k,F as p,q as _,o as a,j as x,k as w,i as R}from"./index-CciAqYaA.js";const j={class:"container mx-auto px-4 py-8"},q={class:"text-3xl font-bold mb-8"},$={key:0,class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"},C={key:1,class:"text-center py-12"},F={class:"text-red-500"},N={key:2,class:"text-center py-12"},S={key:3,class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"},B=["onClick"],I={class:"relative aspect-[2/3]"},M=["src","alt"],D={key:1,class:"w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"},E={class:"p-4"},L={class:"font-semibold mb-2"},T={class:"flex justify-between text-sm text-gray-500"},V={class:"flex items-center"},K=m({__name:"SearchResults",setup(Y){const g=x(),h=R(),c=u([]),i=u(!1),n=u(""),y="fd67da597c4cf7b23c2434f79fd181e2",f=async o=>{if(o){i.value=!0,n.value="";try{const s=await(await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${y}&query=${encodeURIComponent(o)}`)).json();c.value=s.results.map(l=>({id:l.id,title:l.title,poster_path:l.poster_path?`https://image.tmdb.org/t/p/w500${l.poster_path}`:null,release_date:l.release_date,vote_average:l.vote_average}))}catch(r){n.value="Failed to search movies",console.error(r)}finally{i.value=!1}}},v=o=>{h.push(`/movies/${o}`)};return b(()=>g.query.q,o=>{o&&f(o.toString())},{immediate:!0}),(o,r)=>(a(),t("div",j,[e("h1",q,' Search Results for "'+d(k(g).query.q)+'" ',1),i.value?(a(),t("div",$,[(a(),t(p,null,_(8,s=>e("div",{key:s,class:"animate-pulse"},r[0]||(r[0]=[e("div",{class:"aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"},null,-1),e("div",{class:"h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"},null,-1),e("div",{class:"h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"},null,-1)]))),64))])):n.value?(a(),t("div",C,[e("p",F,d(n.value),1)])):c.value.length===0?(a(),t("div",N,r[1]||(r[1]=[e("p",{class:"text-gray-600 dark:text-gray-300"}," No movies found for your search ",-1)]))):(a(),t("div",S,[(a(!0),t(p,null,_(c.value,s=>(a(),t("div",{key:s.id,class:"bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer",onClick:l=>v(s.id)},[e("div",I,[s.poster_path?(a(),t("img",{key:0,src:s.poster_path,alt:s.title,class:"w-full h-full object-cover"},null,8,M)):(a(),t("div",D," No Image "))]),e("div",E,[e("h3",L,d(s.title),1),e("div",T,[e("span",null,d(new Date(s.release_date).getFullYear()),1),e("div",V,[r[2]||(r[2]=e("span",{class:"text-yellow-400 mr-1"},"★",-1)),w(" "+d(Math.round(s.vote_average*10)/10),1)])])])],8,B))),128))]))]))}});export{K as default};
