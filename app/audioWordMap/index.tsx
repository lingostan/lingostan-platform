import { Button, View, ScrollView } from "react-native";
import { lakWords } from "./constants/lang";
import { Card } from "@/components/Card";
import { SafeAreaView } from 'react-native-safe-area-context';
import { shuffleArray } from "@/utils/helpers";
import { ReactNode } from "react";

export default function AudioWordMap () {

  return (
      <ScrollView 
          className="flex-1 bg-[#222222]">
        <SafeAreaView  className="bg-white h-full flex-row w-full p-[20]">
          <View className="flex-col gap-8 mr-8">
            {shuffleArray<ReactNode>(lakWords.map(({ nativeLang }) => <Card key={nativeLang} content={nativeLang} />))}
          </View>
          <View className="flex-col gap-8">
            {shuffleArray<ReactNode>(lakWords.map(({ translate }) => <Card  key={translate} content={translate} />))}
          </View>
    </SafeAreaView>
  </ScrollView>
  )
}
