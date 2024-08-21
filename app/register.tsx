import { BaseLayout } from "@/components/BaseLayout";
import Header from "@/components/Header";
import { Input } from "@/components/Input";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import useFormValidation from "@/hooks/useFormValidation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { User } from "@/schemes/UserScheme";
import { toast } from "@/utils/helpers";
import { validationRules as vr } from "@/utils/validateRules";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useRealm } from "@realm/react";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
// import * as Crypto from "expo-crypto";

export default function RegisterScreen() {
  const color = useThemeColor({}, "text");
  const realm = useRealm();
  const users = useQuery(User);
  const [password, setPassword] = useState("");
  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleRetypePass, setVisibleRetypePass] = useState(false);

  const schema = {
    email: [{ rule: vr.email }],
    password: [{ rule: vr.passwordComplexity }],
    retypePassword: [
      {
        rule: vr.passwordMatch,
        args: [password],
      },
    ],
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      {
        email: "",
        password: "",
        retypePassword: "",
      },
      schema,
      () => onPressSignUp()
    );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const item = users.filtered("email == $0", email);
      if (item?.length === 0) {
        realm.write(() => {
          return realm.create(User, {
            email,
            password,
            name: "",
            phone: "",
            birthday: "",
            photo: "",
            address: "",
          });
        });
        router.push({ pathname: "/response", params: { navTo: "/(auth)" } });
        toast("User sign up successfully!");
      } else {
        toast("This email already exists!");
      }
    },
    [realm]
  );

  const onPressSignUp = useCallback(async () => {
    try {
      await signUp(values.email.toLowerCase(), values.password);
    } catch (error: any) {
      toast(error?.message || "Something wrong, sign up is failed!");
      console.log(`Failed to sign up: ${error?.message}`);
    }
  }, [signUp, values.email, values.password]);

  const handlePassword = (name: string, value: string) => {
    handleChange(name, value);
    setPassword(value);
  };

  useEffect(() => {
    if (realm) {
      realm.subscriptions
        .update((mutableSubs) => {
          mutableSubs.add(realm.objects("User"));
        })
        .then(() => {
          console.log("Flexible Sync subscription created.");
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
        });
    }
  }, [realm]);

  return (
    <BaseLayout enableScroll={true} statusBarStyle="dark-content">
      <Header />
      <View style={{ paddingHorizontal: 40 }}>
        <ThemedText font="medium" type="semiSmall">
          Create your account and enjoy the features Kangtukang
        </ThemedText>
        <ThemedText type="title" font="semiBold">
          Sign Up!
        </ThemedText>
        <ThemedView
          lightColor={Colors.warning}
          darkColor={Colors.warning}
          style={styles.formContainer}>
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder="Your email"
          />
          <Input
            name="password"
            value={values.password}
            onChange={handlePassword}
            onBlur={handleBlur}
            error={errors?.password?.length === 1 && errors.password[0]}
            placeholder="Your password"
            secureTextEntry={!visiblePass}
            suffix={
              <MaterialCommunityIcons
                name={visiblePass ? "eye-off-outline" : "eye-outline"}
                color={color}
                size={24}
                style={{ marginHorizontal: 7 }}
                onPress={() => setVisiblePass(!visiblePass)}
              />
            }
          />
          <Input
            name="retypePassword"
            label="Re-type Password"
            value={values.retypePassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.retypePassword}
            placeholder="Your re-type password"
            secureTextEntry={!visibleRetypePass}
            suffix={
              <MaterialCommunityIcons
                name={visibleRetypePass ? "eye-off-outline" : "eye-outline"}
                color={color}
                size={24}
                style={{ marginHorizontal: 7 }}
                onPress={() => setVisibleRetypePass(!visibleRetypePass)}
              />
            }
          />
          <View style={{ marginHorizontal: 15, marginTop: 28 }}>
            <ThemedButton
              type="primary"
              title="Sign Up"
              onPress={handleSubmit}
            />
            <ThemedText
              font="semiBold"
              style={{ marginVertical: 10 }}
              textAlign="center">
              OR
            </ThemedText>
            <ThemedButton
              mode="sosmed"
              title="Register with Google"
              onPress={handleSubmit}
              preffix={
                <Image
                  source={require("@/assets/images/google.png")}
                  style={{ width: 20, height: 20 }}
                />
              }
              style={{ marginBottom: 10 }}
            />
            <ThemedButton
              mode="sosmed"
              title="Register with Facebook"
              onPress={handleSubmit}
              preffix={
                <Image
                  source={require("@/assets/images/fb.png")}
                  style={{ width: 20, height: 20 }}
                />
              }
              style={{ marginBottom: 10 }}
            />
          </View>
        </ThemedView>
        <ThemedText
          type="small"
          font="medium"
          textAlign="center"
          style={{ paddingHorizontal: 10 }}>
          WasteAway uses your location access to support system performance at
          the time of pickup.
        </ThemedText>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    marginVertical: 30,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  remember: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
});
