import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, UserCheck, Clock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const DoctorAuth = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      navigate('/doctor-dashboard');
    }
  }, [user, profile, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 pb-safe">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Doctor Portal
          </CardTitle>
          <CardDescription>
            Sign in with Google to access your medical practice dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 text-base"
            variant="outline"
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Account Approval Required</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  After signing in, your account will need admin approval before you can complete your profile and access the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 mb-1">Next Steps</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Once approved, you'll be able to complete your professional profile with qualifications, experience, and availability details.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAuth;