import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const LIGHT_COLORS = { bg: '#F7F4EC', card: '#FFFFFF', input: '#FAFCFB', white: '#FFFFFF', green: '#238B69', deep: '#103E35', dark: '#103E35', mint: '#DDF4EA', ink: '#12352F', muted: '#667B75', orange: '#F1AD49', line: '#DCE8E3', danger: '#C75C5C', teal: '#45C49A', cream: '#FFF9EE' };
const DARK_COLORS = { bg: '#071713', card: '#10251F', input: '#142C25', white: '#FFFFFF', green: '#55D6A8', deep: '#071D18', dark: '#C6E9DE', mint: '#18372F', ink: '#F1FAF6', muted: '#9CB5AD', orange: '#FFC366', line: '#29463D', danger: '#FF8585', teal: '#55D6A8', cream: '#172B25' };
let C = LIGHT_COLORS;
let styles;
const ThemeContext = createContext({ mode: 'system', setMode: () => {}, isDark: false });
const LIFE_LOGO = require('./assets/life-icon.png');
const DAYS = [
  { key: 'lun', short: 'Lun', label: 'Lunes' }, { key: 'mar', short: 'Mar', label: 'Martes' },
  { key: 'mie', short: 'Mié', label: 'Miércoles' }, { key: 'jue', short: 'Jue', label: 'Jueves' },
  { key: 'vie', short: 'Vie', label: 'Viernes' }, { key: 'sab', short: 'Sáb', label: 'Sábado' },
  { key: 'dom', short: 'Dom', label: 'Domingo' },
];
const PAIRS = [
  { symbol: '💧', label: 'Agua', screen: 'Agua' }, { symbol: '🍎', label: 'Alimentación', screen: 'Alimentación' },
  { symbol: '🏃', label: 'Ejercicio', screen: 'Ejercicio' }, { symbol: '😴', label: 'Dormir', screen: 'Dormir' },
];
const MEMORY_THEMES = [
  { key: 'life', name: 'Life', subtitle: 'Hábitos saludables', emoji: '🌱', color: '#238B69', tint: '#DDF4EA', pairs: PAIRS },
  { key: 'pokemon', name: 'Pokémon', subtitle: 'Pokémon iniciales', emoji: '⚡', color: '#D7A91E', tint: '#FFF4BF', pairs: [
    { label: 'Pikachu', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { label: 'Bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { label: 'Charmander', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { label: 'Squirtle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
  ] },
  { key: 'fortnite', name: 'Fortnite', subtitle: 'Skins memorables', emoji: '🎮', color: '#7654C7', tint: '#EEE8FF', pairs: [
    { label: 'Peely', image: 'https://fortnite-api.com/images/cosmetics/br/cid_349_athena_commando_m_banana/icon.png' },
    { label: 'Fishstick', image: 'https://fortnite-api.com/images/cosmetics/br/cid_315_athena_commando_m_teriyakifish/icon.png' },
    { label: 'Skull Trooper', image: 'https://fortnite-api.com/images/cosmetics/br/cid_030_athena_commando_m_halloween/icon.png' },
    { label: 'Drift', image: 'https://fortnite-api.com/images/cosmetics/br/cid_161_athena_commando_m_drift/icon.png' },
  ] },
  { key: 'animals', name: 'Animales', subtitle: 'Fauna divertida', emoji: '🦁', color: '#E67E3F', tint: '#FFF0E4', pairs: [
    { label: 'León', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f981.png' },
    { label: 'Panda', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f43c.png' },
    { label: 'Zorro', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f98a.png' },
    { label: 'Rana', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f438.png' },
  ] },
  { key: 'space', name: 'Espacio', subtitle: 'Viaje por el universo', emoji: '🚀', color: '#3975B8', tint: '#E5F2FF', pairs: [
    { label: 'Tierra', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f30d.png' },
    { label: 'Luna', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f315.png' },
    { label: 'Cohete', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f680.png' },
    { label: 'Estrella', image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2b50.png' },
  ] },
];
const EMPTY_WEEK = Object.fromEntries(DAYS.map((day) => [day.key, 0]));
const EMPTY_MEALS = Object.fromEntries(DAYS.map((day) => [day.key, {
  breakfast: { food: '', protein: '', carbs: '' }, lunch: { food: '', protein: '', carbs: '' }, dinner: { food: '', protein: '', carbs: '' },
}]));
const DEFAULT_GOALS = { water: 5, sleep: 8, exercise: 20, protein: 60, carbs: 250 };
const DEFAULT_PROFILE = { name: '', age: '', avatar: '🌱', objective: 'Mejorar mis hábitos' };
const PROFILE_AVATARS = ['🌱', '😊', '🏃', '💪', '🧠', '⭐'];
const PROFILE_OBJECTIVES = ['Mejorar mis hábitos', 'Sentirme con más energía', 'Cuidar mi salud', 'Ser más constante'];
const MEALS = [{ key: 'breakfast', label: 'Desayuno', icon: 'sunny' }, { key: 'lunch', label: 'Comida', icon: 'restaurant' }, { key: 'dinner', label: 'Cena', icon: 'moon' }];
const COMMON_FOODS = [
  { name: 'Huevo', emoji: '🥚', portion: '1 pieza grande', protein: 6, carbs: 0 },
  { name: 'Pollo', emoji: '🍗', portion: '100 g cocido', protein: 31, carbs: 0 },
  { name: 'Arroz', emoji: '🍚', portion: '1 taza cocida', protein: 4, carbs: 45 },
  { name: 'Avena', emoji: '🥣', portion: '40 g', protein: 5, carbs: 27 },
  { name: 'Frijoles', emoji: '🫘', portion: '½ taza cocida', protein: 7, carbs: 20 },
  { name: 'Yogur', emoji: '🥛', portion: '1 taza natural', protein: 10, carbs: 12 },
  { name: 'Plátano', emoji: '🍌', portion: '1 pieza mediana', protein: 1, carbs: 27 },
  { name: 'Atún', emoji: '🐟', portion: '1 lata en agua', protein: 25, carbs: 0 },
];
const MUSCLES = [
  { name: 'Brazo', icon: 'barbell', exercises: ['Curl de bíceps', 'Curl martillo', 'Fondos en silla'] },
  { name: 'Pecho', icon: 'body', exercises: ['Lagartijas', 'Lagartijas abiertas', 'Press de pecho'] },
  { name: 'Abdomen', icon: 'fitness', exercises: ['Plancha', 'Abdominales', 'Elevación de piernas'] },
  { name: 'Pierna', icon: 'walk', exercises: ['Sentadilla', 'Desplantes', 'Elevación de pantorrilla'] },
];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEK_DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayKey() {
  const today = new Date();
  return toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
}

function readDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return { year, month: month - 1, day };
}

function prettyDate(key) {
  const { year, month, day } = readDateKey(key);
  return `${day} de ${MONTHS[month]} de ${year}`;
}

function CalendarPicker({ visible, selectedDate, markedDates, onSelect, onClose }) {
  const selected = readDateKey(selectedDate);
  const [viewYear, setViewYear] = useState(selected.year);
  const [viewMonth, setViewMonth] = useState(selected.month);

  useEffect(() => {
    if (visible) {
      const next = readDateKey(selectedDate);
      setViewYear(next.year);
      setViewMonth(next.month);
    }
  }, [selectedDate, visible]);

  const moveMonth = (amount) => {
    const next = new Date(viewYear, viewMonth + amount, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalShade}><View style={styles.calendarCard}>
      <View style={styles.calendarTop}><Pressable style={styles.calendarArrow} onPress={() => moveMonth(-1)}><Ionicons name="chevron-back" size={25} color={C.dark} /></Pressable><View><Text style={styles.calendarMonth}>{MONTHS[viewMonth]}</Text><Text style={styles.calendarYear}>{viewYear}</Text></View><Pressable style={styles.calendarArrow} onPress={() => moveMonth(1)}><Ionicons name="chevron-forward" size={25} color={C.dark} /></Pressable></View>
      <View style={styles.calendarGrid}>{WEEK_DAYS.map((name, index) => <Text key={`${name}-${index}`} style={styles.weekdayName}>{name}</Text>)}{cells.map((day, index) => {
        if (!day) return <View key={`empty-${index}`} style={styles.calendarCell} />;
        const key = toDateKey(viewYear, viewMonth, day);
        const active = key === selectedDate;
        const marked = markedDates.includes(key);
        return <Pressable key={key} style={[styles.calendarCell, active && styles.calendarCellActive]} onPress={() => { onSelect(key); onClose(); }}><Text style={[styles.calendarDay, active && styles.calendarDayActive]}>{day}</Text>{marked && <View style={[styles.calendarDot, active && styles.calendarDotActive]} />}</Pressable>;
      })}</View>
      <Pressable style={styles.todayButton} onPress={() => { onSelect(todayKey()); onClose(); }}><Ionicons name="today" size={19} color={C.green} /><Text style={styles.todayText}>Ir a hoy</Text></Pressable>
      <Pressable onPress={onClose}><Text style={styles.closeCalendar}>Cerrar</Text></Pressable>
    </View></View>
  </Modal>;
}

function DateHeading({ selectedDate, onOpen }) {
  return <Pressable style={styles.dateHeadingOuter} onPress={onOpen}><LinearGradient colors={['#174F43', '#238B69']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dateHeading}><View><Text style={styles.dateEyebrow}>FECHA DEL REGISTRO</Text><Text style={styles.dateTitle}>{prettyDate(selectedDate)}</Text></View><View style={styles.calendarIcon}><Ionicons name="calendar" size={25} color={C.white} /></View></LinearGradient></Pressable>;
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(key).then((saved) => { if (saved) setValue(JSON.parse(saved)); }).catch(() => {}).finally(() => setLoaded(true));
  }, [key]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {}); }, [key, loaded, value]);
  return [value, setValue];
}

function recentDateKeys(amount = 7) {
  const dates = [];
  const now = new Date();
  for (let offset = amount - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    dates.push(toDateKey(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  return dates;
}

function calculateStreak(records, qualifies) {
  let streak = 0;
  const now = new Date();
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    if (!qualifies(records[key])) break;
    streak += 1;
  }
  return streak;
}

function exerciseSets(value) {
  if (Array.isArray(value?.sets)) return value.sets;
  if (typeof value === 'number' && value > 0) return [value, 0, 0];
  return [0, 0, 0];
}

function exerciseTotal(value) {
  return exerciseSets(value).reduce((sum, repetitions) => sum + Number(repetitions || 0), 0);
}

function sleepHours(value) {
  if (typeof value === 'number') return value;
  return Number(value?.hours || 0);
}

function formatTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const suffix = hour24 < 12 ? 'a. m.' : 'p. m.';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function TimeSlider({ label, icon, value, onChange, color, rangeStart, rangeEnd }) {
  const [trackWidth, setTrackWidth] = useState(1);
  const dragStart = useRef(value);
  const widthRef = useRef(trackWidth);
  const valueRef = useRef(value);
  const changeRef = useRef(onChange);
  widthRef.current = trackWidth;
  valueRef.current = value;
  changeRef.current = onChange;
  const duration = (rangeEnd - rangeStart + 1440) % 1440 || 1440;
  const offsetFor = (minutes) => Math.min(duration, Math.max(0, (minutes - rangeStart + 1440) % 1440));
  const startOffset = useRef(offsetFor(value));
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => { dragStart.current = valueRef.current; startOffset.current = offsetFor(valueRef.current); },
    onPanResponderMove: (_, gesture) => {
      const rawOffset = startOffset.current + (gesture.dx / Math.max(widthRef.current, 1)) * duration;
      const clamped = Math.min(duration, Math.max(0, rawOffset));
      const stepped = Math.round(clamped / 30) * 30;
      changeRef.current((rangeStart + stepped) % 1440);
    },
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
  })).current;
  const percent = (offsetFor(value) / duration) * 100;
  return <View style={styles.timeSliderCard}><View style={styles.timeSliderTop}><View style={styles.timeSliderLabel}><Ionicons name={icon} size={19} color={color} /><Text style={styles.timeSliderTitle}>{label}</Text></View><Text style={[styles.timeSliderValue, { color }]}>{formatTime(value)}</Text></View><View {...panResponder.panHandlers} style={styles.timeTrackWrap} onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}><View style={styles.timeTrack}><View style={[styles.timeTrackFill, { width: `${percent}%`, backgroundColor: color }]} /></View><View pointerEvents="none" style={[styles.timeThumb, { left: `${percent}%`, borderColor: color }]}><View style={[styles.timeThumbInner, { backgroundColor: color }]} /></View></View><View style={styles.timeLabels}><Text style={styles.timeLabelText}>{formatTime(rangeStart)}</Text><Text style={styles.timeLabelText}>{formatTime((rangeStart + Math.round(duration / 2)) % 1440)}</Text><Text style={styles.timeLabelText}>{formatTime(rangeEnd)}</Text></View></View>;
}

function ProgressLine({ value, goal, color = C.green }) {
  const percent = goal > 0 ? Math.min(value / goal, 1) : 0;
  return <View style={styles.miniProgress}><View style={[styles.miniProgressFill, { width: `${percent * 100}%`, backgroundColor: color }]} /></View>;
}

function DashboardCard({ emoji, label, value, detail, progress, goal, color, onPress }) {
  return <Pressable style={styles.dashboardCard} onPress={onPress}><View style={styles.dashboardTop}><View style={[styles.dashboardIcon, { backgroundColor: `${color}18` }]}><Text style={styles.dashboardEmoji}>{emoji}</Text></View><Ionicons name="chevron-forward" size={19} color={C.muted} /></View><Text style={styles.dashboardLabel}>{label}</Text><Text style={styles.dashboardValue}>{value}</Text><Text style={styles.dashboardDetail}>{detail}</Text><ProgressLine value={progress} goal={goal} color={color} /></Pressable>;
}

function SevenDayChart({ waterRecords, sleepRecords, waterGoal, sleepGoal }) {
  const dates = recentDateKeys();
  return <View style={styles.chartCard}><View style={styles.chartLegend}><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#3D9DE0' }]} /><Text style={styles.legendText}>Agua</Text></View><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#8564D8' }]} /><Text style={styles.legendText}>Sueño</Text></View></View><View style={styles.chartRows}>{dates.map((key) => { const parsed = readDateKey(key); const water = waterRecords[key] || 0; const sleep = sleepHours(sleepRecords[key]); return <View key={key} style={styles.chartColumn}><View style={styles.bars}><View style={[styles.chartBar, { height: Math.max(4, Math.min(water / waterGoal, 1) * 64), backgroundColor: '#3D9DE0' }]} /><View style={[styles.chartBar, { height: Math.max(4, Math.min(sleep / sleepGoal, 1) * 64), backgroundColor: '#8564D8' }]} /></View><Text style={styles.chartDay}>{WEEK_DAYS[new Date(parsed.year, parsed.month, parsed.day).getDay()]}</Text></View>; })}</View></View>;
}

function createDeck(pairs = PAIRS) {
  const deck = pairs.flatMap((item, index) => [{ ...item, id: `${index}-a`, pairId: index }, { ...item, id: `${index}-b`, pairId: index }]);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[random]] = [deck[random], deck[index]];
  }
  return deck;
}

function DaySelector({ selected, onSelect }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>
    {DAYS.map((day) => <Pressable key={day.key} onPress={() => onSelect(day.key)} style={[styles.dayChip, selected === day.key && styles.dayChipActive]}><Text style={[styles.dayChipText, selected === day.key && styles.dayChipTextActive]}>{day.short}</Text></Pressable>)}
  </ScrollView>;
}

function ModulePage({ emoji, title, subtitle, children }) {
  return <SafeAreaView style={styles.safe}><LinearGradient colors={[C.bg, C.mint, C.cream]} style={styles.flex}><View style={styles.backgroundOrb} /><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <LinearGradient colors={[C.deep, '#1D6F5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.moduleHeader}><View style={styles.moduleIcon}><Text style={styles.moduleEmoji}>{emoji}</Text></View><View style={styles.moduleHeadCopy}><Text style={styles.moduleTitle}>{title}</Text><Text style={styles.moduleSubtitle}>{subtitle}</Text></View></LinearGradient>
    {children}
  </ScrollView></LinearGradient></SafeAreaView>;
}

function SplashScreen() {
  const scale = useRef(new Animated.Value(0.65)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.parallel([Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true })]).start(); }, [opacity, scale]);
  return <LinearGradient colors={['#0B342D', '#17644F', '#35AD83']} style={styles.splash}><StatusBar barStyle="light-content" /><View style={styles.splashGlow} /><Animated.View style={[styles.splashLogo, { opacity, transform: [{ scale }] }]}><Image source={LIFE_LOGO} style={styles.splashLogoImage} /></Animated.View><Animated.Text style={[styles.splashTitle, { opacity }]}>Life</Animated.Text><Text style={styles.splashText}>Cuida tus hábitos. Entrena tu memoria.</Text><View style={styles.splashPill}><Ionicons name="sparkles" size={14} color="#FFE3A0" /><Text style={styles.splashPillText}>TU BIENESTAR, CADA DÍA</Text></View></LinearGradient>;
}

function HomeScreen({ navigation }) {
  const [water] = useStoredState('life-water-calendar', {});
  const [food] = useStoredState('life-food-calendar', {});
  const [exercise] = useStoredState('life-exercise-calendar', {});
  const [sleep] = useStoredState('life-sleep-calendar', {});
  const [goals] = useStoredState('life-goals', DEFAULT_GOALS);
  const [profile] = useStoredState('life-profile', DEFAULT_PROFILE);
  const today = todayKey();
  const todayMeals = food[today] || EMPTY_MEALS.lun;
  const mealCount = MEALS.filter((meal) => todayMeals[meal.key]?.food).length;
  const protein = MEALS.reduce((sum, meal) => sum + (Number(todayMeals[meal.key]?.protein) || 0), 0);
  const carbs = MEALS.reduce((sum, meal) => sum + (Number(todayMeals[meal.key]?.carbs) || 0), 0);
  const repetitions = Object.values(exercise[today] || {}).reduce((sum, value) => sum + exerciseTotal(value), 0);
  const waterStreak = calculateStreak(water, (value) => Number(value || 0) >= goals.water);
  const completed = [Number(water[today] || 0) >= goals.water, mealCount === 3, repetitions >= goals.exercise, sleepHours(sleep[today]) >= 7].filter(Boolean).length;

  return <SafeAreaView style={styles.safe}><LinearGradient colors={[C.bg, C.mint, C.cream]} style={styles.flex}><View style={styles.backgroundOrb} /><ScrollView contentContainerStyle={styles.page}>
    <View style={styles.welcomeRow}><View style={styles.welcomeCopy}><Text style={styles.overline}>RESUMEN DE HOY</Text><Text style={styles.welcomeTitle}>{profile.name ? `Hola, ${profile.name}` : 'Tu día en Life'}</Text><Text style={styles.welcomeDate}>{prettyDate(today)}</Text></View><View style={styles.scoreCircle}><Text style={styles.scoreNumber}>{completed}</Text><Text style={styles.scoreTotal}>de 4</Text></View></View>
    <LinearGradient colors={[C.deep, '#1E745D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dailyBanner}><View style={styles.dailyBannerIcon}><Ionicons name={completed === 4 ? 'trophy' : 'sparkles'} size={26} color={C.white} /></View><View style={styles.dailyBannerCopy}><Text style={styles.dailyBannerTitle}>{completed === 4 ? '¡Día completado!' : 'Sigue construyendo tu día'}</Text><Text style={styles.dailyBannerText}>{completed === 4 ? 'Cumpliste todos tus hábitos principales.' : `Llevas ${completed} de 4 hábitos principales.`}</Text></View></LinearGradient>
    <View style={styles.dashboardGrid}>
      <DashboardCard emoji="💧" label="Agua" value={`${water[today] || 0} vasos`} detail={`${((water[today] || 0) * 0.6).toFixed(1)} L de hoy`} progress={water[today] || 0} goal={goals.water} color="#3D9DE0" onPress={() => navigation.getParent()?.navigate('Agua')} />
      <DashboardCard emoji="🍎" label="Alimentación" value={`${mealCount}/3 comidas`} detail={`${protein}g prot. · ${carbs}g carb.`} progress={mealCount} goal={3} color="#E68A45" onPress={() => navigation.getParent()?.navigate('Alimentación')} />
      <DashboardCard emoji="🏃" label="Ejercicio" value={`${repetitions} rep.`} detail={`Meta: ${goals.exercise}`} progress={repetitions} goal={goals.exercise} color="#E05766" onPress={() => navigation.getParent()?.navigate('Ejercicio')} />
      <DashboardCard emoji="😴" label="Dormir" value={`${sleepHours(sleep[today])} horas`} detail={`Meta: ${goals.sleep} h`} progress={sleepHours(sleep[today])} goal={goals.sleep} color="#8564D8" onPress={() => navigation.getParent()?.navigate('Dormir')} />
    </View>
    <View style={styles.streakCard}><View style={styles.streakIcon}><Ionicons name="flame" size={29} color="#E9783D" /></View><View style={styles.streakCopy}><Text style={styles.streakTitle}>Racha de hidratación</Text><Text style={styles.streakText}>{waterStreak ? `${waterStreak} ${waterStreak === 1 ? 'día' : 'días'} cumpliendo tu meta` : 'Registra tu meta de agua para iniciar una racha'}</Text></View><Text style={styles.streakNumber}>{waterStreak}</Text></View>
    <View style={styles.sectionHeader}><Text style={styles.sectionTitleCompact}>Últimos 7 días</Text><Pressable onPress={() => navigation.getParent()?.navigate('Metas')}><Text style={styles.sectionLink}>Editar metas</Text></Pressable></View>
    <SevenDayChart waterRecords={water} sleepRecords={sleep} waterGoal={goals.water} sleepGoal={goals.sleep} />
    <Pressable style={styles.gamePromo} onPress={() => navigation.navigate('Jugar')}><View><Text style={styles.gamePromoOverline}>ENTRENA TU MENTE</Text><Text style={styles.gamePromoTitle}>Life Memorama</Text><Text style={styles.gamePromoText}>Encuentra las parejas saludables.</Text></View><View style={styles.playCircle}><Ionicons name="play" size={28} color={C.green} /></View></Pressable>
  </ScrollView></LinearGradient></SafeAreaView>;
}

function WaterScreen() {
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useStoredState('life-water-calendar', {});
  const [goals] = useStoredState('life-goals', DEFAULT_GOALS);
  const glasses = records[selectedDate] || 0;
  const liters = (glasses * 0.6).toFixed(1);
  const selected = readDateKey(selectedDate);
  const monthPrefix = `${selected.year}-${String(selected.month + 1).padStart(2, '0')}`;
  const monthEntries = Object.entries(records).filter(([key, value]) => key.startsWith(monthPrefix) && value > 0).sort(([a], [b]) => a.localeCompare(b));
  const monthTotal = monthEntries.reduce((sum, [, value]) => sum + value, 0);
  const update = (amount) => setRecords((current) => ({ ...current, [selectedDate]: Math.max(0, (current[selectedDate] || 0) + amount) }));
  const feedback = glasses >= goals.water ? '¡Excelente! Alcanzaste la meta del día.' : glasses >= Math.ceil(goals.water / 2) ? 'Vas bien, continúa hidratándote.' : glasses > 0 ? 'Intenta tomar más agua durante el día.' : 'Todavía no registras agua este día.';
  return <ModulePage emoji="💧" title="Registro de agua" subtitle="Cada vaso equivale a 600 ml">
    <DateHeading selectedDate={selectedDate} onOpen={() => setCalendarOpen(true)} />
    <CalendarPicker visible={calendarOpen} selectedDate={selectedDate} markedDates={Object.keys(records).filter((key) => records[key] > 0)} onSelect={setSelectedDate} onClose={() => setCalendarOpen(false)} />
    <View style={styles.mainCard}><Text style={styles.bigNumber}>{glasses}</Text><Text style={styles.bigUnit}>vasos · {liters} litros · meta {goals.water}</Text><View style={styles.progress}><View style={[styles.progressFill, { width: `${Math.min(glasses / goals.water, 1) * 100}%` }]} /></View><Text style={styles.feedback}>{feedback}</Text><View style={styles.twoButtons}><Pressable style={styles.outlineButton} onPress={() => update(-1)}><Text style={styles.outlineButtonText}>− Quitar</Text></Pressable><Pressable style={styles.primarySmall} onPress={() => update(1)}><Text style={styles.primaryText}>+ Agregar vaso</Text></Pressable></View></View>
    <Text style={styles.sectionTitle}>Historial de {MONTHS[selected.month]}</Text><View style={styles.weekTable}>{monthEntries.length ? monthEntries.map(([key, value]) => <Pressable key={key} style={styles.historyRow} onPress={() => setSelectedDate(key)}><Text style={styles.historyDate}>{prettyDate(key)}</Text><View><Text style={styles.historyValue}>{value} vasos · {(value * 0.6).toFixed(1)} L</Text><Text style={[styles.historyStatus, { color: value >= goals.water ? C.green : C.orange }]}>{value >= goals.water ? 'Muy bien' : 'Intenta tomar más'}</Text></View></Pressable>) : <Text style={styles.emptyHistory}>No hay registros en este mes.</Text>}<View style={styles.totalRow}><Text style={styles.totalLabel}>Total del mes</Text><Text style={styles.totalValue}>{monthTotal} vasos · {(monthTotal * 0.6).toFixed(1)} L</Text></View></View>
    <Text style={styles.disclaimer}>La meta de 5 vasos es demostrativa; las necesidades de hidratación varían por persona.</Text>
  </ModulePage>;
}

function FoodScreen() {
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quickMeal, setQuickMeal] = useState('breakfast');
  const [records, setRecords] = useStoredState('life-food-calendar', {});
  const blankDay = EMPTY_MEALS.lun;
  const dayMeals = records[selectedDate] || blankDay;
  const updateMeal = (meal, field, value) => setRecords((current) => ({ ...current, [selectedDate]: { ...(current[selectedDate] || blankDay), [meal]: { ...(current[selectedDate]?.[meal] || blankDay[meal]), [field]: value } } }));
  const addQuickFood = (food) => setRecords((current) => {
    const currentDay = current[selectedDate] || blankDay;
    const currentMeal = currentDay[quickMeal] || blankDay[quickMeal];
    return { ...current, [selectedDate]: { ...currentDay, [quickMeal]: { food: currentMeal.food ? `${currentMeal.food}, ${food.name}` : food.name, protein: String((Number(currentMeal.protein) || 0) + food.protein), carbs: String((Number(currentMeal.carbs) || 0) + food.carbs) } } };
  });
  const protein = MEALS.reduce((sum, meal) => sum + (Number(dayMeals[meal.key].protein) || 0), 0);
  const carbs = MEALS.reduce((sum, meal) => sum + (Number(dayMeals[meal.key].carbs) || 0), 0);
  const selected = readDateKey(selectedDate);
  const monthPrefix = `${selected.year}-${String(selected.month + 1).padStart(2, '0')}`;
  const savedDates = Object.keys(records).filter((key) => key.startsWith(monthPrefix) && MEALS.some((meal) => records[key]?.[meal.key]?.food));
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ModulePage emoji="🍎" title="Alimentación" subtitle="Desayuno, comida y cena por día">
    <DateHeading selectedDate={selectedDate} onOpen={() => setCalendarOpen(true)} />
    <CalendarPicker visible={calendarOpen} selectedDate={selectedDate} markedDates={Object.keys(records).filter((key) => MEALS.some((meal) => records[key]?.[meal.key]?.food))} onSelect={setSelectedDate} onClose={() => setCalendarOpen(false)} />
    <View style={styles.quickFoodCard}><View style={styles.quickFoodHead}><View><Text style={styles.quickFoodOverline}>REGISTRO RÁPIDO</Text><Text style={styles.quickFoodTitle}>Alimentos frecuentes</Text></View><Ionicons name="flash" size={24} color={C.orange} /></View><Text style={styles.quickFoodHelp}>1. Elige en qué comida agregarlo</Text><View style={styles.quickMealTabs}>{MEALS.map((meal) => <Pressable key={meal.key} onPress={() => setQuickMeal(meal.key)} style={[styles.quickMealTab, quickMeal === meal.key && styles.quickMealTabActive]}><Text style={[styles.quickMealTabText, quickMeal === meal.key && styles.quickMealTabTextActive]}>{meal.label}</Text></Pressable>)}</View><Text style={styles.quickFoodHelp}>2. Toca un alimento</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFoodList}>{COMMON_FOODS.map((food) => <Pressable key={food.name} style={styles.quickFoodItem} onPress={() => addQuickFood(food)}><Text style={styles.quickFoodEmoji}>{food.emoji}</Text><Text style={styles.quickFoodName}>{food.name}</Text><Text style={styles.quickFoodPortion}>{food.portion}</Text><Text style={styles.quickFoodMacros}>{food.protein}g P · {food.carbs}g C</Text><View style={styles.quickFoodAdd}><Ionicons name="add" size={15} color={C.white} /></View></Pressable>)}</ScrollView><Text style={styles.quickFoodSource}>Valores aproximados por porción. Puedes corregirlos manualmente.</Text></View>
    {MEALS.map((meal) => <View key={meal.key} style={styles.mealCard}><View style={styles.mealTitleRow}><Ionicons name={meal.icon} size={23} color={C.green} /><Text style={styles.mealTitle}>{meal.label}</Text></View><Text style={styles.inputLabel}>¿Qué comiste?</Text><TextInput value={dayMeals[meal.key].food} onChangeText={(value) => updateMeal(meal.key, 'food', value)} placeholder={`Escribe tu ${meal.label.toLowerCase()}`} placeholderTextColor="#9AABA6" style={styles.textInput} /><View style={styles.nutrients}><View style={styles.nutrientField}><Text style={styles.inputLabel}>Proteína (g)</Text><TextInput value={dayMeals[meal.key].protein} onChangeText={(value) => updateMeal(meal.key, 'protein', value.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" placeholder="0" placeholderTextColor="#9AABA6" style={styles.textInput} /></View><View style={styles.nutrientField}><Text style={styles.inputLabel}>Carbohidratos (g)</Text><TextInput value={dayMeals[meal.key].carbs} onChangeText={(value) => updateMeal(meal.key, 'carbs', value.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" placeholder="0" placeholderTextColor="#9AABA6" style={styles.textInput} /></View></View></View>)}
    <View style={styles.nutritionTotal}><Text style={styles.totalLabel}>Total del día</Text><View style={styles.nutritionNumbers}><Text style={styles.nutritionStat}>{protein} g<Text style={styles.nutritionCaption}> proteína</Text></Text><Text style={styles.nutritionStat}>{carbs} g<Text style={styles.nutritionCaption}> carbohidratos</Text></Text></View></View>
    <Text style={styles.sectionTitle}>Días guardados en {MONTHS[selected.month]}</Text><View style={styles.weekTable}>{savedDates.length ? savedDates.sort().map((key) => <Pressable key={key} style={styles.historyRow} onPress={() => setSelectedDate(key)}><Text style={styles.historyDate}>{prettyDate(key)}</Text><Text style={styles.historyValue}>{MEALS.filter((meal) => records[key]?.[meal.key]?.food).length} comidas registradas</Text></Pressable>) : <Text style={styles.emptyHistory}>No hay comidas guardadas en este mes.</Text>}</View>
    <Text style={styles.disclaimer}>Los valores los registra el usuario; la aplicación no sustituye orientación nutricional profesional.</Text>
  </ModulePage></KeyboardAvoidingView>;
}

function ExerciseScreen() {
  const [muscle, setMuscle] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useStoredState('life-exercise-calendar', {});
  const dayCounts = records[selectedDate] || {};
  const sets = exercise ? exerciseSets(dayCounts[exercise]) : [];
  const count = sets.reduce((sum, value) => sum + Number(value || 0), 0);
  const updateSets = (nextSets) => setRecords((current) => ({ ...current, [selectedDate]: { ...(current[selectedDate] || {}), [exercise]: { sets: nextSets } } }));
  const updateSet = (index, amount) => updateSets(sets.map((value, setIndex) => setIndex === index ? Math.max(0, value + amount) : value));
  const markedDates = Object.keys(records).filter((key) => Object.values(records[key] || {}).some((value) => exerciseTotal(value) > 0));
  const dateControls = <><DateHeading selectedDate={selectedDate} onOpen={() => setCalendarOpen(true)} /><CalendarPicker visible={calendarOpen} selectedDate={selectedDate} markedDates={markedDates} onSelect={setSelectedDate} onClose={() => setCalendarOpen(false)} /></>;
  if (exercise) return <ModulePage emoji="🏋️" title={exercise} subtitle={`${muscle.name} · 3 series recomendadas`}>{dateControls}<Pressable style={styles.backLink} onPress={() => setExercise(null)}><Ionicons name="arrow-back" size={20} color={C.dark} /><Text style={styles.backText}>Elegir otro ejercicio</Text></Pressable><View style={styles.coachCard}><View style={styles.coachIcon}><Ionicons name="fitness" size={27} color={C.white} /></View><View style={styles.coachCopy}><Text style={styles.coachOverline}>COACH LIFE</Text><Text style={styles.coachTitle}>Haz 3 series de 15 repeticiones</Text><Text style={styles.coachText}>Descansa de 45 a 60 segundos entre cada serie.</Text></View></View><View style={styles.seriesList}>{sets.map((repetitions, index) => <View key={index} style={styles.seriesCard}><View style={styles.seriesBadge}><Text style={styles.seriesBadgeText}>{index + 1}</Text></View><View style={styles.seriesCopy}><Text style={styles.seriesTitle}>{index === 0 ? 'Primera serie' : index === 1 ? 'Segunda serie' : index === 2 ? 'Tercera serie' : `Serie ${index + 1}`}</Text><Text style={styles.seriesGoal}>{repetitions >= 15 ? 'Meta completada' : `Faltan ${15 - repetitions} para la meta`}</Text></View><Pressable style={styles.seriesButton} onPress={() => updateSet(index, -1)}><Ionicons name="remove" size={22} color={C.dark} /></Pressable><Text style={styles.seriesNumber}>{repetitions}</Text><Pressable style={[styles.seriesButton, styles.seriesButtonAdd]} onPress={() => updateSet(index, 1)}><Ionicons name="add" size={22} color={C.white} /></Pressable></View>)}</View><Pressable style={styles.addSeriesButton} onPress={() => updateSets([...sets, 0])}><Ionicons name="add-circle-outline" size={21} color={C.green} /><Text style={styles.addSeriesText}>Agregar otra serie</Text></Pressable><View style={styles.exerciseTotalCard}><View><Text style={styles.exerciseTotalLabel}>TOTAL DEL EJERCICIO</Text><Text style={styles.exerciseTotalText}>{sets.filter((value) => value > 0).length} series registradas</Text></View><Text style={styles.exerciseTotalNumber}>{count} rep.</Text></View><Pressable style={styles.resetGoals} onPress={() => updateSets([0, 0, 0])}><Ionicons name="refresh" size={20} color={C.dark} /><Text style={styles.resetGoalsText}>Reiniciar las series</Text></Pressable><Text style={styles.sectionTitle}>Actividad del día</Text><View style={styles.weekTable}>{Object.entries(dayCounts).filter(([, value]) => exerciseTotal(value) > 0).length ? Object.entries(dayCounts).filter(([, value]) => exerciseTotal(value) > 0).map(([name, value]) => <View key={name} style={styles.weekRow}><Text style={styles.exerciseHistoryName}>{name}</Text><Text style={styles.totalValue}>{exerciseSets(value).filter((item) => item > 0).length} series · {exerciseTotal(value)} rep.</Text></View>) : <Text style={styles.emptyHistory}>Todavía no registras ejercicios este día.</Text>}</View></ModulePage>;
  if (muscle) return <ModulePage emoji="🏃" title={`Ejercicios de ${muscle.name}`} subtitle="Selecciona uno para comenzar">{dateControls}<Pressable style={styles.backLink} onPress={() => setMuscle(null)}><Ionicons name="arrow-back" size={20} color={C.dark} /><Text style={styles.backText}>Ver grupos musculares</Text></Pressable><View style={styles.exerciseList}>{muscle.exercises.map((item, index) => <Pressable key={item} style={styles.exerciseRow} onPress={() => setExercise(item)}><View style={styles.exerciseIndex}><Text style={styles.exerciseIndexText}>{index + 1}</Text></View><View style={styles.exerciseNameBox}><Text style={styles.exerciseName}>{item}</Text><Text style={styles.exerciseSaved}>{exerciseSets(dayCounts[item]).filter((value) => value > 0).length} series · {exerciseTotal(dayCounts[item])} repeticiones</Text></View><Ionicons name="chevron-forward" size={22} color={C.green} /></Pressable>)}</View></ModulePage>;
  return <ModulePage emoji="🏃" title="Ejercicio" subtitle="Elige fecha, músculo y ejercicio">{dateControls}<View style={styles.muscleGrid}>{MUSCLES.map((item) => <Pressable key={item.name} style={styles.muscleCard} onPress={() => setMuscle(item)}><View style={styles.muscleIcon}><Ionicons name={item.icon} size={34} color={C.green} /></View><Text style={styles.muscleTitle}>{item.name}</Text><Text style={styles.muscleCount}>{item.exercises.length} ejercicios</Text></Pressable>)}</View><View style={styles.tip}><Ionicons name="information-circle" size={25} color={C.orange} /><Text style={styles.tipText}>Realiza los movimientos con técnica segura y detente si sientes dolor.</Text></View></ModulePage>;
}

function SleepScreen() {
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useStoredState('life-sleep-calendar', {});
  const saved = records[selectedDate];
  const bedtime = typeof saved === 'object' ? saved.bedtime : 22 * 60;
  const wakeTime = typeof saved === 'object' ? saved.wakeTime : 6 * 60;
  const calculatedMinutes = (wakeTime - bedtime + 1440) % 1440;
  const hours = typeof saved === 'number' ? saved : Number((calculatedMinutes / 60).toFixed(1));
  const selected = readDateKey(selectedDate);
  const monthPrefix = `${selected.year}-${String(selected.month + 1).padStart(2, '0')}`;
  const monthEntries = Object.entries(records).filter(([key, value]) => key.startsWith(monthPrefix) && sleepHours(value) > 0).sort(([a], [b]) => a.localeCompare(b));
  const average = monthEntries.length ? monthEntries.reduce((sum, [, value]) => sum + sleepHours(value), 0) / monthEntries.length : 0;
  const status = (value) => value === 0 ? 'Sin registro' : value < 7 ? 'Dormiste poco' : value <= 9 ? 'Dormiste bien' : 'Dormiste bastante';
  const saveTime = (field, value) => setRecords((current) => { const previous = typeof current[selectedDate] === 'object' ? current[selectedDate] : { bedtime: 22 * 60, wakeTime: 6 * 60 }; const next = { ...previous, [field]: value }; next.hours = Number((((next.wakeTime - next.bedtime + 1440) % 1440) / 60).toFixed(1)); return { ...current, [selectedDate]: next }; });
  const lateBedtime = bedtime < 12 * 60;
  const recommendation = lateBedtime ? `Te dormiste a las ${formatTime(bedtime)}. Intenta dormir más temprano y mantener un horario constante.` : hours < 7 ? 'Dormiste menos de 7 horas. Intenta reservar más tiempo para descansar.' : hours > 10 ? 'Dormiste muchas horas; observa cómo te sientes y procura mantener un horario regular.' : 'Buen horario de descanso. Mantén esta rutina para favorecer tu bienestar.';
  return <ModulePage emoji="😴" title="Registro de sueño" subtitle="Registra a qué hora dormiste y despertaste"><DateHeading selectedDate={selectedDate} onOpen={() => setCalendarOpen(true)} /><CalendarPicker visible={calendarOpen} selectedDate={selectedDate} markedDates={Object.keys(records).filter((key) => sleepHours(records[key]) > 0)} onSelect={setSelectedDate} onClose={() => setCalendarOpen(false)} /><View style={styles.sleepSummary}><View><Text style={styles.sleepSummaryOverline}>TIEMPO DE DESCANSO</Text><Text style={styles.sleepSummaryNumber}>{hours} h</Text><Text style={styles.sleepSummaryStatus}>{status(hours)}</Text></View><View style={styles.sleepSummaryIcon}><Ionicons name="moon" size={32} color={C.white} /></View></View><Text style={styles.sleepInstruction}>Mantén presionado el círculo y deslízalo. Los horarios cambian cada 30 minutos.</Text><TimeSlider label="Me dormí" icon="moon-outline" value={bedtime} onChange={(value) => saveTime('bedtime', value)} color="#8564D8" rangeStart={19 * 60} rangeEnd={6 * 60} /><TimeSlider label="Me desperté" icon="sunny-outline" value={wakeTime} onChange={(value) => saveTime('wakeTime', value)} color="#E5A832" rangeStart={4 * 60} rangeEnd={18 * 60} /><View style={[styles.sleepAdvice, lateBedtime && styles.sleepAdviceWarning]}><Ionicons name={lateBedtime ? 'alert-circle' : 'checkmark-circle'} size={25} color={lateBedtime ? C.orange : C.green} /><View style={styles.sleepAdviceCopy}><Text style={styles.sleepAdviceTitle}>{lateBedtime ? 'Mejora tu horario' : 'Consejo de Life'}</Text><Text style={styles.sleepAdviceText}>{recommendation}</Text></View></View><Text style={styles.sectionTitle}>Historial de {MONTHS[selected.month]}</Text><View style={styles.weekTable}>{monthEntries.length ? monthEntries.map(([key, value]) => { const valueHours = sleepHours(value); return <Pressable key={key} style={styles.historyRow} onPress={() => setSelectedDate(key)}><Text style={styles.historyDate}>{prettyDate(key)}</Text><View><Text style={styles.historyValue}>{valueHours} horas</Text>{typeof value === 'object' && <Text style={styles.historyTime}>{formatTime(value.bedtime)} → {formatTime(value.wakeTime)}</Text>}<Text style={[styles.historyStatus, { color: valueHours >= 7 && valueHours <= 9 ? C.green : C.orange }]}>{status(valueHours)}</Text></View></Pressable>; }) : <Text style={styles.emptyHistory}>No hay registros de sueño en este mes.</Text>}<View style={styles.totalRow}><Text style={styles.totalLabel}>Promedio del mes</Text><Text style={styles.totalValue}>{average.toFixed(1)} horas</Text></View></View><Text style={styles.disclaimer}>La recomendación es orientativa y no sustituye consejo médico.</Text></ModulePage>;
}

function ResultScreen({ moves, onRestart }) {
  return <View style={styles.resultCard}><Text style={styles.resultEmoji}>🎉</Text><Text style={styles.resultTitle}>¡Encontraste todas!</Text><Text style={styles.feedback}>Terminaste en {moves} movimientos.</Text><Pressable style={styles.primary} onPress={onRestart}><Ionicons name="refresh" size={22} color={C.white} /><Text style={styles.primaryText}>Jugar nuevamente</Text></Pressable></View>;
}

function MemoryGameScreen() {
  const [theme, setTheme] = useState(null); const [cards, setCards] = useState([]); const [selected, setSelected] = useState([]); const [matched, setMatched] = useState([]); const [moves, setMoves] = useState(0); const [locked, setLocked] = useState(false);
  const startTheme = (nextTheme) => { setTheme(nextTheme); setCards(createDeck(nextTheme.pairs)); setSelected([]); setMatched([]); setMoves(0); setLocked(false); };
  const restart = () => { if (theme) startTheme(theme); };
  const choose = (card) => { if (locked || selected.includes(card.id) || matched.includes(card.id)) return; const next = [...selected, card.id]; setSelected(next); if (next.length === 2) { setMoves((value) => value + 1); setLocked(true); const first = cards.find((item) => item.id === next[0]); const isPair = first.pairId === card.pairId; setTimeout(() => { if (isPair) setMatched((value) => [...value, ...next]); setSelected([]); setLocked(false); }, isPair ? 400 : 800); } };
  if (!theme) return <SafeAreaView style={styles.safe}><LinearGradient colors={[C.bg, C.mint, C.cream]} style={styles.flex}><ScrollView contentContainerStyle={styles.page}><View style={styles.memoryWelcome}><View style={styles.memoryWelcomeIcon}><Ionicons name="game-controller" size={32} color={C.white} /></View><Text style={styles.memoryWelcomeOverline}>LIFE MEMORAMA</Text><Text style={styles.memoryWelcomeTitle}>¿Qué quieres jugar?</Text><Text style={styles.memoryWelcomeText}>Escoge un tablero y encuentra sus cuatro parejas.</Text></View><View style={styles.themeGrid}>{MEMORY_THEMES.map((item, index) => <Pressable key={item.key} onPress={() => startTheme(item)} style={[styles.memoryThemeCard, index === 0 && styles.memoryThemeFeatured]}><View style={[styles.memoryThemeIcon, { backgroundColor: item.tint }]}><Text style={styles.memoryThemeEmoji}>{item.emoji}</Text></View><View style={styles.memoryThemeCopy}><Text style={styles.memoryThemeNumber}>TABLERO {index + 1}</Text><Text style={styles.memoryThemeName}>{item.name}</Text><Text style={styles.memoryThemeSubtitle}>{item.subtitle}</Text></View><View style={[styles.memoryThemePlay, { backgroundColor: item.color }]}><Ionicons name="play" size={18} color={C.white} /></View></Pressable>)}</View><Text style={styles.memoryInternetNote}>Pokémon y Fortnite necesitan conexión para cargar sus imágenes la primera vez.</Text></ScrollView></LinearGradient></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.page}><View style={styles.gameHead}><View><Pressable style={styles.changeThemeButton} onPress={() => setTheme(null)}><Ionicons name="grid-outline" size={17} color={C.green} /><Text style={styles.changeThemeText}>Cambiar tablero</Text></Pressable><Text style={styles.gameTitle}>{theme.name}</Text><Text style={styles.gameSubtitle}>Encuentra las parejas iguales</Text></View><View style={styles.moveBadge}><Text style={styles.moveNumber}>{moves}</Text><Text style={styles.moveLabel}>movimientos</Text></View></View>{matched.length === cards.length ? <ResultScreen moves={moves} onRestart={restart} /> : <View style={styles.board}>{cards.map((card) => { const visible = selected.includes(card.id) || matched.includes(card.id); return <Pressable key={card.id} style={[styles.memoryCard, { backgroundColor: theme.color }, visible && styles.memoryOpen, matched.includes(card.id) && styles.memoryMatched]} onPress={() => choose(card)}>{visible ? <>{card.image ? <Image source={{ uri: card.image }} style={styles.cardImage} resizeMode="contain" /> : <Text style={styles.cardEmoji}>{card.symbol}</Text>}<Text numberOfLines={1} style={styles.cardLabel}>{card.label}</Text></> : <><Text style={styles.cardBackEmoji}>{theme.emoji}</Text><Ionicons name="help" size={20} color="rgba(255,255,255,0.78)" /></>}</Pressable>; })}</View>}<Pressable style={styles.outlineWide} onPress={restart}><Ionicons name="shuffle" size={20} color={C.dark} /><Text style={styles.outlineButtonText}>Reiniciar y mezclar</Text></Pressable></ScrollView></SafeAreaView>;
}

function GoalControl({ icon, label, description, value, unit, step, minimum, maximum, onChange, color }) {
  return <View style={styles.goalCard}><View style={[styles.goalIcon, { backgroundColor: `${color}18` }]}><Ionicons name={icon} size={27} color={color} /></View><View style={styles.goalCopy}><Text style={styles.goalLabel}>{label}</Text><Text style={styles.goalDescription}>{description}</Text></View><View style={styles.goalCounter}><Pressable style={styles.goalButton} onPress={() => onChange(Math.max(minimum, value - step))}><Text style={styles.goalButtonText}>−</Text></Pressable><View style={styles.goalValueBox}><Text style={styles.goalValue}>{value}</Text><Text style={styles.goalUnit}>{unit}</Text></View><Pressable style={styles.goalButton} onPress={() => onChange(Math.min(maximum, value + step))}><Text style={styles.goalButtonText}>+</Text></Pressable></View></View>;
}

function ProfileScreen() {
  const [profile, setProfile] = useStoredState('life-profile', DEFAULT_PROFILE);
  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ModulePage emoji={profile.avatar} title="Mi perfil" subtitle="Personaliza tu experiencia en Life">
    <View style={styles.profileCard}>
      <LinearGradient colors={[C.mint, C.card]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileAvatarArea}><View style={styles.profileAvatar}><Text style={styles.profileAvatarEmoji}>{profile.avatar}</Text></View><Text style={styles.profilePreviewName}>{profile.name || 'Tu nombre'}</Text><Text style={styles.profilePreviewGoal}>{profile.objective}</Text></LinearGradient>
      <Text style={styles.profileSectionLabel}>ELIGE TU AVATAR</Text><View style={styles.avatarList}>{PROFILE_AVATARS.map((avatar) => <Pressable key={avatar} style={[styles.avatarChoice, profile.avatar === avatar && styles.avatarChoiceActive]} onPress={() => update('avatar', avatar)}><Text style={styles.avatarChoiceEmoji}>{avatar}</Text>{profile.avatar === avatar && <View style={styles.avatarCheck}><Ionicons name="checkmark" size={11} color={C.white} /></View>}</Pressable>)}</View>
      <Text style={styles.inputLabel}>Nombre</Text><View style={styles.profileInputRow}><Ionicons name="person-outline" size={20} color={C.green} /><TextInput value={profile.name} onChangeText={(value) => update('name', value)} placeholder="Escribe tu nombre" placeholderTextColor="#9AABA6" style={styles.profileInput} maxLength={24} /></View>
      <Text style={[styles.inputLabel, styles.profileFieldGap]}>Edad</Text><View style={styles.profileInputRow}><Ionicons name="calendar-outline" size={20} color={C.green} /><TextInput value={profile.age} onChangeText={(value) => update('age', value.replace(/[^0-9]/g, '').slice(0, 3))} placeholder="Escribe tu edad" placeholderTextColor="#9AABA6" style={styles.profileInput} keyboardType="number-pad" /></View>
      <Text style={styles.profileSectionLabel}>MI OBJETIVO PRINCIPAL</Text><View style={styles.objectiveList}>{PROFILE_OBJECTIVES.map((objective) => { const active = profile.objective === objective; return <Pressable key={objective} style={[styles.objectiveChoice, active && styles.objectiveChoiceActive]} onPress={() => update('objective', objective)}><View style={[styles.objectiveRadio, active && styles.objectiveRadioActive]}>{active && <View style={styles.objectiveRadioDot} />}</View><Text style={[styles.objectiveText, active && styles.objectiveTextActive]}>{objective}</Text></Pressable>; })}</View>
      <View style={styles.autoSaveBox}><Ionicons name="cloud-done" size={21} color={C.green} /><View><Text style={styles.autoSaveTitle}>Guardado automático</Text><Text style={styles.autoSaveText}>Tu perfil permanece en este dispositivo.</Text></View></View>
    </View>
  </ModulePage></KeyboardAvoidingView>;
}

const THEME_OPTIONS = [
  { key: 'light', title: 'Modo claro', description: 'Colores luminosos y suaves', icon: 'sunny' },
  { key: 'dark', title: 'Modo oscuro', description: 'Menos brillo para la noche', icon: 'moon' },
  { key: 'system', title: 'Usar configuración del celular', description: 'Cambia automáticamente con tu dispositivo', icon: 'phone-portrait' },
];

function AppearanceScreen() {
  const { mode, setMode, isDark } = useContext(ThemeContext);
  return <ModulePage emoji={isDark ? '🌙' : '☀️'} title="Apariencia" subtitle="Elige cómo quieres ver Life">
    <View style={styles.appearancePreview}>
      <View style={styles.appearanceLogo}><Image source={LIFE_LOGO} style={styles.appearanceLogoImage} /></View>
      <View style={styles.appearancePreviewCopy}><Text style={styles.appearancePreviewTitle}>Vista actual</Text><Text style={styles.appearancePreviewText}>{isDark ? 'Tema oscuro activo' : 'Tema claro activo'}</Text></View>
      <Ionicons name={isDark ? 'moon' : 'sunny'} size={26} color={C.orange} />
    </View>
    <Text style={styles.appearanceHeading}>SELECCIONA UN TEMA</Text>
    <View style={styles.themeList}>{THEME_OPTIONS.map((option) => { const active = mode === option.key; return <Pressable key={option.key} onPress={() => setMode(option.key)} style={[styles.themeOption, active && styles.themeOptionActive]}><View style={[styles.themeOptionIcon, active && styles.themeOptionIconActive]}><Ionicons name={option.icon} size={25} color={active ? C.white : C.green} /></View><View style={styles.themeOptionCopy}><Text style={[styles.themeOptionTitle, active && styles.themeOptionTitleActive]}>{option.title}</Text><Text style={styles.themeOptionText}>{option.description}</Text></View><Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={25} color={active ? C.green : C.muted} /></Pressable>; })}</View>
    <View style={styles.themeInfo}><Ionicons name="information-circle" size={21} color={C.green} /><Text style={styles.themeInfoText}>Tu preferencia se guarda automáticamente en este celular.</Text></View>
  </ModulePage>;
}

function GoalsScreen() {
  const [goals, setGoals] = useStoredState('life-goals', DEFAULT_GOALS);
  const update = (name, value) => setGoals((current) => ({ ...current, [name]: value }));
  return <ModulePage emoji="🎯" title="Mis metas" subtitle="Personaliza tus objetivos diarios">
    <View style={styles.goalIntro}><Ionicons name="sparkles" size={24} color={C.green} /><Text style={styles.goalIntroText}>Tus barras de progreso y rachas se calculan usando estos valores.</Text></View>
    <GoalControl icon="water" label="Agua" description="Vasos de 600 ml" value={goals.water} unit="vasos" step={1} minimum={1} maximum={15} onChange={(value) => update('water', value)} color="#3D9DE0" />
    <GoalControl icon="moon" label="Sueño" description="Descanso por noche" value={goals.sleep} unit="horas" step={0.5} minimum={1} maximum={14} onChange={(value) => update('sleep', value)} color="#8564D8" />
    <GoalControl icon="fitness" label="Ejercicio" description="Repeticiones diarias" value={goals.exercise} unit="rep." step={5} minimum={5} maximum={200} onChange={(value) => update('exercise', value)} color="#E05766" />
    <GoalControl icon="nutrition" label="Proteína" description="Meta nutricional personal" value={goals.protein} unit="gramos" step={5} minimum={5} maximum={300} onChange={(value) => update('protein', value)} color="#E68A45" />
    <GoalControl icon="restaurant" label="Carbohidratos" description="Meta nutricional personal" value={goals.carbs} unit="gramos" step={10} minimum={10} maximum={600} onChange={(value) => update('carbs', value)} color="#D8A32E" />
    <Pressable style={styles.resetGoals} onPress={() => setGoals(DEFAULT_GOALS)}><Ionicons name="refresh" size={20} color={C.dark} /><Text style={styles.resetGoalsText}>Restaurar metas recomendadas</Text></Pressable>
    <Text style={styles.disclaimer}>Estas metas son herramientas de seguimiento y no constituyen una recomendación médica o nutricional.</Text>
  </ModulePage>;
}

const DRAWER_MENU = [
  { name: 'Life', label: 'Inicio', subtitle: 'Resumen de tu día', icon: 'home', color: '#238B69', tint: '#E2F5EE' },
  { name: 'Perfil', label: 'Mi perfil', subtitle: 'Datos y objetivo personal', icon: 'person', color: '#287CB5', tint: '#E4F2FA' },
  { name: 'Agua', label: 'Agua', subtitle: 'Hidratación diaria', icon: 'water', color: '#3D9DE0', tint: '#E5F4FF' },
  { name: 'Alimentación', label: 'Alimentación', subtitle: 'Comidas y nutrientes', icon: 'nutrition', color: '#E68A45', tint: '#FFF0E4' },
  { name: 'Ejercicio', label: 'Ejercicio', subtitle: 'Rutinas y repeticiones', icon: 'fitness', color: '#E05766', tint: '#FFE9EC' },
  { name: 'Dormir', label: 'Dormir', subtitle: 'Descanso y promedio', icon: 'moon', color: '#8564D8', tint: '#F0EBFF' },
  { name: 'Metas', label: 'Mis metas', subtitle: 'Personaliza tus objetivos', icon: 'flag', color: '#D99B29', tint: '#FFF5D9' },
  { name: 'Estadísticas', label: 'Estadísticas', subtitle: 'Gráficas y comparaciones', icon: 'stats-chart', color: '#2E9A81', tint: '#DFF5EE' },
  { name: 'Apariencia', label: 'Apariencia', subtitle: 'Claro, oscuro o automático', icon: 'color-palette', color: '#4B73D1', tint: '#E9EEFF' },
  { name: 'Información', label: 'Información', subtitle: 'Conoce la aplicación', icon: 'information-circle', color: '#57736C', tint: '#EAF1EF' },
];

function CustomDrawerContent({ state, navigation }) {
  const status = useDrawerStatus();
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(DRAWER_MENU.map(() => new Animated.Value(0))).current;
  const [water] = useStoredState('life-water-calendar', {});
  const [food] = useStoredState('life-food-calendar', {});
  const [exercise] = useStoredState('life-exercise-calendar', {});
  const [sleep] = useStoredState('life-sleep-calendar', {});
  const [goals] = useStoredState('life-goals', DEFAULT_GOALS);
  const [profile] = useStoredState('life-profile', DEFAULT_PROFILE);
  const today = todayKey();
  const meals = food[today] || EMPTY_MEALS.lun;
  const mealCount = MEALS.filter((meal) => meals[meal.key]?.food).length;
  const repetitions = Object.values(exercise[today] || {}).reduce((sum, value) => sum + exerciseTotal(value), 0);
  const completed = [Number(water[today] || 0) >= goals.water, mealCount === 3, repetitions >= goals.exercise, sleepHours(sleep[today]) >= 7].filter(Boolean).length;

  useEffect(() => {
    if (status === 'open') {
      headerAnimation.setValue(0);
      itemAnimations.forEach((animation) => animation.setValue(0));
      Animated.sequence([
        Animated.timing(headerAnimation, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.stagger(55, itemAnimations.map((animation) => Animated.spring(animation, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }))),
      ]).start();
    }
  }, [headerAnimation, itemAnimations, status]);

  return <View style={styles.drawerRoot}>
    <LinearGradient colors={['#0C342D', '#17604F', '#23906D']} style={styles.drawerHero}>
      <View style={styles.drawerGlowOne} /><View style={styles.drawerGlowTwo} />
      <Animated.View style={{ opacity: headerAnimation, transform: [{ translateY: headerAnimation.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] }}>
        <View style={styles.drawerBrandRow}><View style={styles.drawerLogo}><Image source={LIFE_LOGO} style={styles.drawerLogoImage} /></View><View><Text style={styles.drawerBrand}>Life</Text><Text style={styles.drawerTagline}>Tu bienestar, cada día</Text></View></View>
        <Pressable style={styles.drawerProfile} onPress={() => { navigation.navigate('Perfil'); navigation.closeDrawer(); }}><View style={styles.drawerProfileAvatar}><Text style={styles.drawerProfileEmoji}>{profile.avatar}</Text></View><View style={styles.drawerProfileCopy}><Text style={styles.drawerProfileName}>{profile.name || 'Completa tu perfil'}</Text><Text style={styles.drawerProfileGoal}>{profile.age ? `${profile.age} años · ` : ''}{profile.objective}</Text></View><Ionicons name="pencil" size={16} color="#CDEBDF" /></Pressable>
        <View style={styles.drawerProgressCard}><View style={styles.drawerProgressTop}><Text style={styles.drawerProgressTitle}>Progreso de hoy</Text><Text style={styles.drawerProgressScore}>{completed}/4</Text></View><View style={styles.drawerProgressTrack}><View style={[styles.drawerProgressFill, { width: `${completed * 25}%` }]} /></View><Text style={styles.drawerProgressHint}>{completed === 4 ? '¡Excelente, completaste tu día!' : 'Cada pequeño hábito cuenta.'}</Text></View>
      </Animated.View>
    </LinearGradient>
    <DrawerContentScrollView contentContainerStyle={styles.drawerScroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.drawerSectionLabel}>NAVEGACIÓN</Text>
      {DRAWER_MENU.map((item, index) => {
        const active = state.routeNames[state.index] === item.name;
        const animation = itemAnimations[index];
        return <Animated.View key={item.name} style={{ opacity: animation, transform: [{ translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-34, 0] }) }] }}><Pressable style={({ pressed }) => [styles.drawerItem, active && styles.drawerItemActive, pressed && styles.drawerItemPressed]} onPress={() => { navigation.navigate(item.name); navigation.closeDrawer(); }}><View style={[styles.drawerItemIcon, { backgroundColor: item.tint }]}><Ionicons name={item.icon} size={23} color={item.color} /></View><View style={styles.drawerItemCopy}><Text style={[styles.drawerItemTitle, active && styles.drawerItemTitleActive]}>{item.label}</Text><Text style={styles.drawerItemSubtitle}>{item.subtitle}</Text></View>{active ? <View style={[styles.drawerActiveDot, { backgroundColor: item.color }]} /> : <Ionicons name="chevron-forward" size={18} color="#A7B5B1" />}</Pressable></Animated.View>;
      })}
      <View style={styles.drawerQuote}><Ionicons name="heart" size={18} color="#E05766" /><Text style={styles.drawerQuoteText}>“El progreso comienza con un pequeño paso.”</Text></View>
    </DrawerContentScrollView>
    <View style={styles.drawerFooter}><View style={styles.drawerFooterLine} /><Text style={styles.drawerFooterText}>LIFE · EJERCICIO 10</Text><Text style={styles.drawerFooterVersion}>Versión 1.0</Text></View>
  </View>;
}

function StatisticsScreen() {
  const [water] = useStoredState('life-water-calendar', {});
  const [food] = useStoredState('life-food-calendar', {});
  const [exercise] = useStoredState('life-exercise-calendar', {});
  const [sleep] = useStoredState('life-sleep-calendar', {});
  const [goals] = useStoredState('life-goals', DEFAULT_GOALS);
  const getDateKey = (offset) => { const now = new Date(); const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset); return toDateKey(date.getFullYear(), date.getMonth(), date.getDate()); };
  const currentWeek = Array.from({ length: 7 }, (_, index) => getDateKey(index - 6));
  const previousWeek = Array.from({ length: 7 }, (_, index) => getDateKey(index - 13));
  const habitsFor = (key) => {
    const meals = food[key] || EMPTY_MEALS.lun;
    const mealCount = MEALS.filter((meal) => meals[meal.key]?.food).length;
    const repetitions = Object.values(exercise[key] || {}).reduce((sum, value) => sum + exerciseTotal(value), 0);
    return [Number(water[key] || 0) >= goals.water, mealCount === 3, repetitions >= goals.exercise, sleepHours(sleep[key]) >= goals.sleep];
  };
  const scoreFor = (key) => habitsFor(key).filter(Boolean).length * 25;
  const averageScore = (keys) => Math.round(keys.reduce((sum, key) => sum + scoreFor(key), 0) / keys.length);
  const weeklyScore = averageScore(currentWeek);
  const previousScore = averageScore(previousWeek);
  const comparison = weeklyScore - previousScore;
  const bestKey = currentWeek.reduce((best, key) => scoreFor(key) > scoreFor(best) ? key : best, currentWeek[0]);
  const habitPercentages = [0, 1, 2, 3].map((habitIndex) => Math.round((currentWeek.filter((key) => habitsFor(key)[habitIndex]).length / 7) * 100));
  const monthWeeks = Array.from({ length: 4 }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => getDateKey(dayIndex - 27 + weekIndex * 7)));
  const monthlyAverage = Math.round(monthWeeks.reduce((sum, keys) => sum + averageScore(keys), 0) / 4);
  const habitStats = [
    { label: 'Agua', icon: 'water', color: '#3D9DE0', value: habitPercentages[0] },
    { label: 'Alimentación', icon: 'nutrition', color: '#E68A45', value: habitPercentages[1] },
    { label: 'Ejercicio', icon: 'fitness', color: '#E05766', value: habitPercentages[2] },
    { label: 'Dormir', icon: 'moon', color: '#8564D8', value: habitPercentages[3] },
  ];
  return <ModulePage emoji="📊" title="Estadísticas" subtitle="Descubre cómo avanzan tus hábitos">
    <View style={styles.statsSummaryGrid}><View style={styles.statsSummaryCard}><Text style={styles.statsSummaryOverline}>ESTA SEMANA</Text><Text style={styles.statsSummaryValue}>{weeklyScore}%</Text><Text style={styles.statsSummaryText}>cumplimiento general</Text></View><View style={styles.statsSummaryCard}><Text style={styles.statsSummaryOverline}>ÚLTIMOS 28 DÍAS</Text><Text style={styles.statsSummaryValue}>{monthlyAverage}%</Text><Text style={styles.statsSummaryText}>promedio mensual</Text></View></View>
    <View style={[styles.comparisonCard, { borderColor: comparison >= 0 ? C.green : C.orange }]}><View style={[styles.comparisonIcon, { backgroundColor: comparison >= 0 ? C.mint : C.cream }]}><Ionicons name={comparison >= 0 ? 'trending-up' : 'trending-down'} size={28} color={comparison >= 0 ? C.green : C.orange} /></View><View style={styles.comparisonCopy}><Text style={styles.comparisonTitle}>{comparison >= 0 ? `Mejoraste ${comparison} puntos` : `Bajaste ${Math.abs(comparison)} puntos`}</Text><Text style={styles.comparisonText}>Semana anterior: {previousScore}% · Semana actual: {weeklyScore}%</Text></View></View>
    <Text style={styles.sectionTitle}>Progreso semanal</Text><View style={styles.weeklyChart}>{currentWeek.map((key) => { const parsed = readDateKey(key); const value = scoreFor(key); return <View key={key} style={styles.weeklyColumn}><Text style={styles.weeklyValue}>{value}%</Text><View style={styles.weeklyTrack}><View style={[styles.weeklyFill, { height: `${Math.max(value, 4)}%` }]} /></View><Text style={styles.weeklyDay}>{WEEK_DAYS[new Date(parsed.year, parsed.month, parsed.day).getDay()]}</Text></View>; })}</View>
    <View style={styles.bestDayCard}><View style={styles.bestDayIcon}><Ionicons name="trophy" size={27} color="#A66D00" /></View><View><Text style={styles.bestDayOverline}>MEJOR DÍA DE LA SEMANA</Text><Text style={styles.bestDayTitle}>{prettyDate(bestKey)}</Text><Text style={styles.bestDayText}>{scoreFor(bestKey)}% de hábitos completados</Text></View></View>
    <Text style={styles.sectionTitle}>Cumplimiento por hábito</Text><View style={styles.habitStats}>{habitStats.map((habit) => <View key={habit.label} style={styles.habitStatRow}><View style={[styles.habitStatIcon, { backgroundColor: `${habit.color}20` }]}><Ionicons name={habit.icon} size={21} color={habit.color} /></View><View style={styles.habitStatCopy}><View style={styles.habitStatTop}><Text style={styles.habitStatLabel}>{habit.label}</Text><Text style={[styles.habitStatValue, { color: habit.color }]}>{habit.value}%</Text></View><View style={styles.habitStatTrack}><View style={[styles.habitStatFill, { width: `${habit.value}%`, backgroundColor: habit.color }]} /></View><Text style={styles.habitStatHint}>{Math.round((habit.value / 100) * 7)} de 7 días con meta cumplida</Text></View></View>)}</View>
    <Text style={styles.sectionTitle}>Comparación mensual</Text><View style={styles.monthChart}>{monthWeeks.map((keys, index) => { const value = averageScore(keys); return <View key={index} style={styles.monthColumn}><View style={styles.monthTrack}><View style={[styles.monthFill, { height: `${Math.max(value, 4)}%` }]} /></View><Text style={styles.monthValue}>{value}%</Text><Text style={styles.monthLabel}>Sem. {index + 1}</Text></View>; })}</View>
    <Text style={styles.disclaimer}>Los porcentajes se calculan con tus metas personales y los registros guardados en este dispositivo.</Text>
  </ModulePage>;
}

