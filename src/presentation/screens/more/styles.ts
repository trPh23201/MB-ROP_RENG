import { StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { MORE_LAYOUT } from './MoreLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Phudu-Bold',
    fontSize: 18,
  },

  sectionContainer: {
    backgroundColor: BRAND_COLORS.screenBg.warm,
    marginBottom: MORE_LAYOUT.SECTION_SPACING,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'Phudu-Bold',
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 8,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: `${100 / MORE_LAYOUT.GRID_COLUMNS}%`,
    height: MORE_LAYOUT.GRID_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  gridLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: MORE_LAYOUT.MENU_ITEM_HEIGHT,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    marginLeft: 56,
  },
  menuIcon: {
    width: 24,
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 15,
  },
  destructiveText: {
    color: '#D32F2F',
  },

  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 12,
  },
});