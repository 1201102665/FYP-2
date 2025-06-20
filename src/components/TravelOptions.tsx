import { Link } from "react-router-dom";
import TravelTabs from "./TravelTabs";

const TravelOptions = () => {
  const options = [
  {
    title: "Hotel",
    icon:
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="448km0qi3" data-path="src/components/TravelOptions.tsx">
          <path d="M19 19V4C19 3.44772 18.5523 3 18 3H6C5.44772 3 5 3.44772 5 4V19M19 19H5M19 19H21M5 19H3M9 3V19M14 8H16M14 12H16M8 12H10M8 8H10M8 16H16"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-id="eyxlz8p4k" data-path="src/components/TravelOptions.tsx" />
        </svg>,

    link: "/hotels"
  },
  {
    title: "Flight",
    icon:
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="i0gsoaxf7" data-path="src/components/TravelOptions.tsx">
          <path d="M4 11L9 9L4.5 5.5C3.5 4.5 4 3 5 2C6 1 7.5 1.5 8.5 2.5L12 7L14 6.5M16 16L14 19L17.5 20.5C18.5 21 20 20.5 21 19.5C22 18.5 21.5 17 20.5 16L16 13.5L15 12"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-id="whe6cgd4a" data-path="src/components/TravelOptions.tsx" />
          <path d="M9 13.5L4.5 15.5L2 22L8.5 21.5L13 19M14 6L18 4L22 2L20 6L18 10.5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-id="0h1lzsk5z" data-path="src/components/TravelOptions.tsx" />
        </svg>,

    link: "/flights"
  },
  {
    title: "Car Rentals",
    icon:
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="bqndjhnff" data-path="src/components/TravelOptions.tsx">
          <path d="M7 17C7 17.5523 6.55228 18 6 18C5.44772 18 5 17.5523 5 17C5 16.4477 5.44772 16 6 16C6.55228 16 7 16.4477 7 17Z"
      fill="currentColor" data-id="idl1tkx5x" data-path="src/components/TravelOptions.tsx" />
          <path d="M19 17C19 17.5523 18.5523 18 18 18C17.4477 18 17 17.5523 17 17C17 16.4477 17.4477 16 18 16C18.5523 16 19 16.4477 19 17Z"
      fill="currentColor" data-id="fu4dot0vq" data-path="src/components/TravelOptions.tsx" />
          <path d="M3 6H16.5L17.4 9H21V15H19M14 15H9M6 15H3V9H4.2M7 9L5.8 6M18 9H15M17 13H21M3 13H7"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-id="bxs4jxsv8" data-path="src/components/TravelOptions.tsx" />
        </svg>,

    link: "/car-rentals"
  },
  {
    title: "Travel Packages",
    icon:
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="87lppqqsp" data-path="src/components/TravelOptions.tsx">
          <path d="M5 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V15.2C21 16.8802 21 17.7202 20.673 18.362C20.3854 18.9265 19.9265 19.3854 19.362 19.673C18.7202 20 17.8802 20 16.2 20H7.8C6.11984 20 5.27976 20 4.63803 19.673C4.07354 19.3854 3.6146 18.9265 3.32698 18.362C3 17.7202 3 16.8802 3 15.2V7M14 9L10 13M10 9L14 13"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" data-id="cekmm03gj" data-path="src/components/TravelOptions.tsx" />
        </svg>,

    link: "/packages"
  }];

  return (
    <div className="max-w-3xl mx-auto" data-id="3sv7r9i2r" data-path="src/components/TravelOptions.tsx">
      <TravelTabs data-id="qhxy7dubb" data-path="src/components/TravelOptions.tsx" />
    </div>);

};

export default TravelOptions;