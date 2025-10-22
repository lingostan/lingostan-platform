import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { PrimaryButton } from './PrimaryButton';

interface InviteCardProps {
  icon: any;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

export const InviteCard: React.FC<InviteCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  onPress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.icon} source={icon} />
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <BaseText variant='bodyBold' color="main">{title}</BaseText>
          </View>
          <View style={styles.descriptionContainer}>
            <BaseText variant='body' color='secondary'>
              {description}
            </BaseText>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton 
          variant='blue' 
          title={buttonText} 
          onPress={onPress} 
          fluid={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 4,
  },
  descriptionContainer: {
    marginBottom: 0,
  },
  buttonContainer: {
    width: '100%',
  },
}); 