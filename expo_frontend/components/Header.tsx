import { useAuth } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';

const Header = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const router = useRouter();

  return (
    <BlurView tint="dark" intensity={25} style={styles.header}>
      {/* LEFT */}
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => router.navigate('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.title}>NoteConnect</Text>
          <Text style={styles.tagline}>Votre vault de notes</Text>

        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      {user && (
        <View style={styles.rightContainer}>
          <TouchableOpacity
            // onPress={() => router.navigate('/profile')}
            style={styles.chip}
            activeOpacity={0.8}
          >
            <Feather name="user" size={14} color="#E5E7EB" />
            <Text style={styles.chipText}>{user.username}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            style={[styles.chip, styles.logoutChip]}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={14} color="#FCA5A5" />
            <Text style={[styles.chipText, styles.logoutText]}>
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },

  /* LEFT */
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  /* RIGHT */
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  /* Chips */
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {
    fontSize: 13,
    color: '#E5E7EB',
    fontWeight: '500',
  },

  logoutChip: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: {
    color: '#FCA5A5',
  },
});

export default Header;
