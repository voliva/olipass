import React from 'react';
import Icon from 'react-native-ionicons';

import Colors from '../constants/Colors';

interface Props {
    focused: boolean;
}

export default (icon: string) => ({focused}: Props) =>
    <Icon
        name={icon}
        size={26}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
