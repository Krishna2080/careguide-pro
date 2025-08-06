import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

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

    if (selectedCity) {
      filtered = filtered.filter(doctor => doctor.city === selectedCity);
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.speciality === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber: string) => {
    // Remove any non-digit characters and format for WhatsApp
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Doctor Directory</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button onClick={signOut} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, specialty, or hospital"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All cities</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city!}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All specialties</SelectItem>
                    {uniqueSpecialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty!}>
                        {specialty?.charAt(0).toUpperCase() + specialty?.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage 
                        src={doctor.profile_photo_url || ''} 
                        alt={doctor.full_name}
                      />
                      <AvatarFallback className="text-lg">
                        {doctor.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                      {doctor.speciality && (
                        <Badge variant="secondary" className="text-xs">
                          {doctor.speciality.charAt(0).toUpperCase() + doctor.speciality.slice(1).replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {doctor.hospital && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.hospital}</span>
                      </div>
                    )}
                    
                    {doctor.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.city}</span>
                      </div>
                    )}
                    
                    {doctor.years_of_experience && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.years_of_experience} years experience</span>
                      </div>
                    )}
                    
                    {doctor.availability && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.availability.charAt(0).toUpperCase() + doctor.availability.slice(1).replace('-', ' ')}</span>
                      </div>
                    )}
                    
                    {doctor.opd && (
                      <div className="text-xs text-muted-foreground">
                        <strong>OPD:</strong> {doctor.opd}
                      </div>
                    )}
                  </div>
                  
                  {doctor.phone_number && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(doctor.phone_number!)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      
                      <Button
                        onClick={() => handleWhatsApp(doctor.phone_number!)}
                        variant="default"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </div>
                  )}
                  
                  {doctor.notes && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <strong>Notes:</strong> {doctor.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No doctors found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorDirectory;