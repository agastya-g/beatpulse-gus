import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { FriendMatchScreen } from '../screens/FriendMatchScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PulseSignatureScreen } from '../screens/PulseSignatureScreen';
import { RefineVibeScreen } from '../screens/RefineVibeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { TapSessionScreen } from '../screens/TapSessionScreen';
import { colors } from '../theme';
import type {
  DiscoverStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.surface,
    primary: colors.accent,
  },
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeStack.Screen
        name="TapSession"
        component={TapSessionScreen}
        options={{ title: 'Listen + tap' }}
      />
      <HomeStack.Screen name="RefineVibe" component={RefineVibeScreen} options={{ title: 'Refine' }} />
      <HomeStack.Screen
        name="PulseSignature"
        component={PulseSignatureScreen}
        options={{ title: 'Pulse signature' }}
      />
      <HomeStack.Screen name="FriendMatch" component={FriendMatchScreen} options={{ title: 'Crowd' }} />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <SearchStack.Screen name="SearchMain" component={SearchScreen} options={{ title: 'Search' }} />
    </SearchStack.Navigator>
  );
}

function DiscoverStackNavigator() {
  return (
    <DiscoverStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <DiscoverStack.Screen
        name="DiscoverMain"
        component={DiscoverScreen}
        options={{ title: 'Discover' }}
      />
    </DiscoverStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
    </ProfileStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: '#2a3148',
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="explore" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
