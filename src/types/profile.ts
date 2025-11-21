export interface Profile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  dob: string;
  role: string;
  gender: string;
  phone: string;
  address: string;
  bio: string;
  socials: {
    linkedin: string | null;
    twitter: string | null;
    github: string | null;
  };
}
