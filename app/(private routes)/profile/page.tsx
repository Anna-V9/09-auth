import type { Metadata } from "next";
import css from "./Profile.module.css";

export const metadata: Metadata = {
  title: "NoteHub - Profile",
  description: "User profile page in NoteHub",
  openGraph: {
    title: "NoteHub - Profile",
    description: "User profile page in NoteHub",
    url: "https://yourdomain.com/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

const ProfilePage = () => {
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          {/* за умовою саме <a>, не Link */}
          <a href="" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src="https://ac.goit.global/fullstack/react/avatar-default.jpg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: your_email@example.com</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;