import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { stores } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OrderScreen() {
  const { store: storeId } = useLocalSearchParams<{ store: string }>();
  const insets = useSafeAreaInsets();
  const { orderDetails, setOrderDetails } = useApp();
  const [pickupCode, setPickupCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const store = stores.find(s => s.id === storeId);

  if (!store) {
    return (
      <View style={styles.container}>
        <Header title="Store Not Found" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Store not found</Text>
        </View>
      </View>
    );
  }

  const handlePdfUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        setPdfUploaded(true);
        setPdfName(result.assets[0].name);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.log('Document picker cancelled or failed');
    }
  };

  const handleSubmit = () => {
    const updatedDetails = {
      ...orderDetails,
      store,
      notes: orderNote,
      pickupCode,
      pdfUploaded,
    };
    setOrderDetails(updatedDetails);
    router.push('/delivery/confirmation');
  };

  const isValid = () => {
    switch (store.flowType) {
      case 'pdf_upload':
        return pdfUploaded;
      case 'pickup_code':
        return pickupCode.length >= 4;
      case 'order_note':
        return orderNote.trim().length > 0;
      case 'automatic':
      case 'call_order':
      case 'drop_point':
        return true;
      default:
        return false;
    }
  };

  const renderContent = () => {
    switch (store.flowType) {
      case 'pdf_upload':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload your shopping list</Text>
            <Text style={styles.sectionDescription}>
              Upload a PDF or photo of your Trader Joe's shopping list. 
              Our team will shop for you!
            </Text>
            
            <Card 
              onPress={handlePdfUpload}
              style={[styles.uploadCard, pdfUploaded && styles.uploadedCard]}
            >
              <View style={styles.uploadContent}>
                <View style={[styles.uploadIcon, pdfUploaded && styles.uploadedIcon]}>
                  <Ionicons 
                    name={pdfUploaded ? 'checkmark-circle' : 'cloud-upload'} 
                    size={36} 
                    color={pdfUploaded ? Colors.success : Colors.primary} 
                  />
                </View>
                {pdfUploaded ? (
                  <>
                    <Text style={styles.uploadedText}>Uploaded!</Text>
                    <Text style={styles.fileName}>{pdfName}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.uploadText}>Tap to upload</Text>
                    <Text style={styles.uploadHint}>PDF or image</Text>
                  </>
                )}
              </View>
            </Card>
          </View>
        );
        
      case 'pickup_code':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter your pickup code</Text>
            <Text style={styles.sectionDescription}>
              Place your order on Safeway.com, choose "Pickup", 
              and paste your order confirmation code below.
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.codeInput}
                value={pickupCode}
                onChangeText={setPickupCode}
                placeholder="e.g., SFW-12345"
                placeholderTextColor={Colors.gray}
                autoCapitalize="characters"
              />
            </View>
            
            <Card style={styles.tipCard} variant="flat">
              <Ionicons name="bulb-outline" size={20} color={Colors.primary} />
              <Text style={styles.tipText}>
                Find your code in the order confirmation email from Safeway
              </Text>
            </Card>
          </View>
        );
        
      case 'automatic':
        return (
          <View style={styles.section}>
            <View style={styles.autoIcon}>
              <Ionicons name="sparkles" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>You're all set!</Text>
            <Text style={styles.sectionDescription}>
              Hela Provisions will be notified automatically when our driver 
              heads to the mainland. Just make sure you've placed your order 
              with them directly.
            </Text>
            
            <Card style={styles.reminderCard}>
              <Text style={styles.reminderTitle}>Quick reminder</Text>
              <Text style={styles.reminderText}>
                Order on helaprovisions.com before the deadline to ensure 
                your items are ready for pickup.
              </Text>
            </Card>
          </View>
        );
        
      case 'order_note':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add your order details</Text>
            <Text style={styles.sectionDescription}>
              Tell us what you need from CHEF'STORE. Include quantities 
              and any special requests.
            </Text>
            
            <TextInput
              style={styles.noteInput}
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="e.g., 2x 25lb flour, 1x commercial mayo..."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        );
        
      case 'call_order':
        return (
          <View style={styles.section}>
            <View style={styles.autoIcon}>
              <Ionicons name="call" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Call ahead to order</Text>
            <Text style={styles.sectionDescription}>
              CHS Farm & Home requires phone orders. Call them directly, 
              then confirm your pickup with us.
            </Text>
            
            <Card style={styles.phoneCard} onPress={() => {}}>
              <Ionicons name="call" size={24} color={Colors.primary} />
              <Text style={styles.phoneNumber}>(360) 293-3545</Text>
            </Card>
          </View>
        );
        
      case 'drop_point':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Azure Standard Drop Point</Text>
            <Text style={styles.sectionDescription}>
              Your Azure Standard order will be delivered to the shared 
              drop point. We'll pick it up and bring it to the island.
            </Text>
            
            <Card style={styles.dropPointCard}>
              <Ionicons name="location" size={24} color={Colors.primary} />
              <View style={styles.dropPointInfo}>
                <Text style={styles.dropPointTitle}>Burlington Drop Point</Text>
                <Text style={styles.dropPointAddress}>
                  1234 Burlington Blvd, Burlington WA
                </Text>
              </View>
            </Card>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title={store.name}
        subtitle={orderDetails.deliveryDate?.displayDate}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + webBottomInset + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
        
        <Button
          title="Confirm order"
          onPress={handleSubmit}
          disabled={!isValid()}
          size="large"
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadCard: {
    alignItems: 'center',
    padding: 32,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  uploadedCard: {
    borderStyle: 'solid',
    borderColor: Colors.success,
    backgroundColor: '#E8F5E9',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadedIcon: {
    backgroundColor: '#C8E6C9',
  },
  uploadText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 4,
  },
  uploadHint: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  uploadedText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.success,
    marginBottom: 4,
  },
  fileName: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  inputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    textAlign: 'center',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  autoIcon: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  reminderCard: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: Colors.warning,
    marginTop: 24,
  },
  reminderTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 8,
  },
  reminderText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  noteInput: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    minHeight: 160,
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  phoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  phoneNumber: {
    fontFamily: 'Lato_700Bold',
    fontSize: 22,
    color: Colors.primary,
  },
  dropPointCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
  },
  dropPointInfo: {
    flex: 1,
  },
  dropPointTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  dropPointAddress: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  submitButton: {
    marginTop: 8,
  },
});
