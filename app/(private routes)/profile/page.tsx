import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import css from './Profile.module.css';
import { getCurrentUser } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'NoteHub - Profile',
  description: 'User profile page in NoteHub',
  openGraph: {
    title: 'NoteHub - Profile',
    description: 'User profile page in NoteHub',
    url: 'https://yourdomain.com/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

const ProfilePage = async () => {
  
  const user = await getCurrentUser();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          {}
          <Link
            href="/profile/edit"
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          {}
          <Image
            src="https://ac.goit.global/fullstack/react/avatar-default.jpg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username ?? '—'}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
