import { Platform, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { useRealm } from "@realm/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import { router, useLocalSearchParams } from "expo-router";
import { Input } from "@/components/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useFormValidation from "@/hooks/useFormValidation";
import { validationRules as vr } from "@/utils/validateRules";
import { hexToRgba, toast } from "@/utils/helpers";
import { ThemedButton } from "@/components/ThemedButton";
import Divider from "@/components/Divider";
import { User } from "@/schemes/UserScheme";
import { Textarea } from "@/components/Textarea";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useUserActions } from "@/services/useUserActions";

export default function UpdateProfileScreen() {
  const { profile, setProfile } = useUserStore() as unknown as UserStoreType;
  const { id, title } = useLocalSearchParams();
  const realm = useRealm();
  const { updateUser, getUserById } = useUserActions();
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];
  const [password, setPassword] = useState("");
  const [visibleCurrentPass, setVisibleCurrentPass] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleRetypePass, setVisibleRetypePass] = useState(false);

  const schema =
    Number(id) === 1
      ? {
          currentPassword: [{ rule: vr.required }],
          password: [{ rule: vr.passwordComplexity }],
          retypePassword: [
            {
              rule: vr.passwordMatch,
              args: [password],
            },
          ],
        }
      : Number(id) === 2
      ? {
          phone: [{ rule: vr.required }, { rule: vr.number }],
        }
      : {
          name: [{ rule: vr.required }],
          address: [{ rule: vr.required }],
          photo: [{ rule: vr.required }],
        };

  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      Number(id) === 1
        ? {
            currentPassword: "",
            password: "",
            retypePassword: "",
          }
        : Number(id) === 2
        ? { phone: profile?.phone ?? "" }
        : {
            name: profile?.name ?? "",
            photo: profile?.photo ?? "",
            address: profile?.address ?? "",
          },
      schema,
      () => {
        if (Number(id) === 1) {
          onPassword();
        } else if (Number(id) === 2) {
          onPhone();
        } else if (Number(id) === 3) {
          onProfile();
        }
      }
    );

  const userMemo = useMemo(() => {
    return getUserById(profile!._id.toString());
  }, [getUserById, profile]);

  const handleChangePassword = useCallback(
    async (currentPassword: string, password: string) => {
      if (userMemo) {
        if (userMemo.password !== currentPassword) {
          toast("This current password is incorrect!");
        } else {
          updateUser(userMemo!._id.toString(), {
            password,
            updatedAt: new Date(),
          });
          toast("The password has been successfully updated!");
          router.back();
        }
      }
    },
    [realm, userMemo]
  );

  const handleChangePhone = useCallback(
    async (phone: string) => {
      if (userMemo) {
        updateUser(userMemo!._id.toString(), {
          phone,
          updatedAt: new Date(),
        });
        toast("The phone number has been successfully updated!");
        router.back();
      }
    },
    [realm, userMemo]
  );

  const handleChangeProfile = useCallback(
    async (name: string, address: string, photo: string) => {
      if (userMemo) {
        updateUser(userMemo!._id.toString(), {
          name,
          address,
          photo,
          updatedAt: new Date(),
        });
        toast("The profile has been successfully updated!");
        router.back();
      }
    },
    [realm, userMemo]
  );

  const onPassword = useCallback(async () => {
    try {
      await handleChangePassword(values.currentPassword, values.password);
    } catch (error: any) {
      toast(error?.message || "Something wrong!");
      console.log(`Failed to sign up: ${error?.message}`);
    }
  }, [handleChangePassword, values.currentPassword, values.password]);

  const onPhone = useCallback(async () => {
    try {
      await handleChangePhone(values.phone);
    } catch (error: any) {
      toast(error?.message || "Something wrong!");
      console.log(`Failed to sign up: ${error?.message}`);
    }
  }, [handleChangePhone, values.phone]);

  const onProfile = useCallback(async () => {
    try {
      await handleChangeProfile(values.name, values.address, values.photo);
    } catch (error: any) {
      toast(error?.message || "Something wrong!");
      console.log(`Failed to sign up: ${error?.message}`);
    }
  }, [handleChangeProfile, values.name, values.address, values.photo]);

  const handlePassword = (name: string, value: string) => {
    handleChange(name, value);
    setPassword(value);
  };

  const handlePhoneNumber = (name: string, value: string) => {
    const cleanedInput = value.replace(/^0/, "");
    handleChange(name, cleanedInput);
  };

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(User));
    });
  }, [realm]);

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          {title?.toString()}
        </ThemedText>
      </View>
      <View
        style={{
          ...styles.order,
          backgroundColor: theme.background,
        }}>
        <View style={styles.orderItem}>
          {Number(id) === 1 ? (
            <>
              <Input
                label="Current Password"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.currentPassword}
                secureTextEntry={!visibleCurrentPass}
                placeholder="Your current password"
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                suffix={
                  <MaterialCommunityIcons
                    name={
                      visibleCurrentPass ? "eye-off-outline" : "eye-outline"
                    }
                    color={theme.text}
                    size={24}
                    style={{ marginHorizontal: 7 }}
                    onPress={() => setVisibleCurrentPass(!visibleCurrentPass)}
                  />
                }
              />
              <Input
                label="New Password"
                name="password"
                value={values.password}
                onChange={handlePassword}
                onBlur={handleBlur}
                error={errors?.password?.length === 1 && errors.password[0]}
                placeholder="Your password"
                secureTextEntry={!visiblePass}
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                suffix={
                  <MaterialCommunityIcons
                    name={visiblePass ? "eye-off-outline" : "eye-outline"}
                    color={theme.text}
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
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                suffix={
                  <MaterialCommunityIcons
                    name={visibleRetypePass ? "eye-off-outline" : "eye-outline"}
                    color={theme.text}
                    size={24}
                    style={{ marginHorizontal: 7 }}
                    onPress={() => setVisibleRetypePass(!visibleRetypePass)}
                  />
                }
              />
            </>
          ) : Number(id) === 2 ? (
            <Input
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handlePhoneNumber}
              onBlur={handleBlur}
              error={errors.phone}
              placeholder="Your phone number"
              style={{ borderColor: hexToRgba(theme.border, 0.5) }}
              keyboardType={
                Platform.OS === "ios" ? "phone-pad" : "name-phone-pad"
              }
              preffix={<ThemedText style={{ marginLeft: 7 }}>+62</ThemedText>}
            />
          ) : (
            <>
              <Input
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                placeholder="Your full name"
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
              />
              <Textarea
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address}
                placeholder="Your address"
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
              />
              <Input
                label="Photo"
                name="photo"
                value={values.photo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.photo}
                placeholder="Only your link photo"
                style={{ borderColor: hexToRgba(theme.border, 0.5) }}
              />
            </>
          )}
          <Divider height={20} />
          <ThemedButton type="primary" title="Update" onPress={handleSubmit} />
          <Divider height={20} />
        </View>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.warning,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingBottom: 70,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  order: {
    marginTop: -50,
    marginHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
  },
  orderItem: {
    // flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  orderAddress: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 125,
  },
  menu: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: Colors.warning,
  },
  menuItem: {
    marginTop: 20,
    marginLeft: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
