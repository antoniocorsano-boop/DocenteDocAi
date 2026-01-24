// LEGACY - MD3 Non-compliant

import React from 'react';
import { UserProfile } from '../types';
import { Avatar } from './ui';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelectProfile }) => {
  return (
    <div >
      <div >
        <h1 >Scegli il tuo profilo</h1>
        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Seleziona un profilo per continuare.</p>
        <div >
          {profiles.map(profile => (
            <button key={profile.id}  onClick={() => onSelectProfile(profile)}>
              <Avatar name={profile.displayName} src={profile.photoURL} size="lg" />
              <span >{profile.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;



