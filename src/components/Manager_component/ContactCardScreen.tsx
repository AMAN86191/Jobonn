
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Image,
} from "react-native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../../theme";

interface ContactCardScreenProps {
    email?: string;
    phone?: string;
}

const ContactCardScreen: React.FC<ContactCardScreenProps> = ({ email, phone }) => {
    const openEmail = () => {
        if (email) Linking.openURL(`mailto:${email}`);
    };

    const openCall = () => {
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    const openWhatsapp = () => {
        if (phone) Linking.openURL(`https://wa.me/${phone}`);
    };

    return (
        <View style={styles.container}>

            {/* EMAIL CARD */}
            {!!email && (
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.card}
                    onPress={openEmail}
                >
                    <View style={styles.leftContainer}>

                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#EAF2FF" },
                            ]}
                        >
                            <Image
                                source={require("../../../assets/images/email.png")}
                                style={[styles.icon, { tintColor: "#2563EB" }]}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>
                                Email
                            </Text>

                            <Text
                                style={styles.value}
                                numberOfLines={1}
                            >
                                {email}
                            </Text>
                        </View>
                    </View>

                    <Image
                        source={require("../../../assets/images/email.png")}
                        style={[styles.iconSmall, { tintColor: "#94A3B8" }]}
                    />
                </TouchableOpacity>
            )}

            {/* PHONE CARD */}
            {!!phone && (
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.card}
                    onPress={openCall}
                >
                    <View style={styles.leftContainer}>

                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#EAFBF3" },
                            ]}
                        >
                            <Image
                                source={require("../../../assets/images/phone-call.png")}
                                style={[styles.icon, { tintColor: "#16A34A" }]}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>
                                Phone
                            </Text>

                            <Text style={styles.value}>
                                {phone}
                            </Text>
                        </View>
                    </View>

                    <Image
                        source={require("../../../assets/images/phone-call.png")}
                        style={[styles.iconSmall, { tintColor: "#94A3B8" }]}
                    />
                </TouchableOpacity>
            )}

            {/* WHATSAPP CARD */}
            {!!phone && (
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.card}
                    onPress={openWhatsapp}
                >
                    <View style={styles.leftContainer}>

                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#ECFDF3" },
                            ]}
                        >
                            <Image
                                source={require("../../../assets/images/whatsapp_bold.png")}
                                style={[styles.icon, { tintColor: "#22C55E" }]}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>
                                WhatsApp
                            </Text>

                            <Text style={styles.value}>
                                {phone}
                            </Text>
                        </View>
                    </View>

                    <Image
                        source={require("../../../assets/images/whatsapp_bold.png")}
                        style={[styles.iconSmall, { tintColor: "#94A3B8" }]}
                    />
                </TouchableOpacity>
            )}

        </View>
    );
};

export default ContactCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        // paddingTop: hp("2%"),
    },

    card: {
        backgroundColor: Colors.white,

        borderRadius: wp("2%"),

        paddingVertical: hp("0.5%"),
        paddingHorizontal: wp("2%"),

        marginBottom: hp("1%"),

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 1,
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    iconBox: {
        width: wp("8%"),
        height: wp("8%"),

        borderRadius: wp("5%"),

        alignItems: "center",
        justifyContent: "center",
    },

    icon: {
        width: wp("4%"),
        height: wp("4%"),
        resizeMode: "contain",
    },

    iconSmall: {
        width: wp("4%"),
        height: wp("4%"),
        resizeMode: "contain",
    },

    textContainer: {
        marginLeft: wp("4%"),
        flex: 1,
    },

    label: {
        fontSize: RFValue(9),
        color: Colors.textSecondary,
        marginBottom: hp("0.3%"),
        fontWeight: "500",
    },

    value: {
        fontSize: RFValue(9),
        color: Colors.textPrimary,
        fontWeight: "500",
    },
});
