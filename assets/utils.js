// import mixpanel from 'mixpanel-browser';
// import ReactGA from 'react-ga';
// import { gtag } from 'ga-gtag'
 
export const ConvertToArabicNumbers = (num) => {
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
 return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
}

export const trackEvent = (event) => {
  // mixpanel.track(event)
  // ReactGA.event({ action: event })
  // gtag('event', event)
  // if(window.gtag){
  //   window.gtag()
  // }
}