import db from './config/database.js';
import fs from 'fs';
import path from 'path';

async function updateLogosLocal() {
  try {
    console.log('🔍 Scanning for uploaded airline logos...\n');
    
    // Path to the logos directory
    const logosDir = path.join(process.cwd(), '../client/public/logos/airlines');
    
    // Check if directory exists
    if (!fs.existsSync(logosDir)) {
      console.error('❌ Logos directory not found:', logosDir);
      console.log('💡 Please create the directory and upload logos first.');
      process.exit(1);
    }
    
    // Get all airlines from database
    const airlines = await db.query('SELECT DISTINCT airline FROM flights ORDER BY airline ASC');
    console.log(`📋 Found ${airlines.length} airlines in database\n`);
    
    // Create airline name to filename mapping
    const airlineToFilename = {
      'Aer Lingus': 'aer-lingus',
      'Aerolíneas Argentinas': 'aerolineas-argentinas',
      'Aeroméxico': 'aeromexico',
      'Air Canada': 'air-canada',
      'Air France': 'air-france',
      'Air India': 'air-india',
      'Air New Zealand': 'air-new-zealand',
      'AirAsia': 'airasia',
      'Alitalia': 'alitalia',
      'All Nippon Airways': 'all-nippon-airways',
      'American Airlines': 'american-airlines',
      'Asiana Airlines': 'asiana-airlines',
      'Azul': 'azul',
      'Batik Air': 'batik-air',
      'British Airways': 'british-airways',
      'Brussels Airlines': 'brussels-airlines',
      'Cathay Pacific': 'cathay-pacific',
      'Cebu Pacific': 'cebu-pacific',
      'China Eastern': 'china-eastern',
      'China Southern Airlines': 'china-southern-airlines',
      'Delta Air Lines': 'delta-air-lines',
      'easyJet': 'easyjet',
      'Emirates': 'emirates',
      'Ethiopian Airlines': 'ethiopian-airlines',
      'Etihad Airways': 'etihad-airways',
      'Fiji Airways': 'fiji-airways',
      'Finnair': 'finnair',
      'Garuda Indonesia': 'garuda-indonesia',
      'Hainan Airlines': 'hainan-airlines',
      'Iberia': 'iberia',
      'IndiGo': 'indigo',
      'Japan Airlines': 'japan-airlines',
      'Jetstar': 'jetstar',
      'Kenya Airways': 'kenya-airways',
      'KLM': 'klm',
      'Korean Air': 'korean-air',
      'LATAM Airlines': 'latam-airlines',
      'Lufthansa': 'lufthansa',
      'Norwegian Air': 'norwegian-air',
      'Oman Air': 'oman-air',
      'Pegasus': 'pegasus',
      'Philippine Airlines': 'philippine-airlines',
      'Qantas': 'qantas',
      'Qatar Airways': 'qatar-airways',
      'Ryanair': 'ryanair',
      'S7 Airlines': 's7-airlines',
      'Saudia': 'saudia',
      'Scandinavian Airlines': 'scandinavian-airlines',
      'Scoot': 'scoot',
      'Shenzhen Airlines': 'shenzhen-airlines',
      'Singapore Airlines': 'singapore-airlines',
      'South African Airways': 'south-african-airways',
      'SpiceJet': 'spicejet',
      'SWISS': 'swiss',
      'Thai Airways': 'thai-airways',
      'Turkish Airlines': 'turkish-airlines',
      'United Airlines': 'united-airlines',
      'VietJet Air': 'vietjet-air',
      'Vistara': 'vistara',
      'Wizz Air': 'wizz-air'
    };
    
    // Scan for logo files
    const logoFiles = fs.readdirSync(logosDir);
    console.log(`📁 Found ${logoFiles.length} files in logos directory:`);
    logoFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    // Process each airline
    for (const airline of airlines) {
      const airlineName = airline.airline;
      const expectedFilename = airlineToFilename[airlineName];
      
      if (!expectedFilename) {
        console.log(`⚠️  No filename mapping for: ${airlineName}`);
        notFoundCount++;
        continue;
      }
      
      // Look for logo file with different extensions
      const possibleExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
      let logoPath = null;
      
      for (const ext of possibleExtensions) {
        const filename = expectedFilename + ext;
        if (logoFiles.includes(filename)) {
          logoPath = `/logos/airlines/${filename}`;
          break;
        }
      }
      
      if (logoPath) {
        try {
          const result = await db.query(
            'UPDATE flights SET airline_logo = ? WHERE airline = ?',
            [logoPath, airlineName]
          );
          
          if (result.affectedRows > 0) {
            console.log(`✅ ${airlineName}: ${logoPath} (${result.affectedRows} flights updated)`);
            updatedCount += result.affectedRows;
          }
        } catch (error) {
          console.error(`❌ Failed to update ${airlineName}:`, error.message);
        }
      } else {
        console.log(`❌ Logo not found for: ${airlineName} (expected: ${expectedFilename}.[png|jpg|svg])`);
        notFoundCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 UPDATE SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${updatedCount} flight records`);
    console.log(`❌ Logos not found: ${notFoundCount} airlines`);
    console.log(`📁 Total logo files: ${logoFiles.length}`);
    console.log(`🛫 Total airlines: ${airlines.length}`);
    
    if (notFoundCount > 0) {
      console.log('\n💡 To complete the setup:');
      console.log('   1. Upload missing logo files to: apps/client/public/logos/airlines/');
      console.log('   2. Use the naming convention from README.md');
      console.log('   3. Run this script again');
    } else {
      console.log('\n🎉 All airline logos have been successfully updated!');
      console.log('🌟 Your flight booking system now uses local logo files!');
    }
    
    // Test a sample to verify
    const sampleFlight = await db.queryOne('SELECT airline, airline_logo FROM flights WHERE airline_logo LIKE "/logos/%" LIMIT 1');
    if (sampleFlight) {
      console.log(`\n🧪 Sample verification:`);
      console.log(`   Airline: ${sampleFlight.airline}`);
      console.log(`   Logo path: ${sampleFlight.airline_logo}`);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating logos:', error);
    process.exit(1);
  }
}

updateLogosLocal(); 