
import React from 'react';
import { UserProfile } from '../types';
import { Avatar } from './ui';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelectProfile }) => {
  return (
    <div className="profile-selection-screen">
      <div className="profile-selection-card">
        <h1 className="m3-headline-medium">Scegli il tuo profilo</h1>
        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">Seleziona un profilo per continuare.</p>
        <div className="profile-list">
          {profiles.map(profile => (
            <button key={profile.id} className="profile-item" onClick={() => onSelectProfile(profile)}>
              <Avatar name={profile.displayName} src={profile.photoURL} size="lg" />
              <span className="m3-title-medium">{profile.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;
