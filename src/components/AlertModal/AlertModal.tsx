import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

// @theme
import { Pallet } from "../../theme/Pallet";
import { FontSizes } from "../../theme/FontSizes";

// @assets
const alertIcon = require("../../../assets/alert.png");

interface IAlertModalProps {
  visible: boolean;
  onActionPress: () => void;
}

const AlertModal: React.FC<IAlertModalProps> = ({
  visible,
  onActionPress,
}) => {

  return (
    <Modal
      isVisible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>  
          <Image source={alertIcon} style={styles.image} />
          <Text style={styles.title}>You must enable permissions to use Collection Pictures</Text>
          <Text style={styles.description}>
            In order to interact with the app by saving and taking photos, you must enable the permissions and reload the app.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onActionPress}
          >
            <Text style={styles.buttonText}>Activate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
    height: 380,
    width: "100%",
  },
  image: {
    marginBottom: 20,
    width: 100,
    height: 100,
  },
  title: {
    fontSize: FontSizes.ExtraMedium,
    color: Pallet.primaryColor,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 1,
  },
  description: {
    color: Pallet.primaryColor,
    marginBottom: 20,
    fontSize: FontSizes.Medium,
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 250,
    backgroundColor: Pallet.primaryColor,
  },
  buttonText: {
    fontSize: FontSizes.ExtraMedium,
    color: Pallet.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    alignSelf: "center",
  },
});

export default AlertModal;
