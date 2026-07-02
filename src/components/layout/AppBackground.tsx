import React from 'react';
import { StyleSheet, View, Dimensions, ViewStyle } from 'react-native';
import Svg, { Circle, Rect, Defs, RadialGradient, Stop, Path, G } from 'react-native-svg';
import { Colors } from '../../theme/Colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('screen');

interface AppBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AppBackground: React.FC<AppBackgroundProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Premium 3D Mesh & Organic Background */}
      <View style={[StyleSheet.absoluteFill, { width, height }]}>
        <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Soft Mesh Gradients */}
            <RadialGradient id="meshPurple" cx="20%" cy="20%" rx="60%" ry="60%" fx="20%" fy="20%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.25" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="0" />
            </RadialGradient>
            
            <RadialGradient id="meshNavy" cx="80%" cy="10%" rx="50%" ry="50%" fx="80%" fy="10%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={Colors.secondary} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="meshAmber" cx="90%" cy="90%" rx="60%" ry="60%" fx="90%" fy="90%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={Colors.accent} stopOpacity="0.22" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="meshBlue" cx="10%" cy="80%" rx="50%" ry="50%" fx="10%" fy="80%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={Colors.info} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="0" />
            </RadialGradient>

            {/* Glassmorphic Shape Gradient */}
            <RadialGradient id="glassGrad" cx="50%" cy="50%" rx="50%" ry="50%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
            </RadialGradient>
          </Defs>

          {/* 1. Base Solid Color */}
          <Rect width="100%" height="100%" fill={Colors.background} />

          {/* 2. Layered Mesh Blobs */}
          <Rect width="100%" height="100%" fill="url(#meshPurple)" />
          <Rect width="100%" height="100%" fill="url(#meshNavy)" />
          <Rect width="100%" height="100%" fill="url(#meshAmber)" />
          <Rect width="100%" height="100%" fill="url(#meshBlue)" />

          {/* 3. Floating 3D Organic Shapes */}
          <G opacity="0.6">
            <Path
              d={`M${width * 0.1},${height * 0.2} Q${width * 0.3},${height * 0.1} ${width * 0.5},${height * 0.25} T${width * 0.8},${height * 0.15}`}
              stroke={Colors.primary}
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <Path
              d={`M${width * -0.1},${height * 0.5} Q${width * 0.2},${height * 0.7} ${width * 0.4},${height * 0.55} T${width * 1.1},${height * 0.6}`}
              stroke={Colors.secondary}
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
          </G>

          {/* 4. Glass-like Floating Elements */}
          <Circle cx={width * 0.85} cy={height * 0.3} r={wp('15%')} fill="url(#glassGrad)" />
          <Circle cx={width * 0.15} cy={height * 0.7} r={wp('10%')} fill="url(#glassGrad)" />

          {/* 5. Modern Dot Pattern (3D Texture) */}
          {[...Array(15)].map((_, i) => 
            [...Array(10)].map((_, j) => (
              <Circle 
                key={`dot-${i}-${j}`}
                cx={(width / 10) * j + (width / 20)}
                cy={(height / 15) * i + (height / 30)}
                r="1.2"
                fill={Colors.secondary}
                opacity="0.1"
              />
            ))
          )}

          {/* 6. Accent Accent Lines */}
          <Path
            d={`M${width * 0.7},0 L${width},${height * 0.2}`}
            stroke={Colors.accent}
            strokeWidth="0.8"
            opacity="0.2"
          />
          <Path
            d={`M0,${height * 0.8} L${width * 0.3},${height}`}
            stroke={Colors.primary}
            strokeWidth="0.8"
            opacity="0.2"
          />
        </Svg>
      </View>

      {/* Content Layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});

export default AppBackground;
