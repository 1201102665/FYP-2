/**
 * Airline Logo Mapping Utility
 * Maps airline codes to logo URLs for flight display
 */

const airlineLogos = {
  // Major Asian Airlines
  'MH': 'https://logos.skyscnr.com/images/airlines/favicon/MH.png', // Malaysia Airlines
  'AK': 'https://logos.skyscnr.com/images/airlines/favicon/AK.png', // AirAsia
  'VJ': 'https://logos.skyscnr.com/images/airlines/favicon/VJ.png', // VietJet Air
  'SQ': 'https://logos.skyscnr.com/images/airlines/favicon/SQ.png', // Singapore Airlines
  'TG': 'https://logos.skyscnr.com/images/airlines/favicon/TG.png', // Thai Airways
  'VN': 'https://logos.skyscnr.com/images/airlines/favicon/VN.png', // Vietnam Airlines
  'JQ': 'https://logos.skyscnr.com/images/airlines/favicon/JQ.png', // Jetstar
  'TR': 'https://logos.skyscnr.com/images/airlines/favicon/TR.png', // Scoot
  'FD': 'https://logos.skyscnr.com/images/airlines/favicon/FD.png', // Thai AirAsia
  'QZ': 'https://logos.skyscnr.com/images/airlines/favicon/QZ.png', // Indonesia AirAsia
  
  // Middle Eastern Airlines
  'EK': 'https://logos.skyscnr.com/images/airlines/favicon/EK.png', // Emirates
  'QR': 'https://logos.skyscnr.com/images/airlines/favicon/QR.png', // Qatar Airways
  'EY': 'https://logos.skyscnr.com/images/airlines/favicon/EY.png', // Etihad Airways
  'MS': 'https://logos.skyscnr.com/images/airlines/favicon/MS.png', // EgyptAir
  
  // European Airlines
  'BA': 'https://logos.skyscnr.com/images/airlines/favicon/BA.png', // British Airways
  'LH': 'https://logos.skyscnr.com/images/airlines/favicon/LH.png', // Lufthansa
  'AF': 'https://logos.skyscnr.com/images/airlines/favicon/AF.png', // Air France
  'KL': 'https://logos.skyscnr.com/images/airlines/favicon/KL.png', // KLM
  'FR': 'https://logos.skyscnr.com/images/airlines/favicon/FR.png', // Ryanair
  'U2': 'https://logos.skyscnr.com/images/airlines/favicon/U2.png', // easyJet
  
  // American Airlines
  'AA': 'https://logos.skyscnr.com/images/airlines/favicon/AA.png', // American Airlines
  'DL': 'https://logos.skyscnr.com/images/airlines/favicon/DL.png', // Delta Air Lines
  'UA': 'https://logos.skyscnr.com/images/airlines/favicon/UA.png', // United Airlines
  'WN': 'https://logos.skyscnr.com/images/airlines/favicon/WN.png', // Southwest Airlines
  'B6': 'https://logos.skyscnr.com/images/airlines/favicon/B6.png', // JetBlue Airways
  
  // Other Major Airlines
  'CX': 'https://logos.skyscnr.com/images/airlines/favicon/CX.png', // Cathay Pacific
  'QF': 'https://logos.skyscnr.com/images/airlines/favicon/QF.png', // Qantas
  'JL': 'https://logos.skyscnr.com/images/airlines/favicon/JL.png', // Japan Airlines
  'NH': 'https://logos.skyscnr.com/images/airlines/favicon/NH.png', // ANA
  'CA': 'https://logos.skyscnr.com/images/airlines/favicon/CA.png', // Air China
  'CZ': 'https://logos.skyscnr.com/images/airlines/favicon/CZ.png', // China Southern
  'MU': 'https://logos.skyscnr.com/images/airlines/favicon/MU.png', // China Eastern
  
  // Budget Airlines
  'OD': 'https://logos.skyscnr.com/images/airlines/favicon/OD.png', // Malindo Air
  'XJ': 'https://logos.skyscnr.com/images/airlines/favicon/XJ.png', // Thai AirAsia X
  'D7': 'https://logos.skyscnr.com/images/airlines/favicon/D7.png', // AirAsia X
  'XT': 'https://logos.skyscnr.com/images/airlines/favicon/XT.png', // Indonesia AirAsia X
  
  // Generic/Unknown Airlines
  'default': 'https://via.placeholder.com/40x40/1e40af/ffffff?text=✈️'
};

/**
 * Get airline logo URL by airline code
 * @param {string} airlineCode - IATA airline code (e.g., 'MH', 'AK')
 * @returns {string} - Logo URL
 */
export function getAirlineLogo(airlineCode) {
  if (!airlineCode) return airlineLogos.default;
  
  const code = airlineCode.toUpperCase();
  return airlineLogos[code] || airlineLogos.default;
}

/**
 * Get airline name by airline code
 * @param {string} airlineCode - IATA airline code
 * @returns {string} - Airline name
 */
export function getAirlineName(airlineCode) {
  const airlineNames = {
    'MH': 'Malaysia Airlines',
    'AK': 'AirAsia',
    'VJ': 'VietJet Air',
    'SQ': 'Singapore Airlines',
    'TG': 'Thai Airways',
    'VN': 'Vietnam Airlines',
    'JQ': 'Jetstar',
    'TR': 'Scoot',
    'FD': 'Thai AirAsia',
    'QZ': 'Indonesia AirAsia',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'EY': 'Etihad Airways',
    'MS': 'EgyptAir',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'FR': 'Ryanair',
    'U2': 'easyJet',
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'WN': 'Southwest Airlines',
    'B6': 'JetBlue Airways',
    'CX': 'Cathay Pacific',
    'QF': 'Qantas',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
    'CA': 'Air China',
    'CZ': 'China Southern',
    'MU': 'China Eastern',
    'OD': 'Malindo Air',
    'XJ': 'Thai AirAsia X',
    'D7': 'AirAsia X',
    'XT': 'Indonesia AirAsia X'
  };
  
  if (!airlineCode) return 'Unknown Airline';
  
  const code = airlineCode.toUpperCase();
  return airlineNames[code] || `${code} Airlines`;
}

export default { getAirlineLogo, getAirlineName }; 