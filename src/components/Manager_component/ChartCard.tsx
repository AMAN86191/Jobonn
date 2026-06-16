import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Rect, Line, Text as SvgText, Circle, Polyline, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface BarChartData {
  label: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: BarChartData[];
  type?: 'bar' | 'line';
  color?: string;
}

const CHART_W = wp('88%');
const CHART_H = hp('14%');
const PAD_L = wp('7%');
const PAD_B = hp('2.8%');
const PLOT_W = CHART_W - PAD_L - wp('2%');
const PLOT_H = CHART_H - PAD_B - hp('1%');

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, data, type = 'bar', color = Colors.primary }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = PLOT_W / data.length - wp('1.5%');
  const barGap = PLOT_W / data.length;

  const points = data.map((d, i) => {
    const x = PAD_L + i * barGap + barGap / 2;
    const y = hp('1%') + PLOT_H - (d.value / maxVal) * PLOT_H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.chartArea}>
        <Svg width={CHART_W} height={CHART_H + PAD_B}>
          <Defs>
            <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.9" />
              <Stop offset="1" stopColor={color} stopOpacity="0.2" />
            </LinearGradient>
          </Defs>

          {[0, 0.5, 1].map((frac, i) => {
            const y = hp('1%') + PLOT_H * (1 - frac);
            const gridVal = Math.round(maxVal * frac);
            return (
              <React.Fragment key={i}>
                <Line
                  x1={PAD_L} y1={y} x2={CHART_W - wp('2%')} y2={y}
                  stroke={Colors.border} strokeWidth="0.6"
                  strokeDasharray={frac === 0 ? "0" : "3,3"}
                />
                <SvgText
                  x={PAD_L - wp('1%')} y={y + hp('0.4%')}
                  fontSize={wp('2.2%')} fill={Colors.textTertiary}
                  textAnchor="end"
                >
                  {gridVal > 0 ? gridVal : ''}
                </SvgText>
              </React.Fragment>
            );
          })}

          {type === 'bar' && data.map((d, i) => {
            const x = PAD_L + i * barGap + (barGap - barW) / 2;
            const barH = (d.value / maxVal) * PLOT_H;
            const y = hp('1%') + PLOT_H - barH;
            return (
              <React.Fragment key={i}>
                <Rect
                  x={x} y={y} width={barW} height={Math.max(barH, 2)}
                  fill="url(#barGrad)" rx={wp('1%')}
                />
                <SvgText
                  x={x + barW / 2} y={CHART_H + PAD_B - hp('0.3%')}
                  fontSize={wp('2%')} fill={Colors.textTertiary}
                  textAnchor="middle"
                >
                  {d.label}
                </SvgText>
              </React.Fragment>
            );
          })}

          {type === 'line' && (
            <>
              <Polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((d, i) => {
                const x = PAD_L + i * barGap + barGap / 2;
                const y = hp('1%') + PLOT_H - (d.value / maxVal) * PLOT_H;
                return (
                  <React.Fragment key={i}>
                    <Circle cx={x} cy={y} r={wp('1.2%')} fill={Colors.white} stroke={color} strokeWidth="1.5" />
                    <SvgText
                      x={x} y={CHART_H + PAD_B - hp('0.3%')}
                      fontSize={wp('2%')} fill={Colors.textTertiary}
                      textAnchor="middle"
                    >
                      {d.label}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    marginBottom: hp('1.5%'),
  },
  title: { fontSize: RFValue(10), fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: RFValue(8.5), color: Colors.textTertiary, marginTop: hp('0.2%') },
  chartArea: { alignItems: 'center' },
});

export default ChartCard;
