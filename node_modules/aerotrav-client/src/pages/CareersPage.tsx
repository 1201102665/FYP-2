import React from 'react';
import { Briefcase, MapPin, Clock, Users, Heart, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CareersPage: React.FC = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Travel Consultant",
      department: "Customer Experience",
      location: "Kuala Lumpur, Malaysia",
      type: "Full-time",
      description: "Join our team to help customers plan their dream vacations with expert travel advice and personalized service."
    },
    {
      id: 2,
      title: "Full Stack Developer",
      department: "Technology",
      location: "Remote / Kuala Lumpur",
      type: "Full-time",
      description: "Build and maintain our travel platform using modern web technologies. Experience with React and Node.js preferred."
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Kuala Lumpur, Malaysia",
      type: "Full-time",
      description: "Drive our digital marketing campaigns across multiple channels to reach and engage travel enthusiasts worldwide."
    },
    {
      id: 4,
      title: "Business Analyst",
      department: "Operations",
      location: "Kuala Lumpur, Malaysia",
      type: "Full-time",
      description: "Analyze travel industry trends and customer data to help make strategic business decisions."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness", 
      description: "Comprehensive medical coverage and wellness programs"
    },
    {
      icon: Zap,
      title: "Travel Perks",
      description: "Employee discounts on flights, hotels, and travel packages"
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Collaborative environment with team building activities"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    }
  ];

  return (
    <div className="page-layout bg-gray-50">
      <Header />
      
      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-aerotrav-blue to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-aerotrav-blue-100 max-w-2xl mx-auto">
              Build the future of travel with us. Explore exciting career opportunities 
              and be part of a team that's passionate about making travel accessible to everyone.
            </p>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With AeroTrav?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We believe in creating an environment where our team can thrive, grow, and make a meaningful impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-aerotrav-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover opportunities to grow your career in the travel industry.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {jobOpenings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                      <Button className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Current Openings Message (when job list is empty) */}
            {jobOpenings.length === 0 && (
              <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="p-12">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Current Openings</h3>
                  <p className="text-gray-600 mb-6">
                    We don't have any job openings at the moment, but we're always looking for talented individuals 
                    to join our team. Feel free to send us your resume!
                  </p>
                  <Button className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
                    Send Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Contact for Career Inquiries */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Don't See the Right Role?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  We're always interested in meeting talented people. Even if we don't have an opening 
                  that matches your skills right now, we'd love to hear from you.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Send your resume to:</p>
                    <p className="text-aerotrav-blue">careers@aerotrav.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">Or call us:</p>
                    <p className="text-aerotrav-blue">+60 1-8321-1296</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage; 