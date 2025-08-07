import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Building2, 
  Clock, 
  User,
  LogOut,
  Filter
} from 'lucide-react';

interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  city: string | null;
  hospital: string | null;
  speciality: string | null;
  years_of_experience: number | null;
  availability: string | null;
  opd: string | null;
  notes: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

const DoctorDirectory = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchDoctors();
  }, [user, navigate]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedCity, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching doctors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(doctor => doctor.city === selectedCity);
    }

    if (selectedSpecialty && selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor => doctor.speciality === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const uniqueCities = Array.from(new Set(doctors.map(d => d.city).filter(Boolean)));
  const uniqueSpecialties = Array.from(new Set(doctors.map(d => d.speciality).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Loading Doctors...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Available Doctors ({filteredDoctors.length})</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <Button onClick={signOut} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, specialty, or hospital"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city!}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {uniqueSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty!}>
                    {specialty?.charAt(0).toUpperCase() + specialty?.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                <CardContent className="p-4">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage 
                        src={doctor.profile_photo_url || ''} 
                        alt={doctor.full_name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-sm">
                        {doctor.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        {doctor.full_name}
                      </h3>
                      {doctor.speciality && (
                        <p className="text-blue-600 text-xs mt-0.5 capitalize">
                          {doctor.speciality.replace('-', ' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-2 mb-4">
                    {doctor.hospital && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>
                    )}
                    
                    {doctor.city && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{doctor.city}</span>
                      </div>
                    )}
                    
                    {doctor.opd && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{doctor.opd}</span>
                      </div>
                    )}
                    
                    {doctor.years_of_experience && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{doctor.years_of_experience} years experience</span>
                      </div>
                    )}

                    {/* Availability Badge */}
                    {doctor.availability && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 capitalize">
                          {doctor.availability.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {doctor.phone_number && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(doctor.phone_number!)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      
                      <Button
                        onClick={() => handleWhatsApp(doctor.phone_number!)}
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 h-9 text-xs"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDirectory;