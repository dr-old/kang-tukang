import { BaseLayout } from "@/components/BaseLayout";
import { Checkbox } from "@/components/Checkbox";
import Header from "@/components/Header";
import { Input } from "@/components/Input";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import useFormValidation from "@/hooks/useFormValidation";
import { useSession } from "@/hooks/useSession";
import { useThemeColor } from "@/hooks/useThemeColor";
import { User } from "@/schemes/UserScheme";
import { useUserStore } from "@/stores/user/userStore";
import { toast } from "@/utils/helpers";
import { UserStoreType } from "@/utils/types";
import { validationRules as vr } from "@/utils/validateRules";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useRealm } from "@realm/react";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const schema = {
  email: [{ rule: vr.email }],
  password: [{ rule: vr.passwordComplexity }],
};

export default function LoginScreen() {
  const { setProfile, setLogIn } = useUserStore() as unknown as UserStoreType;
  const { signIn } = useSession();
  const color = useThemeColor({}, "text");
  const realm = useRealm();
  const users = useQuery(User);
  const [visiblePass, setVisiblePass] = useState(false);
  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      {
        password: "",
        email: "",
        remember: "",
      },
      schema,
      () => onPressSignIn()
    );

  const handleSignIn = useCallback(
    (email: string, password: string) => {
      const item = users.filtered("email == $0", email);

      if (item?.length === 0) {
        toast("This email was not found!");
      } else {
        if (item[0].password !== password) {
          toast("This password is wrong!");
        } else {
          const user = item[0];
          setProfile({
            _id: user._id,
            birthday: user.birthday,
            createdAt: user.createdAt,
            email: user.email,
            name: user.name,
            phone: user.phone,
            photo: user.photo,
            address: user.address,
            role: user.role,
            updatedAt: user.updatedAt,
          });
          setLogIn(true);
          toast("Log in is successfull!");
          router.replace("/");
        }
      }
    },
    [realm]
  );

  const onPressSignIn = useCallback(async () => {
    try {
      await handleSignIn(values.email.toLowerCase(), values.password);
    } catch (error: any) {
      toast(`Failed to log in: ${error?.message}`);
    }
  }, [signIn, values.email, values.password]);

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
          Welcome back
        </ThemedText>
        <ThemedText type="title" font="semiBold">
          Log In!
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
            onChange={handleChange}
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
          <View style={styles.remember}>
            <Checkbox
              name="acceptTerms"
              checked={values.acceptTerms}
              value="accepted"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.acceptTerms}
              label="Remember this device"
            />
            <ThemedText font="medium" type="small">
              Forgot password?
            </ThemedText>
          </View>
          <View style={{ marginHorizontal: 15 }}>
            <ThemedButton
              type="primary"
              title="Log In"
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
              title="Continue with Google"
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
              title="Continue with Facebook"
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
