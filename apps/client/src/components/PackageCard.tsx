import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Check } from 'lucide-react';

export interface PackageCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  destination: string;
  imageUrl: string;
  flightIncluded: boolean;
  hotelIncluded: boolean;
  carIncluded: boolean;
  rating: number;
  discount?: number;
  featured?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  title,
  description,
  price,
  duration,
  destination,
  imageUrl,
  flightIncluded,
  hotelIncluded,
  carIncluded,
  rating,
  discount,
  featured
}) => {
  const navigate = useNavigate();
  const { addToCart, items } = useCartContext();

  const finalPrice = discount ? price - price * discount / 100 : price;

  const cartItem = {
    id: Number(id),
    type: 'package' as const,
    title: title,
    image: imageUrl,
    price: Number(finalPrice),
    quantity: 1,
    details: {
      title,
      description,
      duration,
      destination,
      flightIncluded,
      hotelIncluded,
      carIncluded,
      rating,
      discount
    }
  };

  const isInCart = items.some((item) => item.id === cartItem.id && item.type === cartItem.type);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(cartItem);
    }
  };

  const handleViewDetails = () => {
    navigate(`/package-details/${id}`);
  };

  return (
    <Card className={`overflow-hidden h-full transition-all duration-300 hover:shadow-lg ${featured ? 'border-primary border-2' : ''}`} data-id="ol894f8cm" data-path="src/components/PackageCard.tsx">
      <div className="relative h-48 overflow-hidden" data-id="upajxt5ed" data-path="src/components/PackageCard.tsx">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover" data-id="hpi6o021s" data-path="src/components/PackageCard.tsx" />

        {featured &&
          <div className="absolute top-2 right-2" data-id="xx9cm8g4a" data-path="src/components/PackageCard.tsx">
            <Badge variant="secondary" className="bg-primary text-white" data-id="hqr42n6ls" data-path="src/components/PackageCard.tsx">Featured</Badge>
          </div>
        }
        {discount &&
          <div className="absolute top-2 left-2" data-id="rdndm1m3y" data-path="src/components/PackageCard.tsx">
            <Badge variant="destructive" data-id="73zihrude" data-path="src/components/PackageCard.tsx">{discount}% OFF</Badge>
          </div>
        }
      </div>

      <CardHeader className="pb-2" data-id="fubccgm9i" data-path="src/components/PackageCard.tsx">
        <div className="flex justify-between items-start" data-id="wqxx0yl4o" data-path="src/components/PackageCard.tsx">
          <CardTitle className="text-xl font-bold" data-id="ef9n8764l" data-path="src/components/PackageCard.tsx">{title}</CardTitle>
          <div className="flex items-center" data-id="7fdhkp58e" data-path="src/components/PackageCard.tsx">
            <span className="text-yellow-500 mr-1" data-id="islkkmj43" data-path="src/components/PackageCard.tsx">★</span>
            <span className="text-sm font-medium" data-id="rid8ql4u1" data-path="src/components/PackageCard.tsx">{rating}</span>
          </div>
        </div>
        <CardDescription className="text-sm" data-id="8qhil5qrt" data-path="src/components/PackageCard.tsx">{destination} • {duration}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3" data-id="vnzn6ezab" data-path="src/components/PackageCard.tsx">
        <p className="text-muted-foreground text-sm line-clamp-2" data-id="zvdvvoubu" data-path="src/components/PackageCard.tsx">{description}</p>

        <div className="flex space-x-2" data-id="o7caej1q0" data-path="src/components/PackageCard.tsx">
          {flightIncluded &&
            <Badge variant="outline" className="bg-blue-50" data-id="qntosf1by" data-path="src/components/PackageCard.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="14xaua9ju" data-path="src/components/PackageCard.tsx">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-id="1t0cdcy9o" data-path="src/components/PackageCard.tsx"></path>
              </svg>
              Flight
            </Badge>
          }

          {hotelIncluded &&
            <Badge variant="outline" className="bg-green-50" data-id="nodkvmz8l" data-path="src/components/PackageCard.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="x6wave2f3" data-path="src/components/PackageCard.tsx">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" data-id="60bypena4" data-path="src/components/PackageCard.tsx"></path>
                <polyline points="9 22 9 12 15 12 15 22" data-id="53elgrud7" data-path="src/components/PackageCard.tsx"></polyline>
              </svg>
              Hotel
            </Badge>
          }

          {carIncluded &&
            <Badge variant="outline" className="bg-amber-50" data-id="8fx2vwpz7" data-path="src/components/PackageCard.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="v1o6338vp" data-path="src/components/PackageCard.tsx">
                <rect x="1" y="3" width="15" height="13" data-id="2gx2rhre1" data-path="src/components/PackageCard.tsx"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" data-id="w02v9ialg" data-path="src/components/PackageCard.tsx"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5" data-id="15gzez1w4" data-path="src/components/PackageCard.tsx"></circle>
                <circle cx="18.5" cy="18.5" r="2.5" data-id="bfyuj4hbu" data-path="src/components/PackageCard.tsx"></circle>
              </svg>
              Car
            </Badge>
          }
        </div>
      </CardContent>

      <Separator data-id="f93nh8elx" data-path="src/components/PackageCard.tsx" />

      <CardFooter className="pt-4 flex justify-between items-center" data-id="4kerqv2kc" data-path="src/components/PackageCard.tsx">
        <div data-id="bjm34ycd8" data-path="src/components/PackageCard.tsx">
          {discount ?
            <div className="flex items-baseline space-x-2" data-id="2t0x5c23x" data-path="src/components/PackageCard.tsx">
              <span className="text-lg font-bold text-primary" data-id="c4zudy8fg" data-path="src/components/PackageCard.tsx">${finalPrice.toFixed(2)}</span>
              <span className="text-sm line-through text-muted-foreground" data-id="m22eohbgm" data-path="src/components/PackageCard.tsx">${price.toFixed(2)}</span>
            </div> :

            <span className="text-lg font-bold text-primary" data-id="7wvcld506" data-path="src/components/PackageCard.tsx">${price.toFixed(2)}</span>
          }
          <p className="text-xs text-muted-foreground" data-id="60mwkom8i" data-path="src/components/PackageCard.tsx">per person</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`${isInCart
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-black'
              } font-medium px-4 py-2 rounded-md transition-colors`}
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="text-aerotrav-blue border-aerotrav-blue hover:bg-aerotrav-blue hover:text-white px-4 py-2 rounded-md transition-colors"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>);

};

export default PackageCard;