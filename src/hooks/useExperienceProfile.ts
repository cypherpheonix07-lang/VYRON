/**
 * Hook to consume and observe the active Persona Experience Profile
 */

import { useState, useEffect } from "react";
import { experienceProfileService, type ExperienceProfile } from "@/services/persona/experienceProfileService";

export function useExperienceProfile() {
  const [profile, setProfile] = useState<ExperienceProfile>(() =>
    experienceProfileService.getLocalProfile()
  );

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ExperienceProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(experienceProfileService.getLocalProfile());
      }
    };

    window.addEventListener("vyron:experience_profile_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("vyron:experience_profile_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateProfile = (newProfile: ExperienceProfile) => {
    experienceProfileService.saveLocalProfile(newProfile);
    setProfile(newProfile);
  };

  return { profile, updateProfile };
}
