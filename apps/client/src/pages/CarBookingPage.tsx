import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { getCarById, Car } from "@/services/carService"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/LoadingSpinner"

const CarBookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [car, setCar] = useState<Car | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "Malaysia (+60)",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
    gender: "female",
    countryOfResidence: "",
  })

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        const carData = await getCarById(id)
        if (!carData) {
          toast({
            title: "Error",
            description: "Car not found",
            variant: "destructive",
          })
          navigate("/car-rentals")
          return
        }
        setCar(carData)
      } catch (error) {
        console.error("Error fetching car details:", error)
        toast({
          title: "Error",
          description: "Failed to load car details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarDetails()
  }, [id, navigate, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add validation here
    navigate(`/car-payment/${id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Car not found</h2>
            <Button 
              className="mt-4"
              onClick={() => navigate("/car-rentals")}
            >
              Back to Car Rentals
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Car Details and Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={car.images[0] || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60'} 
                alt={`${car.make} ${car.model}`}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{car.seats} seats</span>
                  <span>•</span>
                  <span>{car.transmission}</span>
                  <span>•</span>
                  <span>{car.luggage_capacity} bags</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Pickup Location:</span>
                  <p className="text-sm text-gray-600">{car.location_city}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold">Driver Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Input
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      name="dateOfBirth.day"
                      value={formData.dateOfBirth.day}
                      onChange={handleInputChange}
                      placeholder="Day"
                      required
                    />
                    <Input
                      name="dateOfBirth.month"
                      value={formData.dateOfBirth.month}
                      onChange={handleInputChange}
                      placeholder="Month"
                      required
                    />
                    <Input
                      name="dateOfBirth.year"
                      value={formData.dateOfBirth.year}
                      onChange={handleInputChange}
                      placeholder="Year"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    defaultValue={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="countryOfResidence">Country of Residence</Label>
                  <Input
                    id="countryOfResidence"
                    name="countryOfResidence"
                    value={formData.countryOfResidence}
                    onChange={handleInputChange}
                    placeholder="Country of Residence"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Price Breakdown */}
          <div>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Car Price Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Car hire charge</span>
                  <span>MYR {car.daily_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit</span>
                  <span>MYR {Math.round(car.daily_rate * 0.3)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>MYR {car.daily_rate + Math.round(car.daily_rate * 0.3)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>MYR {car.daily_rate + Math.round(car.daily_rate * 0.3)}</span>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary text-white mt-6"
                  onClick={handleSubmit}
                >
                  Continue to Payment
                </Button>
              </div>
            </Card>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span>Free cancellation up to 24 hours before pickup</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span>No credit card fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span>24/7 pickup available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CarBookingPage