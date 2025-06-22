# Airline Logos Directory

This directory contains all airline logos for the AeroTrav application.

## 📁 File Naming Convention

Please upload airline logos using the following naming format:

### Format: `airline-name.extension`

**Examples:**
- `airasia.png`
- `emirates.svg`
- `singapore-airlines.jpg`
- `malaysia-airlines.png`
- `british-airways.svg`

## 📋 Required Airlines (60 total)

Please upload logos for these airlines:

1. `aer-lingus` - Aer Lingus
2. `aerolineas-argentinas` - Aerolíneas Argentinas
3. `aeromexico` - Aeroméxico
4. `air-canada` - Air Canada
5. `air-france` - Air France
6. `air-india` - Air India
7. `air-new-zealand` - Air New Zealand
8. `airasia` - AirAsia
9. `alitalia` - Alitalia
10. `all-nippon-airways` - All Nippon Airways
11. `american-airlines` - American Airlines
12. `asiana-airlines` - Asiana Airlines
13. `azul` - Azul
14. `batik-air` - Batik Air
15. `british-airways` - British Airways
16. `brussels-airlines` - Brussels Airlines
17. `cathay-pacific` - Cathay Pacific
18. `cebu-pacific` - Cebu Pacific
19. `china-eastern` - China Eastern
20. `china-southern-airlines` - China Southern Airlines
21. `delta-air-lines` - Delta Air Lines
22. `easyjet` - easyJet
23. `emirates` - Emirates
24. `ethiopian-airlines` - Ethiopian Airlines
25. `etihad-airways` - Etihad Airways
26. `fiji-airways` - Fiji Airways
27. `finnair` - Finnair
28. `garuda-indonesia` - Garuda Indonesia
29. `hainan-airlines` - Hainan Airlines
30. `iberia` - Iberia
31. `indigo` - IndiGo
32. `japan-airlines` - Japan Airlines
33. `jetstar` - Jetstar
34. `kenya-airways` - Kenya Airways
35. `klm` - KLM
36. `korean-air` - Korean Air
37. `latam-airlines` - LATAM Airlines
38. `lufthansa` - Lufthansa
39. `norwegian-air` - Norwegian Air
40. `oman-air` - Oman Air
41. `pegasus` - Pegasus
42. `philippine-airlines` - Philippine Airlines
43. `qantas` - Qantas
44. `qatar-airways` - Qatar Airways
45. `ryanair` - Ryanair
46. `s7-airlines` - S7 Airlines
47. `saudia` - Saudia
48. `scandinavian-airlines` - Scandinavian Airlines
49. `scoot` - Scoot
50. `shenzhen-airlines` - Shenzhen Airlines
51. `singapore-airlines` - Singapore Airlines
52. `south-african-airways` - South African Airways
53. `spicejet` - SpiceJet
54. `swiss` - SWISS
55. `thai-airways` - Thai Airways
56. `turkish-airlines` - Turkish Airlines
57. `united-airlines` - United Airlines
58. `vietjet-air` - VietJet Air
59. `vistara` - Vistara
60. `wizz-air` - Wizz Air

## 🎨 Logo Requirements

- **Format**: PNG, JPG, or SVG
- **Size**: Recommended 64x64px to 128x128px
- **Background**: Transparent PNG preferred
- **Quality**: High resolution for crisp display

## 🚀 After Upload

Once you've uploaded the logos, run the update script to apply them to the database:

```bash
cd apps/server
node update-logos-local.js
```

This will automatically scan the logos directory and update all airline records with the local logo paths. 