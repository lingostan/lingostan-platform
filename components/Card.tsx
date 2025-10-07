import classNames from 'classnames';
import { View, Text, Pressable } from 'react-native';


type CardProps = {
    content: unknown | string
    isActive?: boolean
}

export const Card = ({ content, isActive }: CardProps) => {

    const borderColor = classNames({ 'border-[#bde0fe]':isActive , 'border-[#ccffcc]': !isActive })
    return(
        <Pressable className={`border-b-[4px] border-[1px] ${borderColor} rounded-[8px] pt-[30px] pb-[30px] pr-20 pl-20`}>
            <View>
                <Text>
                    {content}
                </Text>
            </View>
        </Pressable>
    )

}
