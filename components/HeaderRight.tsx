import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Image, TouchableOpacity } from "react-native";
import ModalAlert from "./ModalAlert";
import { useModal } from "@/hooks/useModal";
import { router } from "expo-router";
import { useAuth } from "@realm/react";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

const HeaderRight = (props: any) => {
  const { setProfile, setLogIn } = useUserStore() as unknown as UserStoreType;
  const { showModal, hideModal } = useModal();
  const { logOut } = useAuth();

  const signOut = () => {
    logOut();
    setProfile({});
    setLogIn(false);
    router.replace("/");
    hideModal();
  };

  const handleSignOut = () => {
    showModal(
      <ModalAlert
        onConfirm={signOut}
        message="Are you sure you want to log out?"
        title="Log Out Session"
        labelConfirm="Yes, do it"
        labelCancel="Cancel"
        type="delete"
      />
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => handleSignOut()}>
      <Image
        {...props}
        style={{
          height: responsiveHeight(24),
          width: responsiveWidth(68),
        }}
        source={require("@/assets/images/Logout.png")}
      />
    </TouchableOpacity>
  );
};

export default HeaderRight;
