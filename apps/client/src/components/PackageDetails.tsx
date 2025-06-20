import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface PackageDetailsProps {
  title: string;
  description: string;
  destination: string;
  duration: string;
  itinerary: ItineraryItem[];
  flightDetails?: {
    departure: string;
    arrival: string;
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    class: string;
  };
  hotelDetails?: {
    name: string;
    rating: number;
    location: string;
    roomType: string;
    boardType: string; // All-inclusive, breakfast only, etc.
    amenities: string[];
  };
  carDetails?: {
    type: string;
    brand: string;
    model: string;
    pickupLocation: string;
    dropoffLocation: string;
  };
  includedServices: string[];
  excludedServices: string[];
}

const PackageDetails: React.FC<PackageDetailsProps> = ({
  title,
  description,
  destination,
  duration,
  itinerary,
  flightDetails,
  hotelDetails,
  carDetails,
  includedServices,
  excludedServices
}) => {
  return (
    <Card className="shadow-md" data-id="tyd186yzv" data-path="src/components/PackageDetails.tsx">
      <CardContent className="p-6" data-id="ip48zwsy2" data-path="src/components/PackageDetails.tsx">
        <h2 className="text-2xl font-bold mb-2" data-id="u71b22kvm" data-path="src/components/PackageDetails.tsx">{title}</h2>
        <div className="flex items-center mb-4" data-id="36ghk645h" data-path="src/components/PackageDetails.tsx">
          <Badge variant="outline" className="mr-2" data-id="hv4y8pafe" data-path="src/components/PackageDetails.tsx">{destination}</Badge>
          <Badge variant="outline" data-id="dolen9uk0" data-path="src/components/PackageDetails.tsx">{duration}</Badge>
        </div>
        
        <p className="text-muted-foreground mb-6" data-id="z9pxrji0o" data-path="src/components/PackageDetails.tsx">{description}</p>
        
        <Tabs defaultValue="overview" className="w-full" data-id="mx98qtzv5" data-path="src/components/PackageDetails.tsx">
          <TabsList className="grid w-full grid-cols-4" data-id="texldnz1a" data-path="src/components/PackageDetails.tsx">
            <TabsTrigger value="overview" data-id="bdx881fhf" data-path="src/components/PackageDetails.tsx">Overview</TabsTrigger>
            <TabsTrigger value="itinerary" data-id="061hj4r9f" data-path="src/components/PackageDetails.tsx">Itinerary</TabsTrigger>
            <TabsTrigger value="accommodations" data-id="7wuv9ln1s" data-path="src/components/PackageDetails.tsx">Accommodations</TabsTrigger>
            <TabsTrigger value="inclusions" data-id="xmnx12scf" data-path="src/components/PackageDetails.tsx">Inclusions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4" data-id="wbxs78xck" data-path="src/components/PackageDetails.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="dqtxe591f" data-path="src/components/PackageDetails.tsx">
              {flightDetails &&
              <div className="p-4 border rounded-lg" data-id="vnowzzbje" data-path="src/components/PackageDetails.tsx">
                  <h3 className="font-bold flex items-center mb-3" data-id="9qs9b1tj2" data-path="src/components/PackageDetails.tsx">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="nluumxxg5" data-path="src/components/PackageDetails.tsx">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-id="c6ybhq3z8" data-path="src/components/PackageDetails.tsx"></path>
                    </svg>
                    Flight Information
                  </h3>
                  <div className="space-y-2" data-id="im8kspwh8" data-path="src/components/PackageDetails.tsx">
                    <div className="flex justify-between" data-id="kqzxcxivl" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="c20r2lx26" data-path="src/components/PackageDetails.tsx">Airline:</span>
                      <span data-id="coobggu1j" data-path="src/components/PackageDetails.tsx">{flightDetails.airline}</span>
                    </div>
                    <div className="flex justify-between" data-id="vl59sao7f" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="eez9z9oik" data-path="src/components/PackageDetails.tsx">Flight:</span>
                      <span data-id="bfge7cri6" data-path="src/components/PackageDetails.tsx">{flightDetails.flightNumber}</span>
                    </div>
                    <div className="flex justify-between" data-id="957h3s03w" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="boxhxsl96" data-path="src/components/PackageDetails.tsx">Departure:</span>
                      <span data-id="6cskhefdo" data-path="src/components/PackageDetails.tsx">{flightDetails.departure} ({flightDetails.departureTime})</span>
                    </div>
                    <div className="flex justify-between" data-id="03lyrxpv3" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="xzaevzofb" data-path="src/components/PackageDetails.tsx">Arrival:</span>
                      <span data-id="qfz8smbdh" data-path="src/components/PackageDetails.tsx">{flightDetails.arrival} ({flightDetails.arrivalTime})</span>
                    </div>
                    <div className="flex justify-between" data-id="j161359cr" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="d5491sr2w" data-path="src/components/PackageDetails.tsx">Class:</span>
                      <span data-id="hw8x8t0rw" data-path="src/components/PackageDetails.tsx">{flightDetails.class}</span>
                    </div>
                  </div>
                </div>
              }
              
              {hotelDetails &&
              <div className="p-4 border rounded-lg" data-id="qwt220fac" data-path="src/components/PackageDetails.tsx">
                  <h3 className="font-bold flex items-center mb-3" data-id="8zlof2bpo" data-path="src/components/PackageDetails.tsx">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="u3r680tt9" data-path="src/components/PackageDetails.tsx">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" data-id="sede96z00" data-path="src/components/PackageDetails.tsx"></path>
                      <polyline points="9 22 9 12 15 12 15 22" data-id="zcq0jx64j" data-path="src/components/PackageDetails.tsx"></polyline>
                    </svg>
                    Hotel Information
                  </h3>
                  <div className="space-y-2" data-id="wxq96lqq8" data-path="src/components/PackageDetails.tsx">
                    <div className="flex justify-between" data-id="i8au1owj6" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="zgvurzg6w" data-path="src/components/PackageDetails.tsx">Name:</span>
                      <span data-id="dqz6y0nn2" data-path="src/components/PackageDetails.tsx">{hotelDetails.name}</span>
                    </div>
                    <div className="flex justify-between" data-id="ozk7y6ik6" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="niqu06ccb" data-path="src/components/PackageDetails.tsx">Rating:</span>
                      <span className="flex" data-id="lrdrlo37t" data-path="src/components/PackageDetails.tsx">
                        {Array.from({ length: hotelDetails.rating }).map((_, i) =>
                      <span key={i} className="text-yellow-500" data-id="93ibfd65y" data-path="src/components/PackageDetails.tsx">★</span>
                      )}
                      </span>
                    </div>
                    <div className="flex justify-between" data-id="fpfh8w5wo" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="wgp19tspf" data-path="src/components/PackageDetails.tsx">Location:</span>
                      <span data-id="o7y1krnzo" data-path="src/components/PackageDetails.tsx">{hotelDetails.location}</span>
                    </div>
                    <div className="flex justify-between" data-id="m3sw0kchr" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="b0vf0pgep" data-path="src/components/PackageDetails.tsx">Room Type:</span>
                      <span data-id="j5ukfyd2k" data-path="src/components/PackageDetails.tsx">{hotelDetails.roomType}</span>
                    </div>
                    <div className="flex justify-between" data-id="anul70klb" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="yakh8pqw4" data-path="src/components/PackageDetails.tsx">Board:</span>
                      <span data-id="t35my8zhk" data-path="src/components/PackageDetails.tsx">{hotelDetails.boardType}</span>
                    </div>
                  </div>
                </div>
              }
              
              {carDetails &&
              <div className="p-4 border rounded-lg md:col-span-2 lg:col-span-1" data-id="bht6ri0ex" data-path="src/components/PackageDetails.tsx">
                  <h3 className="font-bold flex items-center mb-3" data-id="46rjvoizm" data-path="src/components/PackageDetails.tsx">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="h6xa53vbs" data-path="src/components/PackageDetails.tsx">
                      <rect x="1" y="3" width="15" height="13" data-id="a2hao8axg" data-path="src/components/PackageDetails.tsx"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" data-id="vdjn2djta" data-path="src/components/PackageDetails.tsx"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5" data-id="bsowxymgp" data-path="src/components/PackageDetails.tsx"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5" data-id="kthu6f57s" data-path="src/components/PackageDetails.tsx"></circle>
                    </svg>
                    Car Rental Information
                  </h3>
                  <div className="space-y-2" data-id="tdldxljts" data-path="src/components/PackageDetails.tsx">
                    <div className="flex justify-between" data-id="gw1z23zzi" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="2x2eixu5c" data-path="src/components/PackageDetails.tsx">Car Type:</span>
                      <span data-id="8m824kb5f" data-path="src/components/PackageDetails.tsx">{carDetails.type}</span>
                    </div>
                    <div className="flex justify-between" data-id="x7whu7skc" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="jfj1sjp79" data-path="src/components/PackageDetails.tsx">Model:</span>
                      <span data-id="p5j1sxwm2" data-path="src/components/PackageDetails.tsx">{carDetails.brand} {carDetails.model}</span>
                    </div>
                    <div className="flex justify-between" data-id="u2qgulqwl" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="jiaucxoxm" data-path="src/components/PackageDetails.tsx">Pickup:</span>
                      <span data-id="loetaxo10" data-path="src/components/PackageDetails.tsx">{carDetails.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between" data-id="cp7ldk54r" data-path="src/components/PackageDetails.tsx">
                      <span className="text-muted-foreground" data-id="e1xqgxlls" data-path="src/components/PackageDetails.tsx">Drop-off:</span>
                      <span data-id="96zeavci1" data-path="src/components/PackageDetails.tsx">{carDetails.dropoffLocation}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </TabsContent>
          
          <TabsContent value="itinerary" className="pt-4" data-id="datalbwdz" data-path="src/components/PackageDetails.tsx">
            <div className="space-y-4" data-id="4s7byokv0" data-path="src/components/PackageDetails.tsx">
              {itinerary.map((day) =>
              <div key={day.day} className="border rounded-lg p-4" data-id="egzfyibut" data-path="src/components/PackageDetails.tsx">
                  <h3 className="font-bold text-lg mb-2" data-id="3qsbp1ctj" data-path="src/components/PackageDetails.tsx">Day {day.day}: {day.title}</h3>
                  <p className="text-muted-foreground mb-3" data-id="vjf39aooo" data-path="src/components/PackageDetails.tsx">{day.description}</p>
                  <div className="ml-4" data-id="7nfxq7x78" data-path="src/components/PackageDetails.tsx">
                    <h4 className="font-medium mb-2" data-id="398oxc1z7" data-path="src/components/PackageDetails.tsx">Activities:</h4>
                    <ul className="list-disc ml-5 space-y-1" data-id="d5as4rjeu" data-path="src/components/PackageDetails.tsx">
                      {day.activities.map((activity, index) =>
                    <li key={index} data-id="zxqw8ynaf" data-path="src/components/PackageDetails.tsx">{activity}</li>
                    )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="accommodations" className="pt-4" data-id="qlromfcr4" data-path="src/components/PackageDetails.tsx">
            {hotelDetails &&
            <div className="space-y-4" data-id="ujefchgtb" data-path="src/components/PackageDetails.tsx">
                <div data-id="b0b74rbkg" data-path="src/components/PackageDetails.tsx">
                  <h3 className="font-bold text-lg mb-2" data-id="00gxt0q14" data-path="src/components/PackageDetails.tsx">{hotelDetails.name}</h3>
                  <div className="flex mb-2" data-id="68l65vpq7" data-path="src/components/PackageDetails.tsx">
                    {Array.from({ length: hotelDetails.rating }).map((_, i) =>
                  <span key={i} className="text-yellow-500" data-id="tckbeoh7x" data-path="src/components/PackageDetails.tsx">★</span>
                  )}
                  </div>
                  <p className="text-muted-foreground mb-4" data-id="h5y1z33lh" data-path="src/components/PackageDetails.tsx">{hotelDetails.location}</p>
                  
                  <h4 className="font-medium mt-4 mb-2" data-id="ydsxltv9u" data-path="src/components/PackageDetails.tsx">Room Details</h4>
                  <p data-id="zdtwhhnk5" data-path="src/components/PackageDetails.tsx">{hotelDetails.roomType}</p>
                  <p data-id="jqx2vff8e" data-path="src/components/PackageDetails.tsx">{hotelDetails.boardType}</p>
                  
                  <h4 className="font-medium mt-4 mb-2" data-id="2e5h7m4ic" data-path="src/components/PackageDetails.tsx">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2" data-id="vbmwjtyig" data-path="src/components/PackageDetails.tsx">
                    {hotelDetails.amenities.map((amenity, index) =>
                  <Badge key={index} variant="outline" className="justify-center" data-id="n4ha56jis" data-path="src/components/PackageDetails.tsx">
                        {amenity}
                      </Badge>
                  )}
                  </div>
                </div>
              </div>
            }
            
            {!hotelDetails &&
            <div className="text-center py-8 text-muted-foreground" data-id="7hyko5ky1" data-path="src/components/PackageDetails.tsx">
                No accommodation information available for this package.
              </div>
            }
          </TabsContent>
          
          <TabsContent value="inclusions" className="pt-4" data-id="ak8idf6i8" data-path="src/components/PackageDetails.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="mk9e2tl4s" data-path="src/components/PackageDetails.tsx">
              <div data-id="wjlmyzm2z" data-path="src/components/PackageDetails.tsx">
                <h3 className="font-bold text-lg mb-3 flex items-center" data-id="lzjmlfnx4" data-path="src/components/PackageDetails.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="c86r9qqif" data-path="src/components/PackageDetails.tsx">
                    <polyline points="20 6 9 17 4 12" data-id="12lfkqt8p" data-path="src/components/PackageDetails.tsx"></polyline>
                  </svg>
                  What's Included
                </h3>
                <ul className="space-y-2" data-id="dr3yr5wic" data-path="src/components/PackageDetails.tsx">
                  {includedServices.map((service, index) =>
                  <li key={index} className="flex items-start" data-id="odtnaqnis" data-path="src/components/PackageDetails.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="6dqjznloo" data-path="src/components/PackageDetails.tsx">
                        <polyline points="20 6 9 17 4 12" data-id="5kiffao06" data-path="src/components/PackageDetails.tsx"></polyline>
                      </svg>
                      <span data-id="5c73rz46p" data-path="src/components/PackageDetails.tsx">{service}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div data-id="rw9lpv79d" data-path="src/components/PackageDetails.tsx">
                <h3 className="font-bold text-lg mb-3 flex items-center" data-id="2kpbp2dmr" data-path="src/components/PackageDetails.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="57a4547x6" data-path="src/components/PackageDetails.tsx">
                    <line x1="18" y1="6" x2="6" y2="18" data-id="pir12ezzo" data-path="src/components/PackageDetails.tsx"></line>
                    <line x1="6" y1="6" x2="18" y2="18" data-id="lgzdhx8cq" data-path="src/components/PackageDetails.tsx"></line>
                  </svg>
                  What's Not Included
                </h3>
                <ul className="space-y-2" data-id="xhhcfu8ts" data-path="src/components/PackageDetails.tsx">
                  {excludedServices.map((service, index) =>
                  <li key={index} className="flex items-start" data-id="yqgyr0uuw" data-path="src/components/PackageDetails.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="bb6afpcsi" data-path="src/components/PackageDetails.tsx">
                        <line x1="18" y1="6" x2="6" y2="18" data-id="xdzwunxkm" data-path="src/components/PackageDetails.tsx"></line>
                        <line x1="6" y1="6" x2="18" y2="18" data-id="i6jz10v0u" data-path="src/components/PackageDetails.tsx"></line>
                      </svg>
                      <span data-id="m8wa2yyoj" data-path="src/components/PackageDetails.tsx">{service}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>);

};

export default PackageDetails;