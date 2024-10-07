import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as z from 'zod';

import { Background, Menu, FormTextArea, FormImageUpload } from '@/components';
import { showFirstAndLastFour } from '@/core';
import {
  useFollowersQuery,
  useFollowingQuery,
  useToggleFollowMutation,
  useUpdateProfileMutation,
  useUserProfileQuery,
} from '@/hooks';
import { useAuth } from '@/hooks';

const profileSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, 'Max file size is 5MB'),
  bio: z.string().max(280).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Custom Skeleton component
const Skeleton: FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

// New component for the profile edit form
const ProfileEditForm: FC<{ profile: { bio?: string } }> = ({ profile }) => {
  const { mutate: updateProfile } = useUpdateProfileMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { isAuthenticated, signIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: profile?.bio,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!isAuthenticated) {
      await signIn();
    }
    updateProfile(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormImageUpload
        label="Profile Picture"
        id="image"
        register={register}
        errors={errors}
        previewImage={previewImage}
        handleImageUpload={handleImageUpload}
      />
      <FormTextArea label="Bio" id="bio" register={register} errors={errors} />
      <button type="submit" className="firelaunch-button">
        Update Profile
      </button>
    </form>
  );
};

type FollowListItemProps = {
  user: {
    id: string;
    name?: string;
  };
  isFollowing?: boolean;
  onToggleFollow?: () => void;
};

const FollowListItem: FC<FollowListItemProps> = ({
  user,
  isFollowing,
  onToggleFollow,
}) => {
  const displayName =
    user.name && user.name.length > 20
      ? `${user.name.slice(0, 20)}...`
      : user.name;

  return (
    <li className="flex items-center justify-between">
      <div>
        <span className="font-bold">{displayName || user.id}</span>
        {user.name && <span className="ml-2 text-gray-500">{user.id}</span>}
      </div>
      {onToggleFollow ? (
        <button
          onClick={onToggleFollow}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            isFollowing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      ) : null}
    </li>
  );
};

type ProfileContentProps = {
  userId: string;
  isOwnProfile: boolean;
};

const ProfileContent: FC<ProfileContentProps> = ({ userId, isOwnProfile }) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    'followers',
  );
  const { data: profile, isLoading: isProfileLoading } =
    useUserProfileQuery(userId);
  const { data: followers, isLoading: isFollowersLoading } =
    useFollowersQuery(userId);
  const { data: following, isLoading: isFollowingLoading } =
    useFollowingQuery(userId);
  const { mutate: followUser } = useToggleFollowMutation();

  if (isProfileLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  // Use default image if user doesn't have a profile picture
  const profileImage = profile?.profileImage || '/android-chrome-192x192.png';

  const isFollowing = (followedId: string) =>
    followers?.some((follower: { id: string }) => follower.id === followedId);

  const handleFollowToggle = (followedId: string, isFollowing: boolean) => {
    followUser({ followedId, isFollowing });
  };

  return (
    <>
      <div className="flex items-center mb-8">
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold">
            {showFirstAndLastFour(profile?.id ?? '')}
          </h2>
          <p className="mt-2 text-gray-300">{profile?.bio || 'No bio yet'}</p>
          {!isOwnProfile && (
            <button
              onClick={() => handleFollowToggle(userId, !!isFollowing(userId))}
              className="firelaunch-button mt-2"
            >
              {isFollowing(userId) ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
      {isOwnProfile && !isProfileLoading ? (
        <ProfileEditForm profile={profile!} />
      ) : null}
      <div className="mt-8">
        <div className="flex space-x-4 mb-4">
          <button
            className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers ({followers?.length ?? 0})
          </button>
          <button
            className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following ({following?.length ?? 0})
          </button>
        </div>
        <div className="mt-4">
          {activeTab === 'followers' && (
            <div>
              {isFollowersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {followers?.map((follower: { id: string; name?: string }) => (
                    <FollowListItem key={follower.id} user={follower} />
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === 'following' && (
            <div>
              {isFollowingLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {following?.map(
                    (followedUser: { id: string; name?: string }) => (
                      <FollowListItem
                        key={followedUser.id}
                        user={followedUser}
                        isFollowing
                        onToggleFollow={() =>
                          handleFollowToggle(followedUser.id, true)
                        }
                      />
                    ),
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const ProfileLayout: FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <main className="relative flex flex-col items-center justify-center min-h-screen min-w-screen text-white">
    <div className="absolute w-full h-full">
      <Background />
    </div>
    <div className="fixed top-0 left-0 w-full z-10">
      <Menu />
    </div>
    <div className="w-full max-w-4xl mx-auto">{children}</div>
  </main>
);

export const Profile = () => {
  const { publicKey, connected } = useWallet();
  const { userId } = useParams<{ userId?: string }>();

  if (!connected) {
    return (
      <ProfileLayout>
        <div className="relative black-blur-background p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="mb-4">
            Please connect your wallet to view your profile.
          </p>
          <WalletMultiButton className="firelaunch-button" />
        </div>
      </ProfileLayout>
    );
  }

  const profileUserId = userId || publicKey?.toBase58() || '';
  const isOwnProfile = profileUserId === publicKey?.toBase58();

  return (
    <ProfileLayout>
      <div className="relative black-blur-background p-8 rounded-lg my-28">
        <ProfileContent userId={profileUserId} isOwnProfile={isOwnProfile} />
      </div>
    </ProfileLayout>
  );
};
