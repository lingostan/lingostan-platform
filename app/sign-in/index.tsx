import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet, Platform } from "react-native";

import { BaseInput } from "@/components/ui/BaseInput";
import { BaseText } from "@/components/ui/BaseText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { api } from "@/services/https";
import { LoginParams } from "@/types/auth/model";
import { saveTokens } from "@/utils/secure";

export default function SignIn() {
  const { control, handleSubmit } = useForm<LoginParams>();

  const router = useRouter();

  const onSubmit = async (data: LoginParams) => {
    const { data: payload } = await api.post<{
      access_token: string;
      refresh_token: string;
    }>("/auth/login", data);

    if (Platform.OS !== "web") {
      await saveTokens(payload.access_token, payload.refresh_token);
    } else {
      window.localStorage.setItem("access_token", payload.access_token);
    }

    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" color="main" style={styles.title}>
        Авторизация
      </BaseText>

      <Controller
        control={control}
        name="email"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Email"
            onChangeText={onChange}
            value={value || ""}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Пароль"
            onChangeText={onChange}
            value={value || ""}
          />
        )}
      />

      <PrimaryButton title="Войти" onPress={handleSubmit(onSubmit)} fluid />

      <PrimaryButton
        title="Нет аккаунта? Зарегистрируйтесь"
        mode="transparent"
        variant="blue"
        size="small"
        onPress={() => router.push("/sign-up")}
        fluid
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
});
