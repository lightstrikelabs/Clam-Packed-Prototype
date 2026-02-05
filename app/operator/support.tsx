import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I add a new captain?',
    answer: 'Go to Captains in Operator Settings, tap "Add" and fill in their details including name, boat information, and contact details.',
  },
  {
    question: 'How are delivery fees calculated?',
    answer: 'Fees include a base delivery charge plus distance surcharges for remote islands. You can adjust these in the Pricing section.',
  },
  {
    question: 'Can I change delivery days for an island?',
    answer: 'Yes! Go to Delivery Schedule and toggle the available days for each island. Changes apply to future bookings only.',
  },
  {
    question: 'How do I partner with a new store?',
    answer: 'Contact us through the support options below. We\'ll help set up the integration based on how the store accepts orders.',
  },
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const handleContact = (type: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (type === 'email') {
      Linking.openURL('mailto:support@clampacked.com');
    } else if (type === 'phone') {
      Linking.openURL('tel:+13605551234');
    }
  };

  const toggleFaq = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Support"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <View style={[styles.contactHeader, { backgroundColor: region.primaryColor }]}>
          <Ionicons name="headset" size={40} color="#fff" />
          <Text style={styles.contactTitle}>We're here to help</Text>
          <Text style={styles.contactSubtitle}>
            Reach out anytime for assistance with your {region.brandName} operations
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>

        <View style={styles.contactRow}>
          <Pressable 
            style={[styles.contactCard, { borderColor: region.primaryColor }]}
            onPress={() => handleContact('email')}
          >
            <Ionicons name="mail" size={28} color={region.primaryColor} />
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@clampacked.com</Text>
          </Pressable>

          <Pressable 
            style={[styles.contactCard, { borderColor: region.secondaryColor }]}
            onPress={() => handleContact('phone')}
          >
            <Ionicons name="call" size={28} color={region.secondaryColor} />
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>(360) 555-1234</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {faqs.map((faq, index) => (
          <Pressable key={index} onPress={() => toggleFaq(index)}>
            <Card style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFaq === index ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={Colors.gray} 
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </Card>
          </Pressable>
        ))}

        <Card style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={20} color={region.primaryColor} />
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursTitle}>Support Hours</Text>
              <Text style={styles.hoursText}>Monday - Friday: 8am - 6pm PST</Text>
              <Text style={styles.hoursText}>Saturday: 9am - 3pm PST</Text>
              <Text style={styles.hoursText}>Sunday: Closed</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contactHeader: {
    alignItems: 'center',
    padding: 28,
    marginBottom: 20,
  },
  contactTitle: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: '#fff',
    marginTop: 12,
  },
  contactSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactLabel: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.text,
    marginTop: 10,
  },
  contactValue: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
    textAlign: 'center',
  },
  faqCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
    color: Colors.text,
    paddingRight: 8,
  },
  faqAnswer: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginTop: 12,
    lineHeight: 20,
  },
  hoursCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 14,
  },
  hoursInfo: {
    flex: 1,
  },
  hoursTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  hoursText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 20,
  },
});
