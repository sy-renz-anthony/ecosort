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
  Image
} from "react-native";

import { MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import { Link, router, Redirect, useFocusEffect } from "expo-router";
import loadingOverlay from "../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import DeviceCard from "../components/DeviceCard";
import HeaderComponent from "../components/Header";



const insights = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  
  useEffect(()=>{
          const interval = setInterval(() => {
              setIsLoading(true);
              reloadData();
              setIsLoading(false);
          }, 20000);
          
          return () => clearInterval(interval);
      }, []);
  
  const reloadData = async()=>{
        try{
            const response = await axiosInstance.get("/devices/all", {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Error while retrieving your Bin Devices!',
                    text2: response.data.message
                });
                setDevices([]);
            }else{
                setDevices(response.data.data);
            }
        }catch(error){
            console.log("Error while retrieving your Devices! - "+error.message);
            console.log(JSON.stringify(error));
            Toast.show({
                type: 'error',
                text1: '❌ Error while retrieving your Bin Devices!',
                text2: error.response.data.message
            });
            setDevices([]);
        }
  }



  return (
    <SafeAreaView className="flex-1 bg-gray-100">
    {isLoading && loadingOverlay()}
    <HeaderComponent subTitle={'Bin Activity History'} />
            

            
            
            {/*devices.length>0 && <FlatList className="mb-20"
                    data={devices}
                    keyExtractor={(item) => item.deviceID}
                    renderItem={({ item }) => <DeviceCard device={item} pressEventHandler={pressEventHandler} />}
                    contentContainerStyle={{ paddingBottom: 16 }}
                >
                    
                </FlatList>*/} 
            
            

        </SafeAreaView>
  );
};

export default insights;
