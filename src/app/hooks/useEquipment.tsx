import { useState, useEffect } from 'react';

export interface Equipment {
  ShortID: number;
  PublicKey: number[];
  Latitude: number;
  Longitude: number;
  Capacity: number;
  Debt: number;
  Expiration: number;
  Initialization: number;
  ProtocolFee: number;
  Signature: number[];
}

export type EquipmentDetails = {
  [key: string]: Equipment;
};

// Assuming currentFarmIds is an array of ShortID from Equipment
const useEquipmentDetails = (currentFarmIds: number[]) => {
  // Initialize state with the correct type
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetails>({});
  const [equipmentError, setEquipmentError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentFarmIds || currentFarmIds.length === 0) return;

      try {
        const response = await fetch('api/equipmentData');
        const res = await response.json();
        const data = res.equipmentJson.EquipmentDetails as EquipmentDetails;
        const filteredEquipmentDetails: EquipmentDetails = {};

        Object.keys(data).forEach(key => {
          if (currentFarmIds.includes(Number(key)) && data[key].hasOwnProperty('ProtocolFee') && data[key].ProtocolFee) {
            filteredEquipmentDetails[key] = data[key];
          }
        });

        setEquipmentDetails(filteredEquipmentDetails);
      } catch (err) {
        setEquipmentError(err);
      }
    };

    fetchData();
  }, [currentFarmIds]);

  return { equipmentDetails, equipmentError };
};

export default useEquipmentDetails;
