
import React from 'react';
import { UserProfile } from '../types';
import Avatar from './Avatar';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelectProfile }) => {
  return (
    <div className="profile-selection-screen">
      <div className="profile-selection-card">
        <h1 className="m3-headline-medium">Scegli il tuo profilo</h1>
        <p className="m3-body-medium text-on-surface-variant">Seleziona un profilo per continuare.</p>
        <div className="profile-list">
          {profiles.map(profile => (
            <button key={profile.id} className="profile-item" onClick={() => onSelectProfile(profile)}>
              <Avatar name={profile.displayName} src={profile.photoURL} size="large" />
              <span className="m3-title-medium">{profile.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;
