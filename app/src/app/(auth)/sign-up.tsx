import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

//This is how to apply native wind styling to SafeAreaView
const SafeAreaView = styled(RNSafeAreaView);



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import loadingOverlay from "../components/LoadingOverlay.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import axiosInstance from "@/axiosConfig.js";
import Toast from "react-native-toast-message";


const InputWithIcon = ({ icon, placeholder, value, setValue, secure = false, keyboardType = "default" }) => (
  <View className="flex-row mb-4">
    <View className="border border-blue-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
      <MaterialIcons name={icon} size={28} color="#ffa500" />
    </View>
    <View className="flex-1 border border-blue-300 border-l-0 rounded-lg px-4 py-1">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className="text-gray-800"
      />
    </View>
  </View>
);

export default function signup() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");


  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async() => {
    setIsLoading(true);
    
    if(!address || address.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Address!',
        text2: 'Please Input your Address!'
      });
      setIsLoading(false);
      return;
    }

    
    if(!contact || contact.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Contact Number!',
        text2: 'Please input your Contact Number'
      });
      setIsLoading(false);
      return;
    }
    if(!lastName || lastName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Last Name!',
        text2: 'Please input your Last Name'
      });
      setIsLoading(false);
      return;
    }
    if(!middleName || middleName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Middle Name!',
        text2: 'Please input your Middle Name'
      });
      setIsLoading(false);
      return;
    }
    if(!firstName || firstName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid First Name!',
        text2: 'Please input your First Name'
      });
      setIsLoading(false);
      return;
    }
    if(!email || email.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Email!',
        text2: 'Please input your email address'
      });
      setIsLoading(false);
      return;
    }
    if(!userName || userName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid User Name!',
        text2: 'Please input your User Name'
      });
      setIsLoading(false);
      return;
    }

    try{
      const data={
        "userName": userName,
        "emailAddress": email,
        "firstName": firstName,
        "middleName": middleName,
        "lastName": lastName,
        "contactNumber": contact,
        "address": address,
      }
      const response = await axiosInstance.post("/users/register", data, {withCredentials: true});
        if(!response.data.success){
            Toast.show({
              type: 'error',
              text1: '❌ Error while registering new User Account!',
              text2: response.data.message
            });
        }else{
            Toast.show({
              type: 'success',
              text1: '✅ User Account registered!',
              text2: "Please check your email for your default password"
            });
            router.push('/');
        }
    }catch(error){
      console.log("Error while registering new User Account! - "+error.message);
      if(error.response.data.message){
        console.log(error.response.data.message);
      }
      Toast.show({
        type: 'error',
        text1: '❌ Error while registering new User Account!',
        text2: error.response.data.message
      });
    }
    setIsLoading(false);
  };

  return (
    
    <SafeAreaView className="flex-1 bg-white">
      {isLoading && loadingOverlay()}
      <KeyboardAvoidingView
              behavior="height"
              className="flex-1"
      >
        <ScrollView
              contentContainerClassName="px-10 pt-8 justify-start flex-grow min-h-full pb-28"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
        >
          
          <View className="my-8">
            <Text className="text-3xl font-bold text-center text-gray-800">
              Create an Ecosort Account
            </Text>
            <Text className="text-center text-gray-500 mt-2">
              Arduino based, Smart IOT-Device for Waste Sorting and Management System
            </Text>
          </View>
          <View className="my-8 gap-3">
            <Text className="border border-blue-300 px-5 py-3">Choose your Unique User Name for logging in and your email address for account verification and retrieval</Text>
            <InputWithIcon icon="person" placeholder="User Name" value={userName} setValue={setUsername} keyboardType="any" />
            <InputWithIcon icon="email" placeholder="Email Address" value={email} setValue={setEmail} keyboardType="email-address" />
          </View>
            <Text className="text-xl font-bold text-center text-gray-800 mb-5">
              Your Personal Info
            </Text>
          <InputWithIcon icon="person" placeholder="First Name" value={firstName} setValue={setFirstName} />
          <InputWithIcon icon="person-outline" placeholder="Middle Name" value={middleName} setValue={setMiddleName} />
          <InputWithIcon icon="person" placeholder="Last Name" value={lastName} setValue={setLastName} />
          <InputWithIcon icon="phone" placeholder="Contact Number" value={contact} setValue={setContact} keyboardType="phone-pad" />
          
          <View className="my-8">
            <Text className="text-xl font-bold text-center text-gray-800 mb-5">
              Your Address
            </Text>
            <View className="flex-row mb-4">
              <View className="border border-blue-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <MaterialIcons name="home" size={28} color="#ffa500" />
              </View>
              <View className="flex-1 border border-blue-300 border-l-0 rounded-lg px-4 py-1">
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street / Block / House No. , Barangay, Municipality, Province"
                  autoCapitalize="none"
                  className="text-gray-800"
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleSignup}
            className="bg-teal-800 py-4 rounded-lg mt-4 mb-6"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-10">
            <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold">
                    Login
                  </Text>
                </TouchableOpacity>
              </Link>

          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
    
  );
}

