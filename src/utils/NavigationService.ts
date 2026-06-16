import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

type PendingNavigation = {
  type: 'navigate' | 'replace' | 'reset';
  name: string;
  params?: object;
} | null;

// 👉 Queue rakhenge jab tak navigation ready nahi hota
let pendingNavigation: PendingNavigation = null;

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  } else {
    console.log("⏳ Navigation not ready, queuing:", name);
    pendingNavigation = { type: 'navigate', name, params };
  }
}

export function replace(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  } else {
    console.log("⏳ Navigation not ready, queuing replace:", name);
    pendingNavigation = { type: 'replace', name, params };
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name as any, params: params as any }],
    });
  } else {
    console.log("⏳ Navigation not ready, queuing reset:", name);
    pendingNavigation = { type: 'reset', name: name as any, params: params as any  };
  }
}

// ✅ Call this from AllRoutes after NavigationContainer mounts
export function processPendingNavigation() {
  if (pendingNavigation && navigationRef.isReady()) {
    const { type, name, params } = pendingNavigation;

    if (type === 'navigate') {
      navigationRef.navigate(name, params);
    } else if (type === 'replace') {
      navigationRef.dispatch(StackActions.replace(name, params));
    } else if (type === 'reset') {
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }

    pendingNavigation = null;
  }
}
