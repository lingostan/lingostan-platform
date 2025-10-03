import React from 'react'
import { View, StyleSheet } from 'react-native'
import { opacity } from 'react-native-reanimated/lib/typescript/Colors'

import { ButtonColors } from '../theme/colors'

import { BaseText } from './BaseText'

interface BaseCaptionnProps {
  title: string
  desc: string
  icon: React.ReactNode
  variant: keyof typeof ButtonColors
}

export const BaseCaption: React.FC<BaseCaptionnProps> = ({
  title,
  desc,
  icon,
  variant,
}) => {
  const { background, shadow } = ButtonColors[variant]
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
          boxShadow: `0 4px ${shadow}`,
        },
      ]}
    >
      <View style={styles.left}>
        <BaseText variant="headingM" color="light" style={{ opacity: 0.7 }}>
          {title}
        </BaseText>
        <BaseText variant="subtitle" color="light">
          {desc}
        </BaseText>
      </View>
      <View
        style={[
          styles.right,
          {
            borderLeftColor: shadow,
          },
        ]}
      >
        {icon}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    borderRadius: 16,
    flexDirection: 'row',
    flex: 1,
    height: 'auto',
  },
  left: {
    flexDirection: 'column',
    flexGrow: 1,
    padding: 20,
  },
  right: {
    alignContent: 'center',
    borderLeftWidth: 1,
    flexShrink: 0,
    padding: 20,
    verticalAlign: 'middle',
    width: 60,
  },
})
