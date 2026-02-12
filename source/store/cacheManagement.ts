import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { apiCall } from '../api/apiClient';


export const getCachedData = async (key:string) => {

    const cachedData = JSON.parse(
  (await AsyncStorage.getItem(key)) || '{}'
);
const result = await apiCall<any>(
        apiClient.get('user/GetSettings?key=CacheRefressData')
      );
    const latestRefreshvalue = result?.[0]?.Value ?? null;
if(cachedData!=null){


    if(latestRefreshvalue!=cachedData.RefreshValue){
   const response = await apiCall<any>(
        apiClient.get('product/GetProductDetails/1')
      );
    response.RefreshValue=latestRefreshvalue;
    await AsyncStorage.setItem(key, JSON.stringify(response));
    return response;
    }
    return cachedData;
}
else{
    const response = await apiCall<any>(
        apiClient.get('product/GetProductDetails/1')
      );
    response.RefreshValue=latestRefreshvalue;
    await AsyncStorage.setItem(key, JSON.stringify(response));
    return response;
}
}
