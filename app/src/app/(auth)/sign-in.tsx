import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Link, router, Redirect } from "expo-router";
import loadingOverlay from "../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/images/ecosort-logo.png";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

//This is how to apply native wind styling to SafeAreaView
const SafeAreaView = styled(RNSafeAreaView);

export default function signin() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { token, isLoading: authLoading, login, logout } = useAuth();
  
  
  useEffect(() => {
    
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axiosInstance.post("/users/check-token", {}, { withCredentials: true });
          
          if (!response.data.success) {
            await logout();
          }else{
            //router.push("../(tabs)/index");
            //router.replace('../(tabs)');
            //await login(token);
            await logout();
          }
        } catch (error) {
          console.log("Token validation failed:", error.message);
        }
      }
    };
    verifyToken();
  }, [token]);
  

  if (authLoading) 
      return null;

  const handleLogin = async() => {
      setIsLoading(true);
        if(!userName||userName.length<1){
            Toast.show({
                type: 'error',
                text1: '❌ Invalid User Name!',
                text2: 'Please Input your User Name'
            });
            setIsLoading(false);
            return;
        }
        if(!password||password.length<1){
            Toast.show({
                type: 'error',
                text1: '❌ Invalid Password!',
                text2: 'Please Input your Password'
            });
            setIsLoading(false);
            return;
        }
        try{
        const data={
            "userName": userName,
            "password": password
        }
        const response = await axiosInstance.post("/users/login", data, {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                type: 'error',
                text1: '❌ Error while trying to login!',
                text2: response.data.message
                });
            }else{
                Toast.show({
                type: 'success',
                text1: '✅ Login successfully!',
                text2: ""
                });
                await login(response.data.token);
                router.push("../(tabs)/");
                router.replace('../(tabs)/');
            }
        }catch(error){
            if(error.response && error.response.status == 401){
              Toast.show({
                  type: 'error',
                  text1: '❌ Unauthorized!',
                  text2: error.response.data.message
              });
            }else{
              console.log("Error while logging in! - "+error.message);
              Toast.show({
                  type: 'error',
                  text1: '❌ Error while logging in!',
                  text2: error.message
              });
            }
        }
        setIsLoading(false);
  };

  

  return (
    <SafeAreaView className="flex flex-1 justify-center py-auto">
      {isLoading && loadingOverlay()}
      
      <KeyboardAvoidingView
        behavior="height"
        className="flex-1"
      >
      <ScrollView
        contentContainerClassName="px-10 pt-8 justify-start flex-grow min-h-full pb-35"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10">
            <View className="flex w-full h-auto items-center mb-10">
              <Image source={logo} style={{ width: 230, height: 230 }}  className="p-5 border border-teal-500 rounded-full shadow"/>
            </View>
            <Text className="text-3xl font-bold text-center text-black mb-2">
                Ecosort
            </Text>
            
          <Text className="text-center text-gray-500 mt-2">
            Welcome Back, Login to your account
          </Text>
        </View>

        <View className="relative w-full h-auto flex flex-row mb-4">
            <View className="border border-blue-300 border-l-1 mr-[-3] rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <MaterialIcons name="account-circle" size={30} color="#ffa500" />
            </View>
          
          <View className="flex-1 border border-blue-300 border-l-0 rounded-lg px-4 py-1">
            <TextInput
                value={userName}
                onChangeText={setUsername}
                placeholder="Enter your User Name"
                keyboardType="default"
                autoCapitalize="none"
                className="w-full mx-auto text-gray-800"
            />
          </View>
          
        </View>

        <View className="relative w-full h-auto flex flex-row mb-4">
            <View className="border border-blue-300 border-l-1 mr-[-3] rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <MaterialIcons name="lock" size={30} color="#ffa500" />
            </View>
          <View className="flex-1 border border-blue-300 border-l-0 border-r-0 px-4 py-1">
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                className="w-full mx-auto text-gray-800"
            />
          </View>
          <TouchableOpacity className="border border-blue-300 border-l-0 mr-[-3] rounded-tr-lg rounded-br-lg justify-center items-center px-2" onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons 
              name={showPassword ? "visibility" : "visibility-off"} 
              size={24} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        </View>

        <Link href="/OTPrequest" asChild>
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-blue-600 font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-teal-800 py-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don’t have an account? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}