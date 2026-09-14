import { Stack } from 'expo-router/stack';

export default function OrderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="historico" />
    </Stack>
  );
}