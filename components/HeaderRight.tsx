import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Image, TouchableOpacity } from "react-native";
import ModalAlert from "./ModalAlert";
import { useModal } from "@/hooks/useModal";

const HeaderRight = (props: any) => {
  const { showModal } = useModal();

  const signOut = () => {};

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
