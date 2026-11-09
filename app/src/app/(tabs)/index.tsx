import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  BackHandler,
  Image,
  ScrollView
} from "react-native";

import { MaterialIcons, AntDesign, Foundation, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router, Redirect, useFocusEffect } from "expo-router";
import loadingOverlay from "../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import DeviceCard from "../components/DeviceCard";
import HeaderComponent from "../components/Header";



const insights = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceOnlineCount, setDeviceOnlineCount] = useState(null);
  
  useEffect(()=>{
          const interval = setInterval(() => {
              setIsLoading(true);
              reloadData();
              setIsLoading(false);
          }, 10000);
          return () => clearInterval(interval);
  }, []);
  
  const reloadData = async()=>{
        try{
            const response = await axiosInstance.get("/devices/status-count", {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Error while retrieving your Bin Devices!',
                    text2: response.data.message
                });
                setDeviceOnlineCount(null);
                //setDevices([]);
            }else{
                setDeviceOnlineCount(response.data.data);
                //setDevices(response.data.data);
            }
        }catch(error){
            console.log("Error while retrieving your Devices! - "+error.message);
            console.log(JSON.stringify(error));
            Toast.show({
                type: 'error',
                text1: '❌ Error while retrieving your Bin Devices!',
                text2: error?.response?.data.message
            });
            setDevices([]);
        }
  }

  const [notification, setNotification] = useState({
    visible: true,
    title: "Bin #000-01 Reached Capacity",
    message: "Biodegradable compartment is full and requires immediate collection.",
  });

  const deviceStats = {
    online: 0,
    offline: 3,
    total: 3,
  };

  const weeklyActivity = {
    totalCollections: 0,
    biodegradable: 0,
    nonBiodegradable: 0,
    ewaste: 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
    {isLoading && loadingOverlay()}
      <ScrollView className="flex-1 px-4 pt-2 pb-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Smart Waste Management
            </Text>
            <Text className="text-3xl font-extrabold text-gray-900">
              EcoSort
            </Text>
          </View>
          <TouchableOpacity className="bg-teal-50 p-3 rounded-full border border-teal-100">
            <Feather name="bell" size={20} color="#0f766e" />
          </TouchableOpacity>
        </View>


        {/* Notification Card */}
        {notification.visible && (
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center space-x-3 flex-1">
                <View className="bg-amber-100 p-2 rounded-xl">
                  <Ionicons name="warning-outline" size={22} color="#b45309" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold text-amber-900">
                    {notification.title}
                  </Text>
                  <Text className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    {notification.message}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setNotification({ ...notification, visible: false })}
                className="p-1"
              >
                <Ionicons name="close" size={18} color="#b45309" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Device Connectivity Status */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-800 mb-3">
            Device Status
          </Text>
          <View className="flex-row gap-3">
            {/* Online Card */}
            <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
              <View className="bg-emerald-50 p-3 rounded-xl mr-3">
                <MaterialCommunityIcons name="wifi" size={24} color="#059669" />
              </View>
              <View>
                <Text className="text-2xl font-black text-emerald-700">
                  {deviceOnlineCount ? JSON.stringify(deviceOnlineCount[0]?.value) : 0 }
                </Text>
                <Text className="text-xs font-medium text-gray-500">Online Bins</Text>
              </View>
            </View>

            {/* Offline Card */}
            <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
              <View className="bg-rose-50 p-3 rounded-xl mr-3">
                <MaterialCommunityIcons name="wifi-off" size={24} color="#e11d48" />
              </View>
              <View>
                <Text className="text-2xl font-black text-rose-700">
                  {deviceOnlineCount ? JSON.stringify(deviceOnlineCount[1]?.value) : 0 }
                </Text>
                <Text className="text-xs font-medium text-gray-500">Offline Bins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Activity Summary */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-gray-800">
              This Week's Activity
            </Text>
            <Text className="text-xs font-semibold text-teal-700">
              {weeklyActivity.totalCollections} Total Collections
            </Text>
          </View>

          <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            {/* Bio Row */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="bg-green-100 p-2 rounded-lg mr-3">
                  <MaterialCommunityIcons name="leaf" size={18} color="#15803d" />
                </View>
                <Text className="text-sm font-semibold text-gray-700">Biodegradable</Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {weeklyActivity.biodegradable}
              </Text>
            </View>

            {/* Non-Bio Row */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="bg-orange-100 p-2 rounded-lg mr-3">
                  <MaterialCommunityIcons name="candy" size={18} color="#c2410c" />
                </View>
                <Text className="text-sm font-semibold text-gray-700">Non-Biodegradable</Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {weeklyActivity.nonBiodegradable}
              </Text>
            </View>

            {/* E-Waste Row */}
            <View className="flex-row justify-between items-center pt-2.5">
              <View className="flex-row items-center">
                <View className="bg-red-100 p-2 rounded-lg mr-3">
                  <MaterialCommunityIcons name="integrated-circuit-chip" size={18} color="#b91c1c" />
                </View>
                <Text className="text-sm font-semibold text-gray-700">E-Waste</Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {weeklyActivity.ewaste}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity className="bg-teal-800 py-4 rounded-2xl shadow-md items-center flex-row justify-center space-x-2 mb-6">
          <Ionicons name="trash-bin" size={20} color="white" />
          <Link className="text-white font-bold text-base ml-2" href={"/(tabs)/bins"}>
            Check Bin Devices
          </Link>
        </TouchableOpacity>
      </ScrollView>        
    </SafeAreaView>
  );
};

export default insights;
