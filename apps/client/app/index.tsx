import AsyncStorage from '@react-native-async-storage/async-storage';
import { catalogs, type Language } from '@bupa-satsang/ui/i18n';
import { useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const languageStorageKey = 'bupa-satsang.language';

export default function HomeScreen() {
  const [language, setLanguage] = useState<Language>('en');
  const messages = catalogs[language];

  useEffect(() => {
    let active = true;

    void AsyncStorage.getItem(languageStorageKey)
      .then((savedLanguage) => {
        if (active && (savedLanguage === 'en' || savedLanguage === 'gu')) {
          setLanguage(savedLanguage);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    void AsyncStorage.setItem(languageStorageKey, nextLanguage).catch(() => undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.accent} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>{messages.eyebrow}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {messages.appName}
          </Text>
          <Text style={styles.welcome}>{messages.welcome}</Text>
          <Text style={styles.description}>{messages.description}</Text>

          <View style={styles.divider} />
          <Text style={styles.languageLabel}>{messages.language}</Text>
          <View accessibilityRole="radiogroup" style={styles.languageOptions}>
            <LanguageButton
              active={language === 'en'}
              label={messages.english}
              onPress={() => selectLanguage('en')}
            />
            <LanguageButton
              active={language === 'gu'}
              label={messages.gujarati}
              onPress={() => selectLanguage('gu')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LanguageButton({
  active,
  label,
  onPress
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
      aria-checked={active}
      onPress={onPress}
      style={({ pressed }) => [
        styles.languageButton,
        active && styles.languageButtonActive,
        pressed && styles.languageButtonPressed
      ]}
    >
      <Text style={[styles.languageButtonText, active && styles.languageButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4EFE6'
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  accent: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#E8B85A',
    opacity: 0.18,
    top: -140,
    right: -120
  },
  card: {
    width: '100%',
    maxWidth: 620,
    borderRadius: 28,
    backgroundColor: '#FFFDF8',
    paddingHorizontal: 32,
    paddingVertical: 42,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 28px rgba(59, 43, 26, 0.12)'
      },
      default: {
        elevation: 6
      }
    })
  },
  eyebrow: {
    color: '#9A5D21',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  title: {
    color: '#2B2118',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 12
  },
  welcome: {
    color: '#4D3927',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    marginTop: 24
  },
  description: {
    color: '#756251',
    fontSize: 17,
    lineHeight: 26,
    marginTop: 10,
    maxWidth: 500
  },
  divider: {
    height: 1,
    backgroundColor: '#E8DED1',
    marginVertical: 30
  },
  languageLabel: {
    color: '#4D3927',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  languageButton: {
    borderWidth: 1,
    borderColor: '#CEBEAC',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFDF8'
  },
  languageButtonActive: {
    borderColor: '#8D4E19',
    backgroundColor: '#8D4E19'
  },
  languageButtonPressed: {
    opacity: 0.82
  },
  languageButtonText: {
    color: '#5D4936',
    fontSize: 16,
    fontWeight: '700'
  },
  languageButtonTextActive: {
    color: '#FFFFFF'
  }
});
