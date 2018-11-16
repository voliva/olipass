import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

interface Props {
    focused: boolean;
}

export default (icon: string) => ({focused}: Props) =>
    <Ionicons
        name={icon}
        size={26}
        style={{ marginBottom: -3 }}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
