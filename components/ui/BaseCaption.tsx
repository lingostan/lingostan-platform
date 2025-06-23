import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { ButtonColors } from '../theme/colors';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

interface BaseCaptionnProps {
  title: string,
  desc: string,
  icon: React.ReactNode,
  variant: keyof typeof ButtonColors
}

export const BaseCaption: React.FC<BaseCaptionnProps> = ({ title, desc, icon, variant }) => {
    const { background, shadow }  = ButtonColors[variant];
  return (
    <View style={[styles.container,
        {
            backgroundColor: background,
            boxShadow: `0 4px ${shadow}`
        }
    ]}>
        <View style={styles.left}>
            <BaseText variant='headingM' color='light' style={{opacity: 0.7}}>{title}</BaseText>
            <BaseText variant='subtitle' color='light'>{desc}</BaseText>
        </View>
        <View style={[styles.right,
            {
                borderLeftColor: shadow
            }
        ]}>
            {icon}
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    flex: 1,
    height: 'auto',
    alignItems: 'stretch'

  },
  left: {
    flexDirection: 'column',
    flexGrow: 1,
    padding: 20
  },
  right: {
    width: 60,
    padding: 20,
    borderLeftWidth: 1,
    flexShrink: 0,
    alignContent: 'center',
    verticalAlign: 'middle'
  }
});