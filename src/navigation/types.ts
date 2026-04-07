import type { NavigatorScreenParams } from '@react-navigation/native';

export type LogStackParamList = {
  LogEventMain: undefined;
  TapSession: { mode?: 'relive' } | undefined;
  RefineVibe: undefined;
  PulseSignature: undefined;
  FriendMatch: undefined;
  /** Same compare UI as Discover; stays on Log stack so back returns to crowd match */
  FriendPulseDetail: { friendId: string; flow?: 'log' };
  EventRecommendations: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  FriendPulseDetail: { friendId: string; flow?: 'log' };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  LogEvent: NavigatorScreenParams<LogStackParamList> | undefined;
  Discover: NavigatorScreenParams<DiscoverStackParamList> | undefined;
  Profile: undefined;
};
