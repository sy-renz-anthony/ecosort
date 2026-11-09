import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

//This is how to apply native wind styling to SafeAreaView
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
//import { useNotification } from "@/context/NotificationContext";


const bins =()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [devices, setDevices] = useState([]);
    const [showNewDeviceModal, setShowNewDeviceModal] = useState(false);
    const [newDeviceID, setNewDeviceID] = useState("");
    const [newDeviceLocation, setNewDeviceLocation] = useState("");
    //const {expoPushToken, notification, error} = useNotification();

    useEffect(()=>{
        const interval = setInterval(() => {
            setIsLoading(true);
            reloadData();
            setIsLoading(false);
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    /*
    useEffect(() => {
        const checkNotificationToken = async()=>{
            if (expoPushToken) {
                const data={expoPushNotificationToken: expoPushToken};
                await axiosInstance.put("/user/set-notification-token", data, { withCredentials: true });
            }
        }

        checkNotificationToken();
      }, [expoPushToken]);*/


      useFocusEffect(
        useCallback(() => {
          const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => true
          );
    
          return () => subscription.remove();
        }, [])
      );

    const pressEventHandler = async(device)=>{
        router.push({
            pathname: "./bins/[id]",
            params: { deviceID: device.deviceID },
        }); 
        setDevices([]);
    }

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

    const handleAddDeviceEvent=async()=>{
        setShowNewDeviceModal(true);
    }

    const confirmAddNewDevice = async () => {
        setShowNewDeviceModal(false);
        setIsLoading(true);
        try{
            const data={"deviceID": newDeviceID, "location": newDeviceLocation};
            const response = await axiosInstance.post("/devices/register", data,  {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Bin Registration Failed!',
                    text2: response.data.message
                });
                setShowNewDeviceModal(true);
            }else{
                Toast.show({
                    type: 'success',
                    text1: '✅ New Bin added!',
                    text2: ""
                });
                setNewDeviceID("");
                setNewDeviceLocation("");
                await reloadData();
            }
        }catch(error){
            console.log("Error while retrieving your User Account! - "+error.message);
            Toast.show({
                    type: 'error',
                    text1: '❌ Bin Regsitration Failed!',
                    text2: error.response.data.message
            });
            setNewDeviceID("");
        }
        setIsLoading(false);
    };

    const cancelAddNewDevice = () => {
        setNewDeviceID("");
        setShowNewDeviceModal(false);
    };

    /*
    //this is part of the notification functionality
    if(error){
        return <View>Error: {error.message}</View>;
    }*/

    
    return(
        <SafeAreaView className="flex-1 bg-gray-100">
            {isLoading && loadingOverlay()}
            
            <HeaderComponent subTitle={'Garbage Bin Status'} />
            <View className="flex w-fit self-end my-3">
                <TouchableOpacity
                    onPress={handleAddDeviceEvent}
                    className="flex flex-row gap-2 bg-blue-600 py-3 px-4 rounded-lg mx-6"
                >
                    <MaterialIcons name={"add-circle"} size={15} color="white" />
                    <Text className="text-white text-center font-semibold text-sm">
                        Bin Device
                    </Text>
                </TouchableOpacity>
            </View>

            
            
            {devices.length>0 && <FlatList className="mb-20"
                    data={devices}
                    keyExtractor={(item) => item.deviceID}
                    renderItem={({ item }) => <DeviceCard device={item} pressEventHandler={pressEventHandler} />}
                    contentContainerStyle={{ paddingBottom: 16 }}
                >
                    
                </FlatList>} 
            
            <Modal
                visible={showNewDeviceModal}
                transparent
                animationType="fade"
                onRequestClose={cancelAddNewDevice}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white rounded-lg p-6 w-80">
                    <Text className="text-lg font-bold text-center mb-4">Add New Bin Device</Text>
                    <Text className="text-center mb-6">Input the New Bin Device ID to add it to your account</Text>
                    <View className="flex-row mb-10">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <AntDesign name={"barcode"} size={28} color="#ffa500" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={newDeviceID}
                                onChangeText={setNewDeviceID}
                                placeholder="Bin ID"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>

                    <View className="flex-row mb-10">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <Foundation name={"clipboard-notes"} size={28} color="#ffa500" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={newDeviceLocation}
                                onChangeText={setNewDeviceLocation}
                                placeholder="Bin Description"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>

                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            onPress={cancelAddNewDevice}
                            className="bg-gray-300 py-2 px-4 rounded-lg"
                        >
                            <Text className="text-center text-black font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmAddNewDevice}
                            className="bg-blue-600 py-2 px-4 rounded-lg"
                        >
                            <Text className="text-center text-white font-semibold">Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

export default bins;
