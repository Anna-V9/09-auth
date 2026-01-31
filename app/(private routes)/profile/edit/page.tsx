'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { getMe, updateMe } from '@/lib/api/clientApi';
import type { User } from '@/types/user';
import { useAuthStore } from '@/lib/store/authStore';

const EditProfilePage = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [username, setUsername] = useState<string>(user?.username || '');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  
  useEffect(() => {
    async function fetchUser() {
      try {
        const data: User = await getMe();
        setUsername(data.username);
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    }

    if (!user) {
      fetchUser();
    } else {
      setUsername(user.username);
      setLoading(false);
    }
  }, [user, setUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const updatedUser: User = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile'); 
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <p>Email: {user?.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;