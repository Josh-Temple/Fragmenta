import React, {createContext,useContext,useEffect,useMemo,useState} from 'react';
export type Locale = 'en' | 'ja';
type Value = {locale:Locale;setLocale:(v:Locale)=>void;txt:(en:string,ja:string)=>string};
const Context=createContext<Value|null>(null);
function getInitialLocale():Locale {
  try { const v=localStorage.getItem('fragmenta.locale'); if(v==='en'||v==='ja')return v; } catch {}
  return navigator.language.toLowerCase().startsWith('ja')?'ja':'en';
}
export function LocaleProvider({children}:{children:React.ReactNode}) {
  const [locale,setLocale]=useState<Locale>(getInitialLocale);
  useEffect(()=>{document.documentElement.lang=locale;try{localStorage.setItem('fragmenta.locale',locale)}catch{}},[locale]);
  const value=useMemo<Value>(()=>({locale,setLocale,txt:(en,ja)=>locale==='ja'?ja:en}),[locale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLocale():Value {
  const v=useContext(Context);if(!v)throw new Error('LocaleProvider required');return v;
}
