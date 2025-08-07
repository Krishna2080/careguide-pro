import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Search, Users, Trash2, Filter } from 'lucide-react';

interface Doctor {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  city?: string;
  hospital?: string;
  speciality?: string;
  years_of_experience?: number;
  availability?: string;
  opd?: string;
  notes?: string;
  profile_photo_url?: string;
}

const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/admin-auth');
      return;
    }

    if (profile && profile.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchDoctors();
  }, [user, profile, navigate]);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, cityFilter, specialtyFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');

      if (error) throw error;

      setDoctors(data || []);
      toast({
        title: "Data Loaded",
        description: `Found ${data?.length || 0} doctors`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
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
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    if (specialtyFilter && specialtyFilter !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.speciality?.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  };

  const deleteDoctor = async (doctorId: string, doctorName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', doctorId);

      if (error) throw error;

      setDoctors(prev => prev.filter(doc => doc.id !== doctorId));
      
      toast({
        title: "Doctor Deleted",
        description: `${doctorName} has been removed from the system`,
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const uniqueCities = [...new Set(doctors.map(doc => doc.city).filter(Boolean))];
  const uniqueSpecialties = [...new Set(doctors.map(doc => doc.speciality).filter(Boolean))];

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {doctors.length} Doctors
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {profile.full_name}</span>
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find doctors by name, city, or specialty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search by Name or Email</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city-filter">Filter by City</Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city!}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty-filter">Filter by Specialty</Label>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All specialties</SelectItem>
                    {uniqueSpecialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty!}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-all duration-300">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={doctor.profile_photo_url} alt={doctor.full_name} />
                    <AvatarFallback className="text-lg">
                      {doctor.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                  <CardDescription className="text-sm">{doctor.email}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {doctor.speciality && (
                      <div>
                        <span className="font-medium">Specialty:</span>
                        <p className="text-muted-foreground capitalize">{doctor.speciality}</p>
                      </div>
                    )}
                    
                    {doctor.city && (
                      <div>
                        <span className="font-medium">City:</span>
                        <p className="text-muted-foreground">{doctor.city}</p>
                      </div>
                    )}
                    
                    {doctor.hospital && (
                      <div>
                        <span className="font-medium">Hospital:</span>
                        <p className="text-muted-foreground">{doctor.hospital}</p>
                      </div>
                    )}
                    
                    {doctor.years_of_experience && (
                      <div>
                        <span className="font-medium">Experience:</span>
                        <p className="text-muted-foreground">{doctor.years_of_experience} years</p>
                      </div>
                    )}
                  </div>
                  
                  {doctor.availability && (
                    <div className="pt-2">
                      <Badge variant="secondary" className="capitalize">
                        {doctor.availability.replace('-', ' ')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-center pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Doctor
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete{' '}
                            <strong>{doctor.full_name}</strong>'s profile and remove all their data from the system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDoctor(doctor.id, doctor.full_name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Doctor
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;