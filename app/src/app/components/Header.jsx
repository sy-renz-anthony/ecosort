import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image
} from "react-native";
import logo from "@/assets/images/ecosort-logo-square-small.png";

const HeaderComponent =({subTitle})=>{
    return(
        <View className="flex flex-row h-fit items-start bg-teal-800 shadow-sm border-b border-gray-100 pt-3">
                <View className="flex bg-white rounded-full border-2 border-teal-800 p-5 ml-2 mb-[-15]">
                    <Image source={logo} style={{ width: 30, height: 30 }} />
                </View>
                <View className="flex-1 mx-5">
                    <Text className=" text-white font-bold text-3xl">
                        Ecosort
                    </Text>
                    <Text className="mb-2 text-white text-sm">
                        {subTitle}
                    </Text>
                </View>
        </View>
    );
}

export default HeaderComponent;