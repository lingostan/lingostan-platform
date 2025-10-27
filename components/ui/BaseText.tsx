import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

type TextVariant =
  | 'displayXL'
  | 'displayL'
  | 'headingM'
  | 'subtitle'
  | 'bodyBold'
  | 'body'
  | 'caption'
  | 'label';

type TextColor = 'primary' | 'main' | 'secondary' | 'light' | 'green' | 'red';

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
  style?: TextStyle;
}

export const BaseText: React.FC<TextProps> = ({
  variant = 'body',
  color = 'main',
  children,
  style,
}) => {
  const getFontSize = () => {
    switch (variant) {
      case 'displayXL':
        return 32;
      case 'displayL':
        return 28;
      case 'headingM':
        return 24;
      case 'subtitle':
        return 20;
      case 'bodyBold':
      case 'body':
        return 17;
      case 'caption':
        return 14;
      case 'label':
        return 12;
    }
  };

  const getFontWeight = () => {
    if (variant === 'bodyBold') return '700';
    if (['displayXL', 'displayL', 'headingM'].includes(variant)) return '600';
    return '400';
  };

  const getColor = () => {
    switch (color) {
      case 'primary':
        return '#58cc02'; // Duolingo green
      case 'main':
        return 'rgb(60, 60, 60)';
      case 'secondary':
        return 'rgb(119, 119, 119)';
      case 'light':
        return '#ffffff';
      case 'green':
        return 'rgb(88, 167, 0)';
      case 'red':
        return 'rgb(234, 43, 43)';
    }
  };

  const textStyles: TextStyle = {
    fontSize: getFontSize(),
    fontWeight: getFontWeight() as any,
    color: getColor(),
    flexWrap: 'wrap',
    width: '100%',
    lineHeight: Math.floor(getFontSize() * 1.4),
  };

  return <RNText style={[textStyles, style]}>{children}</RNText>;
};
