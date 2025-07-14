import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CommunityContext = createContext(null);

export const CommunityProvider = ({ children }) => {
    const { toast } = useToast();
    const { getAllUsers } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProfiles = useCallback(() => {
        setLoading(true);
        try {
            const storedProfiles = JSON.parse(localStorage.getItem('mentorship_community_profiles') || '{}');
            const allUsers = getAllUsers().filter(u => u.role === 'student');

            const mergedProfiles = allUsers.map(u => {
                const baseProfile = {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    avatarUrl: u.avatarUrl
                };
                const communityProfile = storedProfiles[u.id] || {};
                return { ...baseProfile, ...communityProfile };
            });

            setProfiles(mergedProfiles);
        } catch (error) {
            console.error("Failed to load profiles:", error);
            toast({ title: 'Erro ao carregar perfis', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, [getAllUsers, toast]);

    useEffect(() => {
        loadProfiles();
    }, [loadProfiles]);

    const updateProfile = (userId, profileData) => {
        try {
            const storedProfiles = JSON.parse(localStorage.getItem('mentorship_community_profiles') || '{}');
            const updatedProfile = { ...(storedProfiles[userId] || {}), ...profileData };
            
            const newProfiles = { ...storedProfiles, [userId]: updatedProfile };
            localStorage.setItem('mentorship_community_profiles', JSON.stringify(newProfiles));
            
            // Force a reload of all profiles to ensure consistency everywhere
            loadProfiles(); 
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast({ title: 'Erro ao atualizar perfil', variant: 'destructive' });
        }
    };

    const getProfile = (userId) => {
        // This function now gets the most up-to-date data from the state
        return profiles.find(p => p.id === userId) || null;
    };

    const value = {
        profiles,
        loading,
        updateProfile,
        getProfile,
        reloadProfiles: loadProfiles,
    };

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => {
    const context = useContext(CommunityContext);
    if (!context) {
        throw new Error('useCommunity must be used within a CommunityProvider');
    }
    return context;
};