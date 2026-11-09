import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

//This is how to apply native wind styling to SafeAreaView
const SafeAreaView = styled(RNSafeAreaView);

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  BackHandler
} from "react-native";

import { MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import { Link, router, Redirect, useFocusEffect, useLocalSearchParams  } from "expo-router";
import loadingOverlay from "../../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import HeaderComponent from "../../components/Header";
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

const MetricCard = ({ title, value,  iconName, color }) => (
  <View className="w-full p-2 mt-2">
    <View className={`flex-col items-center justify-center p-3 rounded-xl shadow-sm border border-gray-100 ${color}`}>
      <MaterialCommunityIcons name={iconName} size={24} color="#374151" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-gray-800 text-center">
          {value? "Full!" : "Ok!"}
        </Text>
        
      </View>
      <Text className="text-xs text-center text-gray-700">{title}</Text>
    </View>
  </View>
);


const binDetails =()=>{
  const { deviceID } = useLocalSearchParams();

    
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState(null);
    const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
    const [newDeviceID, setNewDeviceID] = useState("");
    const [newDeviceLocation, setNewDeviceLocation] = useState("");

    useEffect(()=>{
        const interval = setInterval(() => {
            setIsLoading(true);
            reloadData();
            setIsLoading(false);
        }, 20000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(()=>{
        setIsLoading(true);
        reloadData();
        setIsLoading(false);
    }, [device]);


      useFocusEffect(
        useCallback(() => {
          const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => true
          );
    
          return () => subscription.remove();
        }, [])
      );


    const reloadData = async()=>{
      
        try{
            const data = {"deviceID": deviceID, "location": ""}
            const response = await axiosInstance.post("/devices/search", data, {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Error while retrieving your Bin Devices!',
                    text2: response.data.message
                });
                setDevice(null);
            }else{
                setDevice(response.data.data[0]);
            }
        }catch(error){
            console.log("Error while retrieving your Devices! - "+error.message);
            console.log(JSON.stringify(error));
            Toast.show({
                type: 'error',
                text1: '❌ Error while retrieving your Bin Devices!',
                text2: error.response.data.message
            });
            setDevice(null);
        }
    }

    const handleEditDeviceEvent=async()=>{
        setNewDeviceID(device.deviceID);
        setNewDeviceLocation(device.location);
        setShowEditDeviceModal(true);
    }

    const confirmEditDevice = async () => {
        setShowEditDeviceModal(false);
        setIsLoading(true);
        try{
            const data={"deviceID": newDeviceID, "location": newDeviceLocation};
            const response = await axiosInstance.put(`/devices/update/`+device._id, data,  {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Bin Update Failed!',
                    text2: response.data.message
                });
                setShowNewDeviceModal(true);
            }else{
                Toast.show({
                    type: 'success',
                    text1: '✅ Bin Updated!',
                    text2: ""
                });
                setNewDeviceID("");
                setNewDeviceLocation("");
                await reloadData();
            }
        }catch(error){
            console.log("Error while Updating the Device Bin! - "+error.message);
            Toast.show({
                    type: 'error',
                    text1: '❌ Bin Update Failed!',
                    text2: error.response.data.message
            });
            setNewDeviceID("");
        }
        setIsLoading(false);
    };

    const cancelEditDevice = () => {
        setNewDeviceID("");
        setShowEditDeviceModal(false);
    };



    return(
      
        <SafeAreaView className="flex-1 bg-gray-100">
            {isLoading && loadingOverlay()}
            <HeaderComponent subTitle={'Garbage Bin Info'} />
            <View className="flex w-fit self-end my-3">
                <TouchableOpacity
                    onPress={handleEditDeviceEvent}
                    className="flex flex-row gap-2 bg-blue-600 py-3 px-4 rounded-lg mx-6"
                >
                    <MaterialIcons name={"edit"} size={15} color="white" />
                    <Text className="text-white text-center font-semibold text-sm">
                        Bin Device
                    </Text>
                </TouchableOpacity>
            </View>

    <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md border border-gray-100 active:bg-gray-50" >

      <View className="flex-row justify-between items-start pb-3 mb-3 border-b border-gray-100">
        <Text className="text-xl font-extrabold text-gray-900">
          Bin ID#: {(device && device.deviceID) ? device.deviceID: ""}
        </Text>
        <Octicons
          name="dot-fill"
          size={30}
          color={(device && device.isOnline) ? 'green' : 'red'}
        />
      </View>
        <Text className="text-md text-gray-500">
          Bin Description: {(device && device.location) ? device.location: ""}
        </Text>
      <View className="flex-row flex-wrap m-2">
        <Text className="text-md text-gray-500 w-full mt-5">Status of each container</Text>
        <MetricCard
          title="Biodegradable"
          value={(device && device.isBiodegradableBinFull) ? device.isBiodegradableBinFull : ""}
          unit=""
          iconName="leaf"
          color="bg-green-50"
        />
        <MetricCard
          title="Non-Biodegradable"
          value={(device && device.isNonBiodegradableBinFull) ? device.isNonBiodegradableBinFull: ""}
          unit=""
          iconName="candy"
          color="bg-orange-50"
        />
        
        <MetricCard
          title="E-Waste"
          value={(device && device.isEwasteBinFull) ? device.isEwasteBinFull : ""}
          unit=""
          iconName="integrated-circuit-chip"
          color="bg-red-50"
        />
      </View>
    </View>           
 
            <Modal
                visible={showEditDeviceModal}
                transparent
                animationType="fade"
                onRequestClose={cancelEditDevice}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white rounded-lg p-6 w-80">
                    <Text className="text-lg font-bold text-center mb-4">Edit Bin Device</Text>
                    <Text className="text-center mb-6">Input the New Bin Device ID and Description</Text>
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
                            onPress={cancelEditDevice}
                            className="bg-gray-300 py-2 px-4 rounded-lg"
                        >
                            <Text className="text-center text-black font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmEditDevice}
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

export default binDetails;