function AboutScreen() {
  return <ModulePage emoji="🧠" title="Acerca de Life" subtitle="Proyecto escolar · Ejercicio 10"><View style={styles.mainCard}><Text style={styles.aboutTitle}>Funciones incluidas</Text>{['Splash Screen animado', 'Memorama funcional', 'Registro semanal de agua', 'Registro de comidas y nutrientes', 'Catálogo y contador de ejercicios', 'Registro y promedio de sueño', 'TabNavigation y DrawerNavigation'].map((item) => <View key={item} style={styles.aboutRow}><Ionicons name="checkmark-circle" size={22} color={C.green} /><Text style={styles.aboutText}>{item}</Text></View>)}</View></ModulePage>;
}

const Tab = createBottomTabNavigator(); const Drawer = createDrawerNavigator();
function TabNavigation() { return <Tab.Navigator screenOptions={({ route, navigation }) => ({ headerStyle: { backgroundColor: C.green }, headerTintColor: C.white, headerLeft: () => <Pressable style={styles.menuButton} onPress={() => navigation.getParent()?.openDrawer()}><Ionicons name="menu" size={28} color={C.white} /></Pressable>, tabBarActiveTintColor: C.green, tabBarInactiveTintColor: C.muted, tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 8, backgroundColor: C.card, borderTopColor: C.line }, tabBarIcon: ({ color, size }) => <Ionicons name={route.name === 'Inicio' ? 'home' : 'game-controller'} color={color} size={size} /> })}><Tab.Screen name="Inicio" component={HomeScreen} /><Tab.Screen name="Jugar" component={MemoryGameScreen} /></Tab.Navigator>; }
function DrawerNavigation() { const drawerHeader = { headerShown: true, headerStyle: { backgroundColor: C.green }, headerTintColor: C.white }; return <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ drawerType: 'front', overlayColor: 'rgba(8,31,25,0.48)', drawerStyle: { width: '86%', backgroundColor: C.bg }, swipeEdgeWidth: 80 }}><Drawer.Screen name="Life" component={TabNavigation} options={{ headerShown: false }} /><Drawer.Screen name="Perfil" component={ProfileScreen} options={drawerHeader} /><Drawer.Screen name="Agua" component={WaterScreen} options={drawerHeader} /><Drawer.Screen name="Alimentación" component={FoodScreen} options={drawerHeader} /><Drawer.Screen name="Ejercicio" component={ExerciseScreen} options={drawerHeader} /><Drawer.Screen name="Dormir" component={SleepScreen} options={drawerHeader} /><Drawer.Screen name="Metas" component={GoalsScreen} options={drawerHeader} /><Drawer.Screen name="Estadísticas" component={StatisticsScreen} options={drawerHeader} /><Drawer.Screen name="Apariencia" component={AppearanceScreen} options={drawerHeader} /><Drawer.Screen name="Información" component={AboutScreen} options={drawerHeader} /></Drawer.Navigator>; }

