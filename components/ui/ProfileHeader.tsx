import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { SettingsIcon } from '@/components/icons/SettingsIcon';

interface ProfileHeaderProps {
  title: string;
  avatarSource: any;
  name: string;
  email: string;
  registrationDate: string;
  friendsCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  title,
  avatarSource,
  name,
  email,
  registrationDate,
  friendsCount
}) => {
  return (
    <>
      <View style={styles.header}>
        <BaseText variant="subtitle" color="secondary" style={styles.title}>
          {title}
        </BaseText>
        <SettingsIcon />
      </View>

      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          resizeMode="cover"
          source={avatarSource}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoBody}>
          <BaseText variant='subtitle' style={styles.infoName}>{name}</BaseText>
          <BaseText variant='body' style={styles.infoEmail} color='secondary'>{email}</BaseText>
          <BaseText variant='caption' style={styles.infoDate} color='secondary'>
            Регистрация: {registrationDate}
          </BaseText>
          <BaseText variant='bodyBold' style={styles.infoFriends}>{friendsCount} друзей</BaseText>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 10,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    marginBottom: 20
  },
  title: {
    alignSelf: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
    color: '#ccc',
  },
  avatarContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 20
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
  },
  infoBody: {
    flexDirection: 'column',
    gap: 2
  },
  infoName: {
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  infoEmail: {
    // Styles for email
  },
  infoDate: {
    // Styles for date
  },
  infoFriends: {
    color: 'rgb(33, 150, 243)'
  },
}); 