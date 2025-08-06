import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Shield, Users, Heart, Star, MapPin } from 'lucide-react';
import medicalHero from '@/assets/medical-hero.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Comprehensive Directory",
      description: "Access detailed profiles of healthcare professionals in your area"
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description: "Find doctors by city, hospital, or specialty with advanced filtering"
    },
    {
      icon: Heart,
      title: "Verified Professionals",
      description: "All doctor profiles are verified and regularly updated"
    },
    {
      icon: Star,
      title: "Professional Management",
      description: "Doctors can manage their profiles and availability status"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
                CareGuide Pro
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Your comprehensive medical directory platform. Connect patients with qualified healthcare professionals and streamline medical practice management.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <Button
                  onClick={() => navigate('/directory')}
                  variant="default"
                  size="lg"
                  className="flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  View Directory
                </Button>
                
                <Button
                  onClick={() => navigate('/doctor-auth')}
                  variant="medical"
                  size="lg"
                  className="flex items-center gap-3"
                >
                  <Stethoscope className="w-5 h-5" />
                  Doctor Portal
                </Button>
                
                <Button
                  onClick={() => navigate('/admin-auth')}
                  variant="hero"
                  size="lg"
                  className="flex items-center gap-3"
                >
                  <Shield className="w-5 h-5" />
                  Admin Portal
                </Button>
              </div>
            </div>
            
            <div className="lg:order-last">
              <div className="relative">
                <img
                  src={medicalHero}
                  alt="Medical professionals"
                  className="w-full h-[400px] object-cover rounded-2xl shadow-medical"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Why Choose CareGuide Pro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for modern healthcare, our platform bridges the gap between medical professionals and efficient practice management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-medical text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of healthcare professionals already using CareGuide Pro to manage their practice and connect with patients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/doctor-auth')}
              variant="secondary"
              size="lg"
              className="flex items-center gap-3"
            >
              <Stethoscope className="w-5 h-5" />
              Join as Doctor
            </Button>
            
            <Button
              onClick={() => navigate('/admin-auth')}
              variant="outline"
              size="lg"
              className="flex items-center gap-3 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Shield className="w-5 h-5" />
              Admin Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 CareGuide Pro. Built for healthcare excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;