export default function App() {
  const [loading, setLoading] = useState(true);
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useStoredState('life-theme', 'system');
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  C = isDark ? DARK_COLORS : LIGHT_COLORS;
  styles = createStyles(C);
  const baseNavigationTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = { ...baseNavigationTheme, colors: { ...baseNavigationTheme.colors, primary: C.green, background: C.bg, card: C.card, text: C.ink, border: C.line, notification: C.orange } };
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 2200); return () => clearTimeout(timer); }, []);
  if (loading) return <SplashScreen />;
  return <ThemeContext.Provider value={{ mode: themeMode, setMode: setThemeMode, isDark }}><NavigationContainer theme={navigationTheme}><StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bg} /><DrawerNavigation /></NavigationContainer></ThemeContext.Provider>;
}

function createStyles(C) { const definitions = {
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: C.bg }, page: { padding: 18, paddingBottom: 42 }, backgroundOrb: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(69,196,154,0.10)', right: -110, top: 130 }, splash: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, overflow: 'hidden' }, splashGlow: { position: 'absolute', width: 380, height: 380, borderRadius: 190, backgroundColor: 'rgba(255,255,255,0.08)', top: -130, right: -130 }, splashLogo: { width: 142, height: 142, borderRadius: 71, padding: 5, backgroundColor: 'rgba(255,255,255,0.24)', shadowColor: '#001B14', shadowOpacity: 0.3, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 10 }, splashLogoInner: { flex: 1, borderRadius: 67, alignItems: 'center', justifyContent: 'center' }, splashEmoji: { fontSize: 72 }, splashTitle: { color: C.white, fontSize: 50, fontWeight: '900', marginTop: 21, letterSpacing: 1 }, splashText: { color: '#DDF3EB', fontSize: 16, textAlign: 'center', marginTop: 6 }, splashPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginTop: 25 }, splashPillText: { color: '#FFF1C9', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  hero: { backgroundColor: C.white, borderRadius: 25, padding: 23, elevation: 3 }, overline: { color: C.green, fontSize: 12, fontWeight: '900', letterSpacing: 1.4 }, heroTitle: { color: C.ink, fontSize: 30, fontWeight: '900', marginTop: 8 }, heroText: { color: C.muted, fontSize: 16, lineHeight: 23, marginTop: 9, marginBottom: 21 }, primary: { backgroundColor: C.green, borderRadius: 14, minHeight: 50, paddingHorizontal: 20, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: C.white, fontWeight: '900', fontSize: 15 }, sectionTitle: { color: C.ink, fontSize: 20, fontWeight: '900', marginTop: 24, marginBottom: 12 }, homeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, homeHabit: { width: '48%', backgroundColor: C.white, borderRadius: 20, padding: 17, marginBottom: 13, elevation: 2 }, homeEmoji: { fontSize: 37 }, homeHabitTitle: { color: C.ink, fontSize: 17, fontWeight: '900', marginTop: 8 }, homeHabitLink: { color: C.green, fontSize: 12, fontWeight: '700', marginTop: 5 },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 17, borderRadius: 24, padding: 18, shadowColor: '#123D33', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6 }, moduleIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line }, moduleEmoji: { fontSize: 39 }, moduleHeadCopy: { flex: 1, marginLeft: 14 }, moduleTitle: { color: C.white, fontSize: 27, fontWeight: '900' }, moduleSubtitle: { color: '#CDEBDF', lineHeight: 20, marginTop: 3 }, dayList: { gap: 8, paddingBottom: 14 }, dayChip: { minWidth: 48, paddingVertical: 11, paddingHorizontal: 10, backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: C.line, alignItems: 'center' }, dayChipActive: { backgroundColor: C.green, borderColor: C.green }, dayChipText: { color: C.muted, fontWeight: '800' }, dayChipTextActive: { color: C.white },
  mainCard: { backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 24, padding: 21, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#17483C', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, selectedDay: { color: C.ink, fontSize: 18, fontWeight: '900', textAlign: 'center' }, bigNumber: { color: C.green, fontSize: 65, fontWeight: '900', textAlign: 'center', marginTop: 7 }, bigUnit: { color: C.muted, fontSize: 16, textAlign: 'center', marginBottom: 20 }, progress: { height: 17, borderRadius: 9, backgroundColor: C.line, overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: C.teal, borderRadius: 9 }, feedback: { color: C.ink, fontSize: 16, lineHeight: 22, textAlign: 'center', marginVertical: 18 }, twoButtons: { flexDirection: 'row', gap: 10 }, outlineButton: { flex: 1, minHeight: 47, borderRadius: 13, borderWidth: 2, borderColor: C.line, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }, outlineButtonText: { color: C.dark, fontWeight: '900', textAlign: 'center' }, primarySmall: { flex: 1.35, minHeight: 47, borderRadius: 13, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  weekTable: { backgroundColor: C.white, borderRadius: 20, padding: 15, elevation: 2 }, weekRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EDF3F1' }, weekDay: { width: '34%', color: C.ink, fontWeight: '800' }, weekValue: { width: '27%', color: C.muted }, weekStatus: { flex: 1, fontSize: 12, fontWeight: '900', textAlign: 'right' }, totalRow: { marginTop: 14, padding: 14, borderRadius: 13, backgroundColor: C.mint, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, totalLabel: { color: C.dark, fontWeight: '900', fontSize: 16 }, totalValue: { color: C.green, fontWeight: '900' }, disclaimer: { color: C.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 14 },
  mealCard: { backgroundColor: C.white, borderRadius: 20, padding: 17, marginBottom: 13, elevation: 2 }, mealTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 }, mealTitle: { color: C.ink, fontSize: 19, fontWeight: '900' }, inputLabel: { color: C.muted, fontSize: 12, fontWeight: '800', marginBottom: 5 }, textInput: { minHeight: 46, borderWidth: 1, borderColor: C.line, borderRadius: 12, backgroundColor: '#FAFCFB', paddingHorizontal: 13, color: C.ink, fontSize: 15 }, nutrients: { flexDirection: 'row', gap: 10, marginTop: 12 }, nutrientField: { flex: 1 }, nutritionTotal: { backgroundColor: C.mint, borderRadius: 20, padding: 18, marginTop: 3 }, nutritionNumbers: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }, nutritionStat: { color: C.green, fontSize: 21, fontWeight: '900' }, nutritionCaption: { color: C.dark, fontSize: 11, fontWeight: '600' },
  quickFoodCard: { backgroundColor: C.card, borderRadius: 22, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: C.line, elevation: 3 }, quickFoodHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, quickFoodOverline: { color: C.green, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, quickFoodTitle: { color: C.ink, fontSize: 20, fontWeight: '900', marginTop: 3 }, quickFoodHelp: { color: C.muted, fontSize: 11, fontWeight: '800', marginTop: 14, marginBottom: 7 }, quickMealTabs: { flexDirection: 'row', gap: 7 }, quickMealTab: { flex: 1, minHeight: 39, borderRadius: 12, backgroundColor: C.input, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, quickMealTabActive: { backgroundColor: C.green, borderColor: C.green }, quickMealTabText: { color: C.muted, fontSize: 11, fontWeight: '800' }, quickMealTabTextActive: { color: C.white, fontWeight: '900' }, quickFoodList: { gap: 9, paddingRight: 5 }, quickFoodItem: { width: 132, minHeight: 137, borderRadius: 17, backgroundColor: C.input, borderWidth: 1, borderColor: C.line, padding: 11 }, quickFoodEmoji: { fontSize: 27 }, quickFoodName: { color: C.ink, fontSize: 14, fontWeight: '900', marginTop: 5 }, quickFoodPortion: { color: C.muted, fontSize: 9, marginTop: 2 }, quickFoodMacros: { color: C.green, fontSize: 10, fontWeight: '900', marginTop: 7 }, quickFoodAdd: { position: 'absolute', right: 9, top: 9, width: 24, height: 24, borderRadius: 8, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }, quickFoodSource: { color: C.muted, fontSize: 9, lineHeight: 14, marginTop: 11 },
  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, muscleCard: { width: '48%', backgroundColor: C.white, borderRadius: 20, padding: 18, marginBottom: 13, elevation: 2 }, muscleIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, muscleTitle: { color: C.ink, fontSize: 19, fontWeight: '900', marginTop: 13 }, muscleCount: { color: C.muted, fontSize: 12, marginTop: 3 }, exerciseList: { gap: 11 }, exerciseRow: { minHeight: 70, backgroundColor: C.white, borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', elevation: 2 }, exerciseIndex: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, exerciseIndexText: { color: C.green, fontWeight: '900', fontSize: 17 }, exerciseName: { flex: 1, color: C.ink, fontSize: 16, fontWeight: '800', marginLeft: 13 }, backLink: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 15 }, backText: { color: C.dark, fontWeight: '800' }, repButton: { minHeight: 155, backgroundColor: C.green, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }, repButtonText: { color: C.white, fontWeight: '900', marginTop: 5 }, tip: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#FFF0D7', padding: 16, borderRadius: 16, marginTop: 8 }, tipText: { flex: 1, color: '#805819', lineHeight: 20 },
  counterButtons: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginBottom: 20 }, circleButton: { width: 66, height: 66, borderRadius: 33, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }, circleText: { color: C.white, fontSize: 37 }, sleepMessage: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: C.mint, borderRadius: 15, padding: 15 }, sleepMessageText: { color: C.dark, fontWeight: '900', fontSize: 16 },
  coachCard: { backgroundColor: C.deep, borderRadius: 21, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 14 }, coachIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }, coachCopy: { flex: 1, marginLeft: 13 }, coachOverline: { color: '#8FE4C5', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, coachTitle: { color: C.white, fontSize: 16, fontWeight: '900', marginTop: 3 }, coachText: { color: '#C6E5DA', fontSize: 11, lineHeight: 16, marginTop: 3 }, seriesList: { gap: 10 }, seriesCard: { minHeight: 78, backgroundColor: C.card, borderRadius: 19, borderWidth: 1, borderColor: C.line, padding: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 }, seriesBadge: { width: 39, height: 39, borderRadius: 13, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, seriesBadgeText: { color: C.green, fontSize: 18, fontWeight: '900' }, seriesCopy: { flex: 1, marginLeft: 10 }, seriesTitle: { color: C.ink, fontSize: 14, fontWeight: '900' }, seriesGoal: { color: C.muted, fontSize: 9, marginTop: 3 }, seriesButton: { width: 35, height: 35, borderRadius: 12, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, seriesButtonAdd: { backgroundColor: C.green }, seriesNumber: { color: C.ink, fontSize: 22, fontWeight: '900', minWidth: 39, textAlign: 'center' }, addSeriesButton: { minHeight: 48, borderWidth: 2, borderColor: C.line, borderStyle: 'dashed', borderRadius: 15, flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center', marginTop: 11 }, addSeriesText: { color: C.green, fontWeight: '900' }, exerciseTotalCard: { backgroundColor: C.mint, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 }, exerciseTotalLabel: { color: C.green, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 }, exerciseTotalText: { color: C.dark, fontSize: 12, marginTop: 3 }, exerciseTotalNumber: { color: C.green, fontSize: 24, fontWeight: '900' },
  sleepSummary: { backgroundColor: C.deep, borderRadius: 23, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, sleepSummaryOverline: { color: '#B9DDFF', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, sleepSummaryNumber: { color: C.white, fontSize: 42, lineHeight: 47, fontWeight: '900', marginTop: 2 }, sleepSummaryStatus: { color: '#D7E7E2', fontSize: 12, fontWeight: '700' }, sleepSummaryIcon: { width: 61, height: 61, borderRadius: 21, backgroundColor: '#8564D8', alignItems: 'center', justifyContent: 'center' }, sleepInstruction: { color: C.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginBottom: 11 }, timeSliderCard: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.line, padding: 16, marginBottom: 11, elevation: 2 }, timeSliderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, timeSliderLabel: { flexDirection: 'row', alignItems: 'center', gap: 7 }, timeSliderTitle: { color: C.ink, fontSize: 14, fontWeight: '900' }, timeSliderValue: { fontSize: 16, fontWeight: '900' }, timeTrackWrap: { height: 36, justifyContent: 'center', marginTop: 10, marginHorizontal: 11 }, timeTrack: { height: 8, borderRadius: 4, backgroundColor: C.line, overflow: 'hidden' }, timeTrackFill: { height: '100%', borderRadius: 4 }, timeThumb: { position: 'absolute', width: 28, height: 28, marginLeft: -14, borderRadius: 14, backgroundColor: C.card, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 4 }, timeThumbInner: { width: 10, height: 10, borderRadius: 5 }, timeLabels: { flexDirection: 'row', justifyContent: 'space-between' }, timeLabelText: { color: C.muted, fontSize: 9, fontWeight: '700' }, sleepAdvice: { backgroundColor: C.mint, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'flex-start', marginTop: 3 }, sleepAdviceWarning: { backgroundColor: C.cream, borderWidth: 1, borderColor: C.orange }, sleepAdviceCopy: { flex: 1, marginLeft: 10 }, sleepAdviceTitle: { color: C.ink, fontSize: 14, fontWeight: '900' }, sleepAdviceText: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 3 }, historyTime: { color: C.muted, fontSize: 9, textAlign: 'right', marginTop: 2 },
  gameHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }, gameTitle: { color: C.ink, fontSize: 25, fontWeight: '900' }, moveBadge: { backgroundColor: C.mint, borderRadius: 14, padding: 9, alignItems: 'center' }, moveNumber: { color: C.green, fontSize: 20, fontWeight: '900' }, moveLabel: { color: C.dark, fontSize: 9 }, board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, memoryCard: { width: '47.5%', aspectRatio: 1.08, borderRadius: 18, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginBottom: 14, elevation: 3 }, memoryOpen: { backgroundColor: C.white, borderWidth: 2, borderColor: C.mint }, memoryMatched: { backgroundColor: C.mint, borderColor: C.green }, cardEmoji: { fontSize: 46 }, cardLabel: { color: C.ink, fontSize: 13, fontWeight: '800', marginTop: 5 }, outlineWide: { minHeight: 48, borderRadius: 14, borderWidth: 2, borderColor: C.line, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }, resultCard: { backgroundColor: C.white, borderRadius: 24, padding: 28, alignItems: 'center', marginVertical: 30, elevation: 3 }, resultEmoji: { fontSize: 65 }, resultTitle: { color: C.ink, fontSize: 25, fontWeight: '900', marginTop: 10 },
  aboutTitle: { color: C.ink, fontSize: 20, fontWeight: '900', marginBottom: 12 }, aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 }, aboutText: { flex: 1, color: C.ink, fontSize: 15 }, menuButton: { marginLeft: 13, padding: 4 },
  dateHeadingOuter: { borderRadius: 18, marginBottom: 15, shadowColor: '#123D33', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 }, dateHeading: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, dateEyebrow: { color: '#AEE0D0', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, dateTitle: { color: C.white, fontSize: 17, fontWeight: '900', marginTop: 4 }, calendarIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  modalShade: { flex: 1, backgroundColor: 'rgba(8,31,25,0.58)', justifyContent: 'center', padding: 20 }, calendarCard: { backgroundColor: C.white, borderRadius: 26, padding: 19, elevation: 10 }, calendarTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }, calendarArrow: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, calendarMonth: { color: C.ink, fontSize: 22, fontWeight: '900', textAlign: 'center' }, calendarYear: { color: C.muted, fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: 2 }, calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' }, weekdayName: { width: '14.285%', color: C.muted, fontSize: 12, fontWeight: '900', textAlign: 'center', paddingVertical: 8 }, calendarCell: { width: '14.285%', height: 43, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, calendarCellActive: { backgroundColor: C.green }, calendarDay: { color: C.ink, fontSize: 15, fontWeight: '700' }, calendarDayActive: { color: C.white, fontWeight: '900' }, calendarDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.green, marginTop: 2 }, calendarDotActive: { backgroundColor: C.white }, todayButton: { minHeight: 45, borderRadius: 13, backgroundColor: C.mint, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 14 }, todayText: { color: C.dark, fontWeight: '900' }, closeCalendar: { color: C.muted, fontWeight: '800', textAlign: 'center', paddingTop: 16, paddingBottom: 2 },
  historyRow: { minHeight: 59, borderBottomWidth: 1, borderBottomColor: '#EDF3F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }, historyDate: { color: C.ink, fontWeight: '800', flex: 1, paddingRight: 8 }, historyValue: { color: C.dark, fontWeight: '900', textAlign: 'right' }, historyStatus: { fontSize: 11, fontWeight: '800', textAlign: 'right', marginTop: 2 }, emptyHistory: { color: C.muted, textAlign: 'center', paddingVertical: 22 }, exerciseNameBox: { flex: 1, marginLeft: 13 }, exerciseSaved: { color: C.muted, fontSize: 11, marginTop: 3 }, exerciseHistoryName: { flex: 1, color: C.ink, fontWeight: '800', paddingRight: 8 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }, welcomeCopy: { flex: 1, paddingRight: 10 }, welcomeTitle: { color: C.ink, fontSize: 29, fontWeight: '900', marginTop: 5 }, welcomeDate: { color: C.muted, fontSize: 13, marginTop: 4 }, scoreCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.green }, scoreNumber: { color: C.green, fontSize: 24, lineHeight: 27, fontWeight: '900' }, scoreTotal: { color: C.dark, fontSize: 10, fontWeight: '800' }, dailyBanner: { backgroundColor: C.dark, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }, dailyBannerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }, dailyBannerCopy: { flex: 1, marginLeft: 13 }, dailyBannerTitle: { color: C.white, fontSize: 16, fontWeight: '900' }, dailyBannerText: { color: '#BFE3D7', fontSize: 12, marginTop: 3 },
  dashboardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, dashboardCard: { width: '48%', backgroundColor: C.white, borderRadius: 20, padding: 15, marginBottom: 13, elevation: 2 }, dashboardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, dashboardIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, dashboardEmoji: { fontSize: 24 }, dashboardLabel: { color: C.muted, fontSize: 12, fontWeight: '800', marginTop: 11 }, dashboardValue: { color: C.ink, fontSize: 19, fontWeight: '900', marginTop: 2 }, dashboardDetail: { color: C.muted, fontSize: 10, height: 28, marginTop: 3 }, miniProgress: { height: 7, borderRadius: 4, backgroundColor: '#E8EFED', overflow: 'hidden', marginTop: 8 }, miniProgressFill: { height: '100%', borderRadius: 4 },
  streakCard: { backgroundColor: '#FFF2E8', borderRadius: 19, padding: 15, flexDirection: 'row', alignItems: 'center', marginTop: 2 }, streakIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFE0CD', alignItems: 'center', justifyContent: 'center' }, streakCopy: { flex: 1, marginLeft: 12 }, streakTitle: { color: '#763E21', fontSize: 15, fontWeight: '900' }, streakText: { color: '#946348', fontSize: 11, marginTop: 3 }, streakNumber: { color: '#E9783D', fontSize: 29, fontWeight: '900' }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, marginBottom: 11 }, sectionTitleCompact: { color: C.ink, fontSize: 19, fontWeight: '900' }, sectionLink: { color: C.green, fontSize: 12, fontWeight: '900' },
  chartCard: { backgroundColor: C.white, borderRadius: 20, padding: 16, elevation: 2 }, chartLegend: { flexDirection: 'row', justifyContent: 'flex-end', gap: 14 }, legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, legendDot: { width: 8, height: 8, borderRadius: 4 }, legendText: { color: C.muted, fontSize: 10, fontWeight: '700' }, chartRows: { height: 92, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 5 }, chartColumn: { flex: 1, alignItems: 'center' }, bars: { height: 66, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }, chartBar: { width: 8, borderRadius: 4 }, chartDay: { color: C.muted, fontSize: 10, fontWeight: '800', marginTop: 5 }, gamePromo: { backgroundColor: C.mint, borderRadius: 21, padding: 19, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, gamePromoOverline: { color: C.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 }, gamePromoTitle: { color: C.ink, fontSize: 21, fontWeight: '900', marginTop: 4 }, gamePromoText: { color: C.muted, fontSize: 12, marginTop: 3 }, playCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  memoryWelcome: { alignItems: 'center', paddingTop: 10, paddingBottom: 21 }, memoryWelcomeIcon: { width: 65, height: 65, borderRadius: 22, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginBottom: 13, elevation: 5 }, memoryWelcomeOverline: { color: C.green, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 }, memoryWelcomeTitle: { color: C.ink, fontSize: 29, fontWeight: '900', marginTop: 5 }, memoryWelcomeText: { color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 6 }, themeGrid: { gap: 11 }, memoryThemeCard: { minHeight: 91, backgroundColor: C.card, borderRadius: 21, borderWidth: 1, borderColor: C.line, padding: 13, flexDirection: 'row', alignItems: 'center', elevation: 2 }, memoryThemeFeatured: { borderColor: C.green, borderWidth: 2 }, memoryThemeIcon: { width: 59, height: 59, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, memoryThemeEmoji: { fontSize: 32 }, memoryThemeCopy: { flex: 1, marginLeft: 13 }, memoryThemeNumber: { color: C.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, memoryThemeName: { color: C.ink, fontSize: 19, fontWeight: '900', marginTop: 2 }, memoryThemeSubtitle: { color: C.muted, fontSize: 11, marginTop: 2 }, memoryThemePlay: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, memoryInternetNote: { color: C.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 15 }, changeThemeButton: { alignSelf: 'flex-start', minHeight: 34, borderRadius: 11, backgroundColor: C.mint, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, marginBottom: 8 }, changeThemeText: { color: C.green, fontSize: 11, fontWeight: '900' }, gameSubtitle: { color: C.muted, fontSize: 11, marginTop: 2 }, cardImage: { width: '82%', height: '68%' }, cardBackEmoji: { fontSize: 30, marginBottom: 4 },
  goalIntro: { backgroundColor: C.mint, borderRadius: 17, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 14 }, goalIntroText: { flex: 1, color: C.dark, lineHeight: 19, fontSize: 13 }, goalCard: { backgroundColor: C.white, borderRadius: 20, padding: 15, marginBottom: 12, elevation: 2 }, goalIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, goalCopy: { position: 'absolute', left: 76, top: 16, right: 14 }, goalLabel: { color: C.ink, fontSize: 17, fontWeight: '900' }, goalDescription: { color: C.muted, fontSize: 11, marginTop: 2 }, goalCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 17 }, goalButton: { width: 43, height: 43, borderRadius: 14, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, goalButtonText: { color: C.dark, fontSize: 27, fontWeight: '700' }, goalValueBox: { minWidth: 90, alignItems: 'center' }, goalValue: { color: C.green, fontSize: 27, lineHeight: 30, fontWeight: '900' }, goalUnit: { color: C.muted, fontSize: 10, fontWeight: '700' }, resetGoals: { minHeight: 49, borderWidth: 2, borderColor: C.line, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 5 }, resetGoalsText: { color: C.dark, fontWeight: '900' },
  statsSummaryGrid: { flexDirection: 'row', gap: 10 }, statsSummaryCard: { flex: 1, backgroundColor: C.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.line, elevation: 2 }, statsSummaryOverline: { color: C.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, statsSummaryValue: { color: C.green, fontSize: 34, fontWeight: '900', marginTop: 6 }, statsSummaryText: { color: C.muted, fontSize: 10, lineHeight: 14, marginTop: 2 }, comparisonCard: { backgroundColor: C.card, borderRadius: 19, borderLeftWidth: 4, padding: 14, flexDirection: 'row', alignItems: 'center', marginTop: 11, elevation: 2 }, comparisonIcon: { width: 49, height: 49, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, comparisonCopy: { flex: 1, marginLeft: 12 }, comparisonTitle: { color: C.ink, fontSize: 15, fontWeight: '900' }, comparisonText: { color: C.muted, fontSize: 10, marginTop: 4 }, weeklyChart: { height: 194, backgroundColor: C.card, borderRadius: 21, borderWidth: 1, borderColor: C.line, paddingHorizontal: 10, paddingTop: 17, paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-end', elevation: 2 }, weeklyColumn: { flex: 1, alignItems: 'center' }, weeklyValue: { color: C.muted, fontSize: 8, fontWeight: '800', marginBottom: 5 }, weeklyTrack: { height: 125, width: 22, borderRadius: 11, backgroundColor: C.line, overflow: 'hidden', justifyContent: 'flex-end' }, weeklyFill: { width: '100%', borderRadius: 11, backgroundColor: C.green }, weeklyDay: { color: C.dark, fontSize: 10, fontWeight: '900', marginTop: 6 }, bestDayCard: { backgroundColor: C.cream, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginTop: 11, borderWidth: 1, borderColor: C.orange }, bestDayIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: '#FFE4A5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }, bestDayOverline: { color: C.orange, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, bestDayTitle: { color: C.ink, fontSize: 14, fontWeight: '900', marginTop: 3 }, bestDayText: { color: C.muted, fontSize: 10, marginTop: 2 }, habitStats: { backgroundColor: C.card, borderRadius: 21, padding: 15, borderWidth: 1, borderColor: C.line, gap: 15, elevation: 2 }, habitStatRow: { flexDirection: 'row', alignItems: 'center' }, habitStatIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, habitStatCopy: { flex: 1, marginLeft: 11 }, habitStatTop: { flexDirection: 'row', justifyContent: 'space-between' }, habitStatLabel: { color: C.ink, fontSize: 13, fontWeight: '900' }, habitStatValue: { fontSize: 13, fontWeight: '900' }, habitStatTrack: { height: 8, borderRadius: 4, backgroundColor: C.line, overflow: 'hidden', marginTop: 6 }, habitStatFill: { height: '100%', borderRadius: 4 }, habitStatHint: { color: C.muted, fontSize: 8, marginTop: 4 }, monthChart: { height: 190, backgroundColor: C.card, borderRadius: 21, borderWidth: 1, borderColor: C.line, padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', elevation: 2 }, monthColumn: { flex: 1, alignItems: 'center' }, monthTrack: { height: 125, width: 43, backgroundColor: C.line, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' }, monthFill: { width: '100%', backgroundColor: C.teal, borderRadius: 12 }, monthValue: { color: C.green, fontSize: 10, fontWeight: '900', marginTop: 5 }, monthLabel: { color: C.muted, fontSize: 8, marginTop: 2 },
  profileCard: { backgroundColor: C.white, borderRadius: 24, padding: 17, shadowColor: '#17483C', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, profileAvatarArea: { borderRadius: 20, paddingVertical: 22, alignItems: 'center', marginBottom: 20 }, profileAvatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.green, shadowColor: '#17483C', shadowOpacity: 0.16, shadowRadius: 10, elevation: 4 }, profileAvatarEmoji: { fontSize: 49 }, profilePreviewName: { color: C.ink, fontSize: 22, fontWeight: '900', marginTop: 11 }, profilePreviewGoal: { color: C.muted, fontSize: 12, marginTop: 3 }, profileSectionLabel: { color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 5, marginBottom: 10 }, avatarList: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }, avatarChoice: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#F3F7F5', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' }, avatarChoiceActive: { backgroundColor: C.mint, borderColor: C.green }, avatarChoiceEmoji: { fontSize: 24 }, avatarCheck: { position: 'absolute', right: -3, bottom: -3, width: 18, height: 18, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }, profileInputRow: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: '#FAFCFB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }, profileInput: { flex: 1, color: C.ink, fontSize: 16, marginLeft: 10, paddingVertical: 11 }, profileFieldGap: { marginTop: 14 }, objectiveList: { gap: 8, marginBottom: 17 }, objectiveChoice: { minHeight: 49, borderRadius: 14, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }, objectiveChoiceActive: { backgroundColor: C.mint, borderColor: C.green }, objectiveRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#A8B8B3', alignItems: 'center', justifyContent: 'center' }, objectiveRadioActive: { borderColor: C.green }, objectiveRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.green }, objectiveText: { flex: 1, color: C.muted, fontSize: 13, fontWeight: '700', marginLeft: 10 }, objectiveTextActive: { color: C.dark, fontWeight: '900' }, autoSaveBox: { backgroundColor: '#EFF8F4', borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }, autoSaveTitle: { color: C.dark, fontSize: 12, fontWeight: '900' }, autoSaveText: { color: C.muted, fontSize: 10, marginTop: 2 },
  drawerRoot: { flex: 1, backgroundColor: '#F7FAF8' }, drawerHero: { paddingTop: 46, paddingHorizontal: 20, paddingBottom: 19, overflow: 'hidden' }, drawerGlowOne: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.07)', right: -65, top: -70 }, drawerGlowTwo: { position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(69,196,154,0.16)', left: -45, bottom: -45 }, drawerBrandRow: { flexDirection: 'row', alignItems: 'center' }, drawerLogo: { width: 55, height: 55, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#001E17', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 }, drawerLogoEmoji: { fontSize: 31 }, drawerBrand: { color: C.white, fontSize: 27, fontWeight: '900', marginLeft: 13, letterSpacing: 0.5 }, drawerTagline: { color: '#BFE3D7', fontSize: 10, fontWeight: '700', marginLeft: 13, marginTop: 2 }, drawerProfile: { minHeight: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 15 }, drawerProfileAvatar: { width: 39, height: 39, borderRadius: 13, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, drawerProfileEmoji: { fontSize: 22 }, drawerProfileCopy: { flex: 1, marginLeft: 10 }, drawerProfileName: { color: C.white, fontSize: 13, fontWeight: '900' }, drawerProfileGoal: { color: '#BFE3D7', fontSize: 9, marginTop: 2 }, drawerProgressCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 17, padding: 13, marginTop: 11 }, drawerProgressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, drawerProgressTitle: { color: '#E8F7F2', fontSize: 12, fontWeight: '800' }, drawerProgressScore: { color: C.white, fontSize: 16, fontWeight: '900' }, drawerProgressTrack: { height: 7, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 4, marginTop: 9, overflow: 'hidden' }, drawerProgressFill: { height: '100%', backgroundColor: '#79E0BD', borderRadius: 4 }, drawerProgressHint: { color: '#BFE3D7', fontSize: 10, marginTop: 7 },
  drawerScroll: { paddingTop: 13, paddingHorizontal: 12, paddingBottom: 18 }, drawerSectionLabel: { color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.4, marginLeft: 11, marginBottom: 8 }, drawerItem: { minHeight: 65, borderRadius: 18, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', marginBottom: 5, borderWidth: 1, borderColor: 'transparent' }, drawerItemActive: { backgroundColor: C.white, borderColor: C.line, shadowColor: '#154B3D', shadowOpacity: 0.09, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, drawerItemPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] }, drawerItemIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, drawerItemCopy: { flex: 1, marginLeft: 12 }, drawerItemTitle: { color: C.muted, fontSize: 15, fontWeight: '800' }, drawerItemTitleActive: { color: C.ink, fontWeight: '900' }, drawerItemSubtitle: { color: C.muted, fontSize: 10, marginTop: 2 }, drawerActiveDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 }, drawerQuote: { backgroundColor: C.cream, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 3, marginTop: 9 }, drawerQuoteText: { flex: 1, color: C.dark, fontSize: 11, lineHeight: 16, fontStyle: 'italic' }, drawerFooter: { paddingHorizontal: 22, paddingBottom: 22, paddingTop: 8, backgroundColor: C.bg }, drawerFooterLine: { height: 1, backgroundColor: C.line, marginBottom: 13 }, drawerFooterText: { color: C.dark, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, drawerFooterVersion: { color: C.muted, fontSize: 9, marginTop: 3 },
  splashLogoImage: { width: '100%', height: '100%', borderRadius: 67 }, drawerLogoImage: { width: '100%', height: '100%', borderRadius: 18 },
  appearancePreview: { backgroundColor: C.card, borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, elevation: 2 }, appearanceLogo: { width: 58, height: 58, borderRadius: 17, overflow: 'hidden' }, appearanceLogoImage: { width: '100%', height: '100%' }, appearancePreviewCopy: { flex: 1, marginLeft: 13 }, appearancePreviewTitle: { color: C.ink, fontSize: 17, fontWeight: '900' }, appearancePreviewText: { color: C.muted, fontSize: 12, marginTop: 3 }, appearanceHeading: { color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginTop: 22, marginBottom: 10 }, themeList: { gap: 10 }, themeOption: { minHeight: 76, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 13, flexDirection: 'row', alignItems: 'center' }, themeOptionActive: { borderColor: C.green, borderWidth: 2, backgroundColor: C.mint }, themeOptionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, themeOptionIconActive: { backgroundColor: C.green }, themeOptionCopy: { flex: 1, marginLeft: 12 }, themeOptionTitle: { color: C.ink, fontSize: 15, fontWeight: '900' }, themeOptionTitleActive: { color: C.dark }, themeOptionText: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 3 }, themeInfo: { backgroundColor: C.card, borderRadius: 15, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }, themeInfoText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18 },
  };
  if (C.bg === DARK_COLORS.bg) {
    const lightSurfaces = new Set(['#FFFFFF', '#FAFCFB', '#F7FAF8', '#F3F7F5', '#EFF8F4', 'rgba(255,255,255,0.96)']);
    Object.values(definitions).forEach((style) => {
      if (lightSurfaces.has(style.backgroundColor)) style.backgroundColor = style.backgroundColor === '#FFFFFF' || style.backgroundColor.startsWith('rgba') ? C.card : C.input;
      if (['#EDF3F1', '#E3ECE9', '#E8EFED'].includes(style.backgroundColor)) style.backgroundColor = C.line;
    });
  }
  return StyleSheet.create(definitions);
}
