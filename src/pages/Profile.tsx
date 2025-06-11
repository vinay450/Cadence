import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Label from "@/components/ui/label"
import { ArrowLeft, User, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Session } from '@supabase/supabase-js'

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    created_at: '',
    updated_at: ''
  })
  const navigate = useNavigate()

  // Get initial session
  useEffect(() => {
    console.log('Profile component mounted')
    let mounted = true

    const initializeProfile = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      console.log('Initial session check:', currentSession?.user?.id)
      
      if (mounted) {
        setSession(currentSession)
        if (currentSession?.user) {
          console.log('User found in session, getting profile for:', currentSession.user.id)
          await getProfile(currentSession.user.id, currentSession)
        } else {
          console.log('No user in session')
          setLoading(false)
        }
      }
    }

    initializeProfile()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('Auth state changed:', _event, 'User ID:', currentSession?.user?.id)
      
      if (mounted) {
        setSession(currentSession)
        if (currentSession?.user) {
          console.log('User found in auth state change, getting profile for:', currentSession.user.id)
          await getProfile(currentSession.user.id, currentSession)
        } else {
          console.log('No user in auth state change')
          setLoading(false)
        }
      }
    })

    return () => {
      console.log('Cleaning up auth subscription')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const getProfile = async (userId: string, currentSession: Session | null) => {
    try {
      console.log('Starting getProfile for user:', userId)
      
      // First, check if we have a valid session
      if (!currentSession?.user) {
        console.error('No valid session found')
        return
      }

      // Log the current session state
      console.log('Current session state:', {
        userId: currentSession.user.id,
        email: currentSession.user.email,
        metadata: currentSession.user.user_metadata
      })

      // First try to get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error loading profile:', error)
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          console.log('No profile found, creating new profile...')
          const userMetadata = currentSession.user.user_metadata || {}
          console.log('User metadata for profile creation:', userMetadata)
          
          // Extract Google profile data
          const googleProfile = {
            id: userId,
            email: currentSession.user.email,
            full_name: userMetadata.full_name || userMetadata.name || '',
            avatar_url: userMetadata.avatar_url || userMetadata.picture || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          console.log('Attempting to create profile with data:', googleProfile)
          
          // Try to insert the profile
          const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert([googleProfile])
            .select()
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
            
            // If it's a duplicate key error, try to fetch the existing profile
            if (insertError.code === '23505') {
              console.log('Profile already exists, fetching existing profile...')
              const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
              
              if (fetchError) {
                console.error('Error fetching existing profile:', fetchError)
                throw fetchError
              }
              
              if (existingProfile) {
                console.log('Existing profile found:', existingProfile)
                setProfile(existingProfile)
              }
            } else {
              // Log the full error details
              console.error('Unexpected error during profile creation:', {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint
              })
              throw insertError
            }
          } else if (insertData && insertData.length > 0) {
            console.log('Profile created successfully:', insertData[0])
            setProfile(insertData[0])
          } else {
            console.error('Profile creation succeeded but no data returned')
            // Try to fetch the profile again
            const { data: newProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single()
            
            if (fetchError) {
              console.error('Error fetching newly created profile:', fetchError)
              throw fetchError
            }
            
            if (newProfile) {
              console.log('Newly created profile fetched:', newProfile)
              setProfile(newProfile)
            }
          }
        } else {
          console.error('Unexpected error during profile fetch:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw error
        }
      } else if (data) {
        console.log('Existing profile found:', data)
        setProfile(data)
      } else {
        console.log('No profile data returned, attempting to create new profile...')
        // If no data is returned, try to create a new profile
        const userMetadata = currentSession.user.user_metadata || {}
        const googleProfile = {
          id: userId,
          email: currentSession.user.email,
          full_name: userMetadata.full_name || userMetadata.name || '',
          avatar_url: userMetadata.avatar_url || userMetadata.picture || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        console.log('Creating new profile with data:', googleProfile)
        
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert([googleProfile])
          .select()
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
          throw insertError
        }
        
        if (insertData && insertData.length > 0) {
          console.log('Profile created successfully:', insertData[0])
          setProfile(insertData[0])
        }
      }
    } catch (error) {
      console.error('Unexpected error in getProfile:', error)
      alert('Error loading profile. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!session?.user) throw new Error('No user logged in')

      console.log('Updating profile for user:', session.user.id)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }
      console.log('Profile updated successfully')
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile!')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-300">{session.user.email}</p>
            </div>
          </div>

          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-700"
                    placeholder="Your email"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
} 