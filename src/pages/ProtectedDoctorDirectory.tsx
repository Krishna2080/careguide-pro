import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

const ProtectedDoctorDirectory = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Only admins can access the doctor directory
  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-900">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The doctor directory is only accessible to authorized administrators.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                ← Back to Home
              </Button>
              <Button onClick={() => navigate('/admin-auth')} variant="default">
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If admin, redirect to admin dashboard where directory is accessible
  navigate('/admin-dashboard');
  return null;
};

export default ProtectedDoctorDirectory